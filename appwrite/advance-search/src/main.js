import { Client, TablesDB } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const db = new TablesDB(client);

  const DB = process.env.APPWRITE_DATABASE_ID;
  const DELIVERIES = process.env.APPWRITE_DELIVERIES_COLLECTION_ID;
  const USERS = process.env.APPWRITE_USERS_COLLECTION_ID; // freelance couriers
  const ORGS = process.env.APPWRITE_ORGANISATION_COLLECTION_ID; // agencies
  const DISPATCH = process.env.APPWRITE_DISPATCH_QUEUE_COLLECTION_ID;

  // ── Parse body ────────────────────────────────────────────────────────────
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

  // ── Load queue doc ────────────────────────────────────────────────────────
  let queue;
  try {
    queue = await db.getRow({
      databaseId: DB,
      tableId: DISPATCH,
      rowId: queueId,
    });
  } catch (e) {
    error(`Queue not found: ${e.message}`);
    return res.json({ ok: false, reason: 'queue_not_found' }, 404);
  }

  if (queue.status !== 'pending') {
    log(`Queue ${queueId} already resolved: ${queue.status}`);
    return res.json({ ok: false, reason: 'already_resolved' });
  }

  // ── Parse ranked couriers JSON to know entity types ───────────────────────
  // rankedCouriersJson is an array of { courierId, entityType, name, ... }
  // This is what dispatch-search wrote when it created the queue.
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

  // ── Helper: resolve the right collection for an entity ────────────────────
  const collectionFor = (entry) =>
    entry?.entityType === 'agency' ? ORGS : USERS;

  // ── Reset current entity back to available ────────────────────────────────
  // This must happen for ALL actions (accept, decline, timeout)
  // before we do anything else.
  try {
    await db.updateRow({
      databaseId: DB,
      tableId: collectionFor(currentEntry),
      rowId: currentCourierId,
      data: {
        status: 'available',
        currentOfferId: null,
        offerExpiresAt: null,
      },
    });
  } catch (e) {
    // Non-critical: log but don't abort — the delivery must still be handled
    log(`Could not reset entity ${currentCourierId}: ${e.message}`);
  }

  // ── ACCEPT ────────────────────────────────────────────────────────────────
  if (action === 'accept') {
    try {
      // 1. Mark delivery as assigned
      await db.updateRow({
        databaseId: DB,
        tableId: DELIVERIES,
        rowId: queue.deliveryId,
        data: {
          status: 'assigned',
          assignedCourierId: currentCourierId,
          assignedAt: new Date().toISOString(),
        },
      });

      // 2. Mark courier/agency as on_delivery
      await db.updateRow({
        databaseId: DB,
        tableId: collectionFor(currentEntry),
        rowId: currentCourierId,
        data: {
          status: 'on_delivery',
          currentOfferId: null,
        },
      });

      // 3. Close queue
      await db.updateRow({
        databaseId: DB,
        tableId: DISPATCH,
        rowId: queueId,
        data: { status: 'accepted' },
      });

      log(
        `Delivery ${queue.deliveryId} accepted by ${currentEntry?.entityType} ${currentCourierId}`
      );
      return res.json({
        ok: true,
        assigned: true,
        courierId: currentCourierId,
      });
    } catch (e) {
      error(`Accept failed: ${e.message}`);
      return res.json({ ok: false, reason: 'accept_failed' }, 500);
    }
  }

  // ── DECLINE or TIMEOUT — try next candidate ───────────────────────────────
  const nextIndex = currentIndex + 1;

  if (nextIndex >= rankedCouriers.length) {
    // All candidates exhausted
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
      `All ${rankedCouriers.length} candidates rejected delivery ${queue.deliveryId}`
    );
    return res.json({ ok: true, assigned: false, reason: 'all_rejected' });
  }

  const nextEntry = rankedCouriers[nextIndex];
  const nextCourierId = nextEntry.courierId;
  const expiresAt = new Date(Date.now() + 20 * 1000).toISOString();

  // Update queue to point at next candidate
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
    .catch((e) => error(`Queue advance failed: ${e.message}`));

  // Offer the next candidate — route to correct collection
  await db
    .updateRow({
      databaseId: DB,
      tableId: collectionFor(nextEntry),
      rowId: nextCourierId,
      data: {
        status: 'offered',
        currentOfferId: queue.deliveryId,
        offerExpiresAt: expiresAt,
      },
    })
    .catch((e) => log(`Could not mark next entity as offered: ${e.message}`));

  log(
    `Advance to ${nextEntry.entityType} ${nextIndex + 1}/${rankedCouriers.length}: ${nextCourierId}`
  );
  return res.json({
    ok: true,
    assigned: false,
    nextCourierId,
    nextEntityType: nextEntry.entityType,
    attemptIndex: nextIndex,
  });
};
