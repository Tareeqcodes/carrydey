import { Client, TablesDB, Messaging, Query, ID } from 'node-appwrite';

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function scoreCourier(courier, distance) {
  const distanceScore = Math.max(0, 100 - distance * 10);
  const ratingScore = (courier.rating ?? 4.0) * 20;
  const acceptanceScore = (courier.acceptanceRate ?? 0.8) * 100;
  const activeScore = Math.max(0, 100 - (courier.activeDeliveries ?? 0) * 25);
  const priorityScore = courier.entityType === 'agency' ? 100 : 70;
  return Math.round(
    distanceScore * 0.35 +
      ratingScore * 0.25 +
      acceptanceScore * 0.15 +
      activeScore * 0.15 +
      priorityScore * 0.1
  );
}

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

  // ── sendPush ───────────────────────────────────────────────────────────────
  // Pass '' for SDK title+body so FCM sends a data-only message.
  // When FCM sees a non-empty notification{title,body} it delivers directly
  // to the tray and SKIPS onBackgroundMessage in the SW entirely — meaning
  // our rich notification (action buttons, tag dedup, vibrate) never runs.
  // Data-only forces FCM to call onBackgroundMessage where we build it ourselves.
  // title+body are put in data{} so the SW can use them when constructing the notification.
  // ──────────────────────────────────────────────────────────────────────────
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
        title,
        body,
        [],
        [],
        [pushTargetId],
        data // title, body, type, fare, distance, pickup, deliveryId, queueId
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
  let parsedBody = {};
  try {
    if (typeof req.body === 'string' && req.body.length > 0) {
      parsedBody = JSON.parse(req.body);
    } else if (req.body && typeof req.body === 'object') {
      parsedBody = req.body;
    }
    if (typeof parsedBody.body === 'string') {
      parsedBody = JSON.parse(parsedBody.body);
    }
  } catch (e) {
    error('Body parse failed: ' + e.message);
    return res.json({ ok: false, reason: 'invalid_body' }, 400);
  }

  const deliveryId = parsedBody.deliveryId ?? parsedBody.$id;
  const radiusKm =
    typeof parsedBody.radiusKm === 'number' ? parsedBody.radiusKm : 10;

  if (!deliveryId) {
    error(
      'Missing deliveryId. Body: ' +
        JSON.stringify(parsedBody).substring(0, 200)
    );
    return res.json({ ok: false, reason: 'missing_deliveryId' }, 400);
  }

  log(
    'Starting dispatch for delivery: ' +
      deliveryId +
      ' radius: ' +
      radiusKm +
      'km'
  );

  let delivery;
  try {
    delivery = await db.getRow({
      databaseId: DB,
      tableId: DELIVERIES,
      rowId: deliveryId,
    });
  } catch (e) {
    error('Could not load delivery: ' + e.message);
    return res.json({ ok: false, reason: 'delivery_not_found' }, 404);
  }

  const blockedStatuses = [
    'assigned',
    'accepted',
    'picked_up',
    'in_transit',
    'delivered',
  ];
  if (blockedStatuses.includes(delivery.status)) {
    log(
      'Delivery ' +
        deliveryId +
        ' is already: ' +
        delivery.status +
        ', skipping'
    );
    return res.json({ ok: false, reason: 'already_dispatched' });
  }

  if (delivery.status === 'no_couriers') {
    await db
      .updateRow({
        databaseId: DB,
        tableId: DELIVERIES,
        rowId: deliveryId,
        data: { status: 'pending' },
      })
      .catch(() => {});
  }

  const pickupLat = delivery.pickupLat;
  const pickupLng = delivery.pickupLng;
  if (!pickupLat || !pickupLng) {
    error('Delivery missing pickup coordinates');
    return res.json({ ok: false, reason: 'missing_coordinates' }, 400);
  }

  const senderAuthId = delivery.userId ?? delivery.senderId ?? null;
  const fareAmount = delivery.offeredFare ?? delivery.fare ?? null;
  const fareDisplay = fareAmount
    ? '\u20a6' + Number(fareAmount).toLocaleString('en-NG')
    : 'Negotiable';
  const pickupDisplay = delivery.pickupAddress
    ? delivery.pickupAddress.split(',')[0].trim()
    : '';

  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

  let couriersRes = { rows: [] };
  try {
    couriersRes = await db.listRows({
      databaseId: DB,
      tableId: USERS,
      queries: [
        Query.equal('role', 'courier'),
        Query.equal('isAvailable', true),
        Query.greaterThan('lastSeen', fifteenMinutesAgo),
        Query.limit(100),
      ],
    });
    log('Found ' + couriersRes.rows.length + ' couriers before radius filter');
  } catch (e) {
    error('Couriers query failed: ' + e.message);
  }

  let agenciesRes = { rows: [] };
  try {
    agenciesRes = await db.listRows({
      databaseId: DB,
      tableId: ORGS,
      queries: [
        Query.equal('isAvailable', true),
        Query.greaterThan('lastSeen', fifteenMinutesAgo),
        Query.limit(100),
      ],
    });
    log('Found ' + agenciesRes.rows.length + ' agencies before radius filter');
  } catch (e) {
    error('Agencies query failed: ' + e.message);
  }

  const allCandidates = [
    ...couriersRes.rows.map((c) => ({ ...c, entityType: 'courier' })),
    ...agenciesRes.rows.map((a) => ({ ...a, entityType: 'agency' })),
  ].filter((c) => c.lat != null && c.lng != null);

  log('Candidates with location: ' + allCandidates.length);

  const scoredAll = allCandidates.map((c) => {
    const distance = getDistance(pickupLat, pickupLng, c.lat, c.lng);
    return {
      courierId: c.$id,
      name: c.name ?? c.userName,
      entityType: c.entityType,
      distance: parseFloat(distance.toFixed(2)),
      score: scoreCourier(c, distance),
      rating: c.rating ?? 4.0,
      phone: c.phone ?? null,
    };
  });

  const withinRadius = scoredAll
    .filter((c) => c.distance <= radiusKm)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  log('Within ' + radiusKm + 'km: ' + withinRadius.length + ' candidates');

  if (withinRadius.length === 0) {
    log('No candidates within ' + radiusKm + 'km — marking as no_couriers');
    await db
      .updateRow({
        databaseId: DB,
        tableId: DELIVERIES,
        rowId: deliveryId,
        data: { status: 'no_couriers' },
      })
      .catch(() => {});
    if (senderAuthId) {
      await notifyByAuthId(
        senderAuthId,
        'No couriers nearby',
        "We couldn't find a courier right now. Try increasing your offer or retry.",
        { type: 'no_couriers', deliveryId }
      );
    }
    return res.json({ ok: false, reason: 'no_couriers', radiusKm });
  }

  const first = withinRadius[0];
  log(
    'Top: ' +
      first.name +
      ' (' +
      first.entityType +
      ') score:' +
      first.score +
      ' dist:' +
      first.distance +
      'km'
  );

  const expiresAt = new Date(Date.now() + 20 * 1000).toISOString();
  let queueDoc;
  try {
    queueDoc = await db.createRow({
      databaseId: DB,
      tableId: DISPATCH,
      rowId: ID.unique(),
      data: {
        deliveryId,
        currentCourierId: first.courierId,
        rankedCourierIds: withinRadius.map((c) => c.courierId).join(','),
        rankedCouriersJson: JSON.stringify(withinRadius),
        attemptIndex: 0,
        status: 'pending',
        expiresAt,
        searchRadius: radiusKm,
      },
    });
  } catch (e) {
    error('Failed to create dispatch_queue: ' + e.message);
    return res.json({ ok: false, reason: 'queue_creation_failed' }, 500);
  }
  log('Queue created: ' + queueDoc.$id);

  const isFirstAgency = first.entityType === 'agency';
  try {
    await db.updateRow({
      databaseId: DB,
      tableId: isFirstAgency ? ORGS : USERS,
      rowId: first.courierId,
      data: isFirstAgency
        ? {
            isAvailable: false,
            currentOfferId: deliveryId,
            offerExpiresAt: expiresAt,
          }
        : {
            status: 'offered',
            currentOfferId: deliveryId,
            offerExpiresAt: expiresAt,
          },
    });
  } catch (e) {
    log('Could not mark entity as offered: ' + e.message);
  }

  await notifyByDocId(
    first.courierId,
    isFirstAgency ? ORGS : USERS,
    '\ud83d\udce6 New Delivery Offer',
    fareDisplay +
      ' \u00b7 ' +
      first.distance +
      'km away \u2014 Open Carrydey to accept',
    {
      type: 'delivery_offer',
      deliveryId,
      queueId: queueDoc.$id,
      fare: fareDisplay,
      distance: String(first.distance),
      pickup: pickupDisplay,
    }
  );

  log(
    'Queue ' +
      queueDoc.$id +
      ' \u2192 offering to ' +
      first.entityType +
      ' ' +
      first.name
  );
  return res.json({
    ok: true,
    queueId: queueDoc.$id,
    offeredTo: first.name,
    entityType: first.entityType,
    totalCandidates: withinRadius.length,
    radiusKm,
  });
};
