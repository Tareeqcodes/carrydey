import { Client, TablesDB, Query, ID } from 'node-appwrite';

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
    error('Missing deliveryId. Body: ' + JSON.stringify(parsedBody).substring(0, 200));
    return res.json({ ok: false, reason: 'missing_deliveryId' }, 400);
  }

  log('Starting dispatch for delivery: ' + deliveryId + ' radius: ' + radiusKm + 'km');

  // ── Load delivery ──────────────────────────────────────────────────────────
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

  const blockedStatuses = ['assigned', 'accepted', 'picked_up', 'in_transit', 'delivered'];
  if (blockedStatuses.includes(delivery.status)) {
    log('Delivery ' + deliveryId + ' is already: ' + delivery.status + ', skipping');
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

  const senderId = delivery.userId ?? delivery.senderId ?? null;

  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

  // ── Query couriers ─────────────────────────────────────────────────────────
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

  // ── Merge, score, filter by radiusKm ──────────────────────────────────────
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

  // ── No couriers found — notify sender and exit ─────────────────────────────
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

    if (senderId) {
      await notifyEntity(
        senderId,
        USERS,
        'No couriers nearby',
        "We couldn't find a courier right now. Try increasing your offer or retry."
      );
    }

    return res.json({ ok: false, reason: 'no_couriers', radiusKm });
  }

  const first = withinRadius[0];
  log(
    'Top: ' + first.name + ' (' + first.entityType + ') score:' +
    first.score + ' dist:' + first.distance + 'km'
  );

  // ── Create dispatch_queue row ──────────────────────────────────────────────
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

  // ── Mark first candidate as offered ───────────────────────────────────────
  const isFirstAgency = first.entityType === 'agency';
  try {
    await db.updateRow({
      databaseId: DB,
      tableId: isFirstAgency ? ORGS : USERS,
      rowId: first.courierId,
      data: isFirstAgency
        ? { isAvailable: false, currentOfferId: deliveryId, offerExpiresAt: expiresAt }
        : { status: 'offered', currentOfferId: deliveryId, offerExpiresAt: expiresAt },
    });
  } catch (e) {
    log('Could not mark entity as offered: ' + e.message);
  }

  // ── Notify first courier/agency ────────────────────────────────────────────
  const label = isFirstAgency
    ? 'A new delivery is waiting for your agency.'
    : 'A new delivery is near you. Open Carrydey to accept.';

  await notifyEntity(
    first.courierId,
    isFirstAgency ? ORGS : USERS,
    '📦 New Delivery Offer',
    label
  );

  log('Queue ' + queueDoc.$id + ' → offering to ' + first.entityType + ' ' + first.name);

  return res.json({
    ok: true,
    queueId: queueDoc.$id,
    offeredTo: first.name,
    entityType: first.entityType,
    totalCandidates: withinRadius.length,
    radiusKm,
  });
};