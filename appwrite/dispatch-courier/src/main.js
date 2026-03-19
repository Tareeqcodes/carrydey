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

  // ── 1. Parse delivery ID ──────────────────────────────────────────────────
  const deliveryId = req.body?.$id ?? req.body?.deliveryId;
  if (!deliveryId) {
    return res.json({ ok: false, reason: 'missing deliveryId' }, 400);
  }
  log(`Starting dispatch for delivery: ${deliveryId}`);

  // ── 2. Load delivery ──────────────────────────────────────────────────────
  let delivery;
  try {
    delivery = await db.getRow({
      databaseId: DB,
      tableId: DELIVERIES,
      rowId: deliveryId,
    });
  } catch (e) {
    error(`Could not load delivery: ${e.message}`);
    return res.json({ ok: false, reason: 'delivery_not_found' }, 404);
  }

  if (delivery.status !== 'pending') {
    log(
      `Delivery ${deliveryId} status is already: ${delivery.status}, skipping`
    );
    return res.json({ ok: false, reason: 'already_dispatched' });
  }

  const pickupLat = delivery.pickupLat;
  const pickupLng = delivery.pickupLng;
  const vehicleType = delivery.vehicleType ?? 'motorcycle';

  if (!pickupLat || !pickupLng) {
    error('Delivery missing pickup coordinates');
    return res.json({ ok: false, reason: 'missing_coordinates' }, 400);
  }

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  // ── 3. Query freelance couriers (USERS) ───────────────────────────────────
  // FIX: queries must be inside the options object, not a second argument
  let couriersRes = { rows: [] };
  try {
    couriersRes = await db.listRows({
      databaseId: DB,
      tableId: USERS,
      queries: [
        Query.equal('role', 'courier'),
        Query.equal('verified', true),
        Query.equal('isAvailable', true),
        Query.equal('status', 'available'),
        Query.equal('vehicleType', vehicleType),
        Query.greaterThan('lastSeen', fiveMinutesAgo),
        Query.limit(50),
      ],
    });
    log(`Found ${couriersRes.rows.length} available couriers`);
  } catch (e) {
    error(`Couriers query failed: ${e.message}`);
  }

  // ── 4. Query agencies (ORGS) ──────────────────────────────────────────────
  let agenciesRes = { rows: [] };
  try {
    agenciesRes = await db.listRows({
      databaseId: DB,
      tableId: ORGS,
      queries: [
        Query.equal('verified', true),
        Query.equal('isAvailable', true),
        Query.equal('status', 'available'),
        Query.greaterThan('lastSeen', fiveMinutesAgo),
        Query.limit(50),
      ],
    });
    log(`Found ${agenciesRes.rows.length} available agencies`);
  } catch (e) {
    error(`Agencies query failed: ${e.message}`);
  }

  // ── 5. Merge, tag entity type, filter to those with coords ───────────────
  const allCandidates = [
    ...couriersRes.rows.map((c) => ({ ...c, entityType: 'courier' })),
    ...agenciesRes.rows.map((a) => ({ ...a, entityType: 'agency' })),
  ].filter((c) => c.lat != null && c.lng != null);

  if (allCandidates.length === 0) {
    log('No candidates with location data');
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

  // ── 6. Score and rank ─────────────────────────────────────────────────────
  const scored = allCandidates
    .map((candidate) => {
      const distance = getDistance(
        pickupLat,
        pickupLng,
        candidate.lat,
        candidate.lng
      );
      return {
        courierId: candidate.$id,
        name: candidate.name ?? candidate.userName,
        entityType: candidate.entityType, // preserved for advance-dispatch routing
        distance: parseFloat(distance.toFixed(2)),
        score: scoreCourier(candidate, distance),
        rating: candidate.rating ?? 4.0,
        phone: candidate.phone ?? null,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const first = scored[0];
  log(
    `Top: ${first.name} (${first.entityType}) | score: ${first.score} | ${first.distance}km`
  );

  // ── 7. Create dispatch_queue row ──────────────────────────────────────────
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
        rankedCourierIds: scored.map((c) => c.courierId),
        rankedCouriersJson: JSON.stringify(scored), // full objects incl. entityType
        attemptIndex: 0,
        status: 'pending',
        expiresAt,
        searchRadius: 10,
      },
    });
  } catch (e) {
    error(`Failed to create dispatch_queue: ${e.message}`);
    return res.json({ ok: false, reason: 'queue_creation_failed' }, 500);
  }

  // ── 8. Mark first candidate as offered ───────────────────────────────────
  // FIX: route to correct collection based on entityType
  const targetCollection = first.entityType === 'agency' ? ORGS : USERS;

  try {
    await db.updateRow({
      databaseId: DB,
      tableId: targetCollection,
      rowId: first.courierId,
      data: {
        status: 'offered',
        currentOfferId: deliveryId,
        offerExpiresAt: expiresAt,
      },
    });
  } catch (e) {
    log(`Could not mark entity as offered: ${e.message}`);
  }

  log(
    `Queue ${queueDoc.$id} created → offering to ${first.entityType} ${first.name}`
  );

  return res.json({
    ok: true,
    queueId: queueDoc.$id,
    offeredTo: first.name,
    entityType: first.entityType,
    totalCandidates: scored.length,
  });
};
