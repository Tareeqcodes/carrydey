import { Client, Databases, Query } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);
 
  const db = new Databases(client);

  const DB = process.env.APPWRITE_DATABASE_ID;
  const DELIVERIES = process.env.APPWRITE_DELIVERIES_COLLECTION_ID;
  const COURIERS = process.env.APPWRITE_COURIERS_COLLECTION_ID;
  const DISPATCH = process.env.APPWRITE_DISPATCH_QUEUE_COLLECTION_ID;

  const { queueId, action } = req.body; // action: 'accept' | 'timeout' | 'decline'

  if (!queueId) return res.json({ ok: false }, 400);

  const queue = await db.getDocument(DB, DISPATCH, queueId);

  if (queue.status !== 'pending') {
    return res.json({ ok: false, reason: 'already_resolved' });
  }

  const rankedIds = queue.rankedCourierIds;
  const currentIndex = queue.attemptIndex;
  const currentCourierId = queue.currentCourierId;

  // Reset current courier's status back to available
  await db.updateDocument(DB, COURIERS, currentCourierId, {
    status: 'available',
    currentOfferId: null,
    offerExpiresAt: null,
  }).catch(() => {});

  if (action === 'accept') {
    // Assign the delivery
    await db.updateDocument(DB, DELIVERIES, queue.deliveryId, {
      status: 'assigned',
      assignedCourierId: currentCourierId,
      assignedAt: new Date().toISOString(),
    });

    await db.updateDocument(DB, COURIERS, currentCourierId, {
      status: 'on_delivery',
      currentOfferId: null,
    });

    await db.updateDocument(DB, DISPATCH, queueId, { status: 'accepted' });

    log(`Delivery ${queue.deliveryId} assigned to ${currentCourierId}`);
    return res.json({ ok: true, assigned: true, courierId: currentCourierId });
  }

  // Timeout or decline — try next courier
  const nextIndex = currentIndex + 1;

  if (nextIndex >= rankedIds.length) {
    // Exhausted all candidates
    await db.updateDocument(DB, DISPATCH, queueId, { status: 'failed' });
    await db.updateDocument(DB, DELIVERIES, queue.deliveryId, { status: 'no_couriers' });
    log(`All ${rankedIds.length} couriers rejected delivery ${queue.deliveryId}`);
    return res.json({ ok: true, assigned: false, reason: 'all_rejected' });
  }

  const nextCourierId = rankedIds[nextIndex];
  const expiresAt = new Date(Date.now() + 20 * 1000).toISOString();

  await db.updateDocument(DB, DISPATCH, queueId, {
    currentCourierId: nextCourierId,
    attemptIndex: nextIndex,
    expiresAt,
  });

  await db.updateDocument(DB, COURIERS, nextCourierId, {
    status: 'offered',
    currentOfferId: queue.deliveryId,
    offerExpiresAt: expiresAt,
  }).catch(() => {});

  log(`Moving to courier ${nextIndex + 1}/${rankedIds.length}: ${nextCourierId}`);

  return res.json({ ok: true, assigned: false, nextCourierId, attemptIndex: nextIndex });
};