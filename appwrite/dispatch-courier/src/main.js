import { Client, Databases, Query, ID } from 'node-appwrite';

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

  const db = new Databases(client);

  const DB = process.env.APPWRITE_DATABASE_ID;
  const DELIVERIES = process.env.APPWRITE_DELIVERIES_COLLECTION_ID;
  const USERS = process.env.APPWRITE_USERS_COLLECTION_ID; 
  const ORGS = process.env.APPWRITE_ORGANISATION_COLLECTION_ID; 
  const DISPATCH = process.env.APPWRITE_DISPATCH_QUEUE_COLLECTION_ID;

  // ── 1. Parse delivery ID from event payload ──────────────────────────────
  // When triggered by a DB event, Appwrite sends the full document as the body
  const deliveryId = req.body?.$id ?? req.body?.deliveryId;

  if (!deliveryId) {
    return res.json({ ok: false, reason: 'missing deliveryId' }, 400);
  }

  log(`Starting dispatch for delivery: ${deliveryId}`);

  // ── 2. Load the delivery document ────────────────────────────────────────
  let delivery;
  try {
    delivery = await db.getDocument(DB, DELIVERIES, deliveryId);
  } catch (e) {
    error(`Could not load delivery: ${e.message}`);
    return res.json({ ok: false, reason: 'delivery_not_found' }, 404);
  }

  // Skip if delivery was already dispatched (handles duplicate event triggers)
  if (delivery.status !== 'pending') {
    log(
      `Delivery ${deliveryId} already has status: ${delivery.status}, skipping`
    );
    return res.json({ ok: false, reason: 'already_dispatched' });
  }

  const pickupLat = delivery.pickupLat;
  const pickupLng = delivery.pickupLng;
  const vehicleType = delivery.vehicleType ?? 'motorcycle';

  if (!pickupLat || !pickupLng) {
    error('Delivery is missing pickup coordinates');
    return res.json({ ok: false, reason: 'missing_coordinates' }, 400);
  }

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  // ── 3. Query available couriers from USERS collection ────────────────────
  // These are independent couriers / freelance riders
  let couriersRes = { documents: [] };
  try {
    couriersRes = await db.listDocuments(DB, USERS, [
      Query.equal('role', 'courier'),
      Query.equal('verified', true),
      Query.equal('isOnline', true),
      Query.equal('isAvailable', true),
      Query.equal('status', 'available'),
      Query.equal('vehicleType', vehicleType),
      Query.greaterThan('lastSeen', fiveMinutesAgo),
      Query.limit(50),
    ]);
    log(`Found ${couriersRes.documents.length} available couriers in users`);
  } catch (e) {
    // Don't fail — agencies might still be available
    error(`Users query failed: ${e.message}`);
  }

  // ── 4. Query available agencies from ORGANISATIONS collection ─────────────
  let agenciesRes = { documents: [] };
  try {
    agenciesRes = await db.listDocuments(DB, ORGS, [
      Query.equal('verified', true),
      Query.equal('isOnline', true),
      Query.equal('isAvailable', true),
      Query.equal('status', 'available'),
      Query.greaterThan('lastSeen', fiveMinutesAgo),
      Query.limit(50),
    ]);
    log(`Found ${agenciesRes.documents.length} available agencies`);
  } catch (e) {
    error(`Agencies query failed: ${e.message}`);
  }

  // ── 5. Merge both lists, tag entity type, filter by coordinates ──────────
  const allCandidates = [
    ...couriersRes.documents.map((c) => ({ ...c, entityType: 'courier' })),
    ...agenciesRes.documents.map((a) => ({ ...a, entityType: 'agency' })),
  ].filter((c) => c.lat != null && c.lng != null); // must have location

  if (allCandidates.length === 0) {
    log('No candidates with location data found');
    await db.updateDocument(DB, DELIVERIES, deliveryId, {
      status: 'no_couriers',
    });
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
        entityType: candidate.entityType,
        distance: parseFloat(distance.toFixed(2)),
        score: scoreCourier({ ...candidate }, distance),
        rating: candidate.rating ?? 4.0,
        phone: candidate.phone ?? null,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  log(
    `Top candidate: ${scored[0].name} | score: ${scored[0].score} | distance: ${scored[0].distance}km`
  );

  // ── 7. Write dispatch_queue document ─────────────────────────────────────
  const expiresAt = new Date(Date.now() + 20 * 1000).toISOString();

  let queueDoc;
  try {
    queueDoc = await db.createDocument(DB, DISPATCH, ID.unique(), {
      deliveryId,
      currentCourierId: scored[0].courierId,
      rankedCourierIds: scored.map((c) => c.courierId),
      rankedCouriersJson: JSON.stringify(scored),
      attemptIndex: 0,
      status: 'pending',
      expiresAt,
      searchRadius: 10,
    });
  } catch (e) {
    error(`Failed to create dispatch_queue: ${e.message}`);
    return res.json({ ok: false, reason: 'queue_creation_failed' }, 500);
  }

  // ── 8. Mark first candidate as 'offered' ─────────────────────────────────
  // Determine which collection this courier/agency belongs to
  const firstCandidate = scored[0];
  const targetCollection =
    firstCandidate.entityType === 'agency' ? ORGS : USERS;

  try {
    await db.updateDocument(DB, targetCollection, firstCandidate.courierId, {
      status: 'offered',
      currentOfferId: deliveryId,
      offerExpiresAt: expiresAt,
    });
  } catch (e) {
    // Non-critical — the queue is already written, Realtime will still fire
    log(`Could not mark courier as offered: ${e.message}`);
  }

  log(
    `Dispatch queue ${queueDoc.$id} created → offering to ${firstCandidate.name}`
  );

  return res.json({
    ok: true,
    queueId: queueDoc.$id,
    offeredTo: firstCandidate.name,
    totalCandidates: scored.length,
  });
};
