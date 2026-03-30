import { Client, TablesDB } from 'node-appwrite';

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const generatePickupCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

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

  // ── Notify helper — looks up pushTargetId from collection doc ──────────────
  const notifyEntity = async (entityId, tableId, title, body) => {
    try {
      const doc = await db.getRow({ databaseId: DB, tableId, rowId: entityId });
      const pushTargetId = doc.pushTargetId ?? null;
      if (!pushTargetId) {
        log('No pushTargetId for entity ' + entityId + ', skipping notify');
        return;
      }
      await fetch(`${process.env.APP_URL}/route/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targets: [pushTargetId], title, body }),
      }).catch(() => {});
    } catch (e) {
      log('notifyEntity failed for ' + entityId + ': ' + e.message);
    }
  };

  // ── Parse body ─────────────────────────────────────────────────────────────
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (typeof body?.body === 'string') {
    try { body = JSON.parse(body.body); } catch {}
  }

  const { queueId, action } = body ?? {};
  if (!queueId || !action) {
    return res.json({ ok: false, reason: 'missing queueId or action' }, 400);
  }

  // ── Load queue ─────────────────────────────────────────────────────────────
  let queue;
  try {
    queue = await db.getRow({ databaseId: DB, tableId: DISPATCH, rowId: queueId });
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
      const pickupCode = generatePickupCode();
      const dropoffOTP = generateOTP();

      let senderId = null;
      try {
        const delivery = await db.getRow({
          databaseId: DB,
          tableId: DELIVERIES,
          rowId: queue.deliveryId,
        });
        senderId = delivery.userId ?? delivery.senderId ?? null;
      } catch (e) {
        log('Could not load delivery for senderId: ' + e.message);
      }

      let driverName = null;
      let driverPhone = null;
      try {
        const profile = await db.getRow({
          databaseId: DB,
          tableId: collectionFor(currentEntry),
          rowId: currentCourierId,
        });
        driverName = profile.userName ?? profile.name ?? null;
        driverPhone = profile.phone ?? null;
      } catch (e) {
        log('Could not load entity profile: ' + e.message);
      }

      const deliveryUpdate = currentIsAgency
        ? {
            status: 'pending',
            assignedAgencyId: currentCourierId,
            assignedCourierId: null,
            pickupCode,
            dropoffOTP,
            driverName,
            driverPhone,
          }
        : {
            status: 'assigned',
            assignedCourierId: currentCourierId,
            assignedAgencyId: null,
            pickupCode,
            dropoffOTP,
            driverName,
            driverPhone,
          };

      await db.updateRow({
        databaseId: DB,
        tableId: DELIVERIES,
        rowId: queue.deliveryId,
        data: deliveryUpdate,
      });

      await db.updateRow({
        databaseId: DB,
        tableId: collectionFor(currentEntry),
        rowId: currentCourierId,
        data: currentIsAgency
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
        'Delivery ' + queue.deliveryId + ' accepted by ' +
        currentEntry?.entityType + ' ' + currentCourierId +
        ' | pickupCode: ' + pickupCode
      );

      // ── Notify sender ──────────────────────────────────────────────────────
      if (senderId) {
        const entityLabel = currentIsAgency ? 'An agency' : 'A courier';
        await notifyEntity(
          senderId,
          USERS,
          '🚀 Courier Found!',
          `${entityLabel} has accepted your delivery and is on the way.`
        );
      }

      return res.json({
        ok: true,
        assigned: true,
        courierId: currentCourierId,
        entityType: currentEntry?.entityType,
        pickupCode,
        dropoffOTP,
      });
    } catch (e) {
      error('Accept failed: ' + e.message);
      return res.json({ ok: false, reason: 'accept_failed' }, 500);
    }
  }

  // ── DECLINE or TIMEOUT ────────────────────────────────────────────────────
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

    log('All ' + rankedCouriers.length + ' candidates rejected delivery ' + queue.deliveryId);
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
      data: { currentCourierId: nextCourierId, attemptIndex: nextIndex, expiresAt },
    })
    .catch((e) => error('Queue advance failed: ' + e.message));

  await db
    .updateRow({
      databaseId: DB,
      tableId: collectionFor(nextEntry),
      rowId: nextCourierId,
      data: nextIsAgency
        ? { isAvailable: false, currentOfferId: queue.deliveryId, offerExpiresAt: expiresAt }
        : { status: 'offered', currentOfferId: queue.deliveryId, offerExpiresAt: expiresAt },
    })
    .catch((e) => log('Could not mark next entity as offered: ' + e.message));

  // ── Notify next courier/agency ─────────────────────────────────────────────
  const label = nextIsAgency
    ? 'A new delivery is waiting for your agency.'
    : 'A new delivery is near you. Open Carrydey to accept.';

  await notifyEntity(
    nextCourierId,
    nextIsAgency ? ORGS : USERS,
    '📦 New Delivery Offer',
    label
  );

  log(
    'Advanced to ' + nextEntry.entityType + ' ' +
    (nextIndex + 1) + '/' + rankedCouriers.length + ': ' + nextCourierId
  );

  return res.json({
    ok: true,
    assigned: false,
    nextCourierId,
    nextEntityType: nextEntry.entityType,
    attemptIndex: nextIndex,
  });
};