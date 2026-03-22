import { Client, TablesDB } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const db = new TablesDB(client);

  const DB = process.env.APPWRITE_DATABASE_ID;
  const DELIVERIES = process.env.APPWRITE_DELIVERIES_COLLECTION_ID;
  const USERS = process.env.APPWRITE_USERS_COLLECTION_ID;
  const ORGS = process.env.APPWRITE_ORGANISATION_COLLECTION_ID;
  const DISPATCH = process.env.APPWRITE_DISPATCH_QUEUE_COLLECTION_ID;

  // ── Parse body ─────────────────────────────────────────────────────────────
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  if (typeof body?.body === 'string') {
    try {
      body = JSON.parse(body.body);
    } catch {}
  }

  const { queueId, action } = body ?? {};
  if (!queueId || !action) {
    return res.json({ ok: false, reason: 'missing queueId or action' }, 400);
  }

  // ── Load queue ─────────────────────────────────────────────────────────────
  let queue;
  try {
    queue = await db.getRow({
      databaseId: DB,
      tableId: DISPATCH,
      rowId: queueId,
    });
  } catch (e) {
    error('Queue not found: ' + e.message);
    return res.json({ ok: false, reason: 'queue_not_found' }, 404);
  }

  if (queue.status !== 'pending') {
    log('Queue ' + queueId + ' already resolved: ' + queue.status);
    return res.json({ ok: false, reason: 'already_resolved' });
  }

  // ── Parse ranked couriers ──────────────────────────────────────────────────
  let rankedCouriers = [];
  try {
    rankedCouriers = JSON.parse(queue.rankedCouriersJson ?? '[]');
  } catch {
    error('Could not parse rankedCouriersJson');
    return res.json({ ok: false, reason: 'invalid_queue_data' }, 500);
  }

  const currentIndex = queue.attemptIndex ?? 0;
  const currentCourierId = queue.currentCourierId;
  const currentEntry = rankedCouriers[currentIndex];
  const currentIsAgency = currentEntry?.entityType === 'agency';

  const collectionFor = (entry) =>
    entry?.entityType === 'agency' ? ORGS : USERS;

  // ── Reset current entity back to available ─────────────────────────────────
  // agencies: status is boolean — use isAvailable to restore availability
  // couriers: status is text — restore to 'available'
  try {
    await db.updateRow({
      databaseId: DB,
      tableId: collectionFor(currentEntry),
      rowId: currentCourierId,
      data: currentIsAgency
        ? { isAvailable: true, currentOfferId: null, offerExpiresAt: null }
        : { status: 'available', currentOfferId: null, offerExpiresAt: null },
    });
  } catch (e) {
    log('Could not reset entity ' + currentCourierId + ': ' + e.message);
  }

  // ── ACCEPT ─────────────────────────────────────────────────────────────────
  if (action === 'accept') {
    try {
      const isAgency = currentIsAgency;

      // Route assignment to correct field based on entity type
      const deliveryUpdate = isAgency
        ? {
            status: 'pending', // agency still assigns a driver
            assignedAgencyId: currentCourierId,
            assignedCourierId: null,
            assignedAt: new Date().toISOString(),
          }
        : {
            status: 'assigned', // courier handles directly
            assignedCourierId: currentCourierId,
            assignedAgencyId: null,
            assignedAt: new Date().toISOString(),
          };

      await db.updateRow({
        databaseId: DB,
        tableId: DELIVERIES,
        rowId: queue.deliveryId,
        data: deliveryUpdate,
      });

      // Mark entity as on_delivery
      // agencies: isAvailable stays false (already reset above), just clear offer fields
      // couriers: set status to 'on_delivery'
      await db.updateRow({
        databaseId: DB,
        tableId: collectionFor(currentEntry),
        rowId: currentCourierId,
        data: isAgency
          ? { isAvailable: false, currentOfferId: null }
          : { status: 'on_delivery', currentOfferId: null },
      });

      await db.updateRow({
        databaseId: DB,
        tableId: DISPATCH,
        rowId: queueId,
        data: { status: 'accepted' },
      });

      log(
        'Delivery ' +
          queue.deliveryId +
          ' accepted by ' +
          currentEntry?.entityType +
          ' ' +
          currentCourierId
      );
      return res.json({
        ok: true,
        assigned: true,
        courierId: currentCourierId,
        entityType: currentEntry?.entityType,
      });
    } catch (e) {
      error('Accept failed: ' + e.message);
      return res.json({ ok: false, reason: 'accept_failed' }, 500);
    }
  }

  // ── DECLINE or TIMEOUT ─────────────────────────────────────────────────────
  const nextIndex = currentIndex + 1;

  if (nextIndex >= rankedCouriers.length) {
    await db
      .updateRow({
        databaseId: DB,
        tableId: DISPATCH,
        rowId: queueId,
        data: { status: 'failed', failReason: 'all_rejected' },
      })
      .catch(() => {});
    await db
      .updateRow({
        databaseId: DB,
        tableId: DELIVERIES,
        rowId: queue.deliveryId,
        data: { status: 'no_couriers' },
      })
      .catch(() => {});
    log(
      'All ' +
        rankedCouriers.length +
        ' candidates rejected delivery ' +
        queue.deliveryId
    );
    return res.json({ ok: true, assigned: false, reason: 'all_rejected' });
  }

  const nextEntry = rankedCouriers[nextIndex];
  const nextCourierId = nextEntry.courierId;
  const nextIsAgency = nextEntry.entityType === 'agency';
  const expiresAt = new Date(Date.now() + 20 * 1000).toISOString();

  await db
    .updateRow({
      databaseId: DB,
      tableId: DISPATCH,
      rowId: queueId,
      data: {
        currentCourierId: nextCourierId,
        attemptIndex: nextIndex,
        expiresAt,
      },
    })
    .catch((e) => error('Queue advance failed: ' + e.message));

  // Mark next candidate as offered — respect the status field type per collection
  await db
    .updateRow({
      databaseId: DB,
      tableId: collectionFor(nextEntry),
      rowId: nextCourierId,
      data: nextIsAgency
        ? {
            isAvailable: false,
            currentOfferId: queue.deliveryId,
            offerExpiresAt: expiresAt,
          }
        : {
            status: 'offered',
            currentOfferId: queue.deliveryId,
            offerExpiresAt: expiresAt,
          },
    })
    .catch((e) => log('Could not mark next entity as offered: ' + e.message));

  log(
    'Advanced to ' +
      nextEntry.entityType +
      ' ' +
      (nextIndex + 1) +
      '/' +
      rankedCouriers.length +
      ': ' +
      nextCourierId
  );
  return res.json({
    ok: true,
    assigned: false,
    nextCourierId,
    nextEntityType: nextEntry.entityType,
    attemptIndex: nextIndex,
  });
};
