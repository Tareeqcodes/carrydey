import { Client, TablesDB, Messaging, Query, ID } from 'node-appwrite';

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const generatePickupCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++)
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
};

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const db = new TablesDB(client);
  const messaging = new Messaging(client);

  const DB = process.env.APPWRITE_DATABASE_ID;
  const DELIVERIES = process.env.APPWRITE_DELIVERIES_COLLECTION_ID;
  const USERS = process.env.APPWRITE_USERS_COLLECTION_ID;
  const ORGS = process.env.APPWRITE_ORGANISATION_COLLECTION_ID;
  const DISPATCH = process.env.APPWRITE_DISPATCH_QUEUE_COLLECTION_ID;

  // Same data-only pattern as dispatch-search — see comment there for explanation.
  const sendPush = async (
    pushTargetId,
    title,
    body,
    entityLabel,
    extraData = {}
  ) => {
    if (!pushTargetId) {
      log('No pushTargetId for ' + entityLabel + ', skipping notify');
      return;
    }
    log(
      'Sending notification to ' + entityLabel + ' | target: ' + pushTargetId
    );
    try {
      const data = Object.fromEntries(
        Object.entries({ title, body, ...extraData }).map(([k, v]) => [
          k,
          String(v ?? ''),
        ])
      );
      await messaging.createPush(
        ID.unique(),
        '',
        '',
        [],
        [],
        [pushTargetId],
        data
      );
      log('Notification sent to ' + entityLabel);
    } catch (e) {
      log('createPush failed for ' + entityLabel + ': ' + e.message);
    }
  };

  const notifyByDocId = async (
    entityDocId,
    tableId,
    title,
    body,
    extraData = {}
  ) => {
    try {
      const doc = await db.getRow({
        databaseId: DB,
        tableId,
        rowId: entityDocId,
      });
      await sendPush(
        doc.pushTargetId ?? null,
        title,
        body,
        entityDocId,
        extraData
      );
    } catch (e) {
      log('notifyByDocId failed for ' + entityDocId + ': ' + e.message);
    }
  };

  const notifyByAuthId = async (authUserId, title, body, extraData = {}) => {
    try {
      const result = await db.listRows({
        databaseId: DB,
        tableId: USERS,
        queries: [Query.equal('userId', authUserId), Query.limit(1)],
      });
      const doc = result.rows?.[0];
      if (!doc) {
        log(
          'No USERS doc found for authUserId ' +
            authUserId +
            ', skipping notify'
        );
        return;
      }
      await sendPush(
        doc.pushTargetId ?? null,
        title,
        body,
        authUserId,
        extraData
      );
    } catch (e) {
      log('notifyByAuthId failed for ' + authUserId + ': ' + e.message);
    }
  };

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
  if (!queueId || !action)
    return res.json({ ok: false, reason: 'missing queueId or action' }, 400);

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

  // Load delivery for fare/pickup display in next-courier notify
  let delivery = null;
  try {
    delivery = await db.getRow({
      databaseId: DB,
      tableId: DELIVERIES,
      rowId: queue.deliveryId,
    });
  } catch (e) {
    log('Could not load delivery for notification enrichment: ' + e.message);
  }

  const fareAmount = delivery?.offeredFare ?? delivery?.fare ?? null;
  const fareDisplay = fareAmount
    ? '\u20a6' + Number(fareAmount).toLocaleString('en-NG')
    : 'Negotiable';
  const pickupDisplay = delivery?.pickupAddress
    ? delivery.pickupAddress.split(',')[0].trim()
    : '';
  const senderAuthId = delivery?.userId ?? delivery?.senderId ?? null;

  // Reset current entity
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

      let driverName = null,
        driverPhone = null;
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
        'Delivery ' +
          queue.deliveryId +
          ' accepted by ' +
          currentEntry?.entityType +
          ' ' +
          currentCourierId +
          ' | pickupCode: ' +
          pickupCode
      );

      if (senderAuthId) {
        const entityLabel = currentIsAgency ? 'An agency' : 'A courier';
        await notifyByAuthId(
          senderAuthId,
          '\ud83d\ude80 Courier Found!',
          entityLabel + ' has accepted your delivery and is on the way.',
          {
            type: 'delivery_accepted',
            deliveryId: queue.deliveryId,
            driverName: driverName ?? '',
          }
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

  await notifyByDocId(
    nextCourierId,
    nextIsAgency ? ORGS : USERS,
    '\ud83d\udce6 New Delivery Offer',
    fareDisplay +
      ' \u00b7 ' +
      (nextEntry.distance ?? '') +
      'km away \u2014 Open Carrydey to accept',
    {
      type: 'delivery_offer',
      deliveryId: queue.deliveryId,
      queueId,
      fare: fareDisplay,
      distance: String(nextEntry.distance ?? ''),
      pickup: pickupDisplay,
    }
  );

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
