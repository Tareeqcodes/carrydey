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
  if (!deliveryId) {
    error(
      'Missing deliveryId. Body: ' +
        JSON.stringify(parsedBody).substring(0, 200)
    );
    return res.json({ ok: false, reason: 'missing_deliveryId' }, 400);
  }

  log('Starting dispatch for delivery: ' + deliveryId);

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

  if (delivery.status !== 'pending') {
    log(
      'Delivery ' +
        deliveryId +
        ' is already: ' +
        delivery.status +
        ', skipping'
    );
    return res.json({ ok: false, reason: 'already_dispatched' });
  }

  const pickupLat = delivery.pickupLat;
  const pickupLng = delivery.pickupLng;
  if (!pickupLat || !pickupLng) {
    error('Delivery missing pickup coordinates');
    return res.json({ ok: false, reason: 'missing_coordinates' }, 400);
  }

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
        Query.limit(50),
      ],
    });
    log('Found ' + couriersRes.rows.length + ' available couriers');
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
        Query.limit(50),
      ],
    });
    log('Found ' + agenciesRes.rows.length + ' available agencies');
  } catch (e) {
    error('Agencies query failed: ' + e.message);
  }

  // ── Merge + filter to those with coordinates ───────────────────────────────
  const allCandidates = [
    ...couriersRes.rows.map((c) => ({ ...c, entityType: 'courier' })),
    ...agenciesRes.rows.map((a) => ({ ...a, entityType: 'agency' })),
  ].filter((c) => c.lat != null && c.lng != null);

  log('Total candidates with location: ' + allCandidates.length);

  if (allCandidates.length === 0) {
    log('No candidates — marking delivery as no_couriers');
    await db
      .updateRow({
        databaseId: DB,
        tableId: DELIVERIES,
        rowId: deliveryId,
        data: { status: 'no_couriers' },
      })
      .catch(() => {});
    return res.json({ ok: false, reason: 'no_couriers' });
  }

  // ── Score + rank ───────────────────────────────────────────────────────────
  const scored = allCandidates
    .map((c) => {
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
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const first = scored[0];
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
        rankedCourierIds: scored.map((c) => c.courierId).join(','),
        rankedCouriersJson: JSON.stringify(scored),
        attemptIndex: 0,
        status: 'pending',
        expiresAt,
        searchRadius: 10,
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
            // agency: boolean status field — use isAvailable to mark busy
            isAvailable: false,
            currentOfferId: deliveryId,
            offerExpiresAt: expiresAt,
          }
        : {
            // courier: text status field — can write 'offered'
            status: 'offered',
            currentOfferId: deliveryId,
            offerExpiresAt: expiresAt,
          },
    });
  } catch (e) {
    log('Could not mark entity as offered: ' + e.message);
  }

  log(
    'Queue ' +
      queueDoc.$id +
      ' → offering to ' +
      first.entityType +
      ' ' +
      first.name
  );

  return res.json({
    ok: true,
    queueId: queueDoc.$id,
    offeredTo: first.name,
    entityType: first.entityType,
    totalCandidates: scored.length,
  });
};
