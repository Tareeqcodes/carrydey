import { Client, Databases } from 'node-appwrite';

// ─── Termii SMS ───────────────────────────────────────────────────────────────
async function sendTermiiSMS({ to, message, apiKey, senderId }) {
  const response = await fetch('https://v3.api.termii.com/api/sms/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to,
      from: senderId || 'Delivery',
      sms: message,
      type: 'plain',
      channel: 'generic',
      api_key: apiKey,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(`Termii API error: ${JSON.stringify(data)}`);
  return data;
}

// ─── Format Nigerian phone → international (2348012345678) ───────────────────
function formatPhoneNG(raw) {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('234') && digits.length >= 13) return digits;
  if (digits.startsWith('0') && digits.length === 11) return '234' + digits.slice(1);
  if (digits.length === 10) return '234' + digits;
  return digits;
}

// ─── Build SMS body ───────────────────────────────────────────────────────────
function buildSMS({ delivery, driverName }) {
  const name       = driverName || 'Driver';
  const pickup     = delivery.pickupAddress  || delivery.pickup  || 'See agency';
  const dropoff    = delivery.dropoffAddress || delivery.dropoff || 'See agency';
  const customer   = delivery.dropoffContactName || delivery.customerName || '';
  const fare       = delivery.suggestedFare  || delivery.offeredFare || '';
  const pickupCode = delivery.pickupCode || 'N/A';
  const dropoffOTP = delivery.dropoffOTP  || 'N/A';

  const lines = [
    `Hi ${name}, you have a new delivery:`,
    ``,
    `PICKUP: ${pickup}`,
    `DROPOFF: ${dropoff}`,
    customer ? `CUSTOMER: ${customer}` : null,
    fare     ? `PAYOUT: NGN ${fare}`   : null,
    ``,
    `Pickup code (show to sender): ${pickupCode}`,
    `Dropoff OTP (get from receiver): ${dropoffOTP}`,
    ``,
    `Call your agency if you have issues.`,
  ];

  return lines.filter((l) => l !== null).join('\n');
}

// ─── Safe body parser ─────────────────────────────────────────────────────────
// Appwrite passes the body differently depending on how the function was triggered.
// When called via API with a JSON body string in the `body` field, req.body is
// that raw string. When called synchronously it may already be an object.
function parseBody(req) {
  try {
    // req.body can be: a plain string, a JSON string, or already an object
    if (!req.body) return {};

    if (typeof req.body === 'object') return req.body;

    const parsed = JSON.parse(req.body);

    // Appwrite wraps async execution payloads: { body: "{\"deliveryId\":\"...\"}" }
    // So if the parsed result has a `body` string, parse that too.
    if (typeof parsed?.body === 'string') {
      return JSON.parse(parsed.body);
    }

    return parsed;
  } catch {
    return {};
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export default async ({ req, res, log, error }) => {
  // Validate required env vars
  const REQUIRED = [
    'APPWRITE_ENDPOINT',
    'APPWRITE_PROJECT_ID',
    'APPWRITE_API_KEY',
    'APPWRITE_DATABASE_ID',
    'APPWRITE_DELIVERIES_COLLECTION_ID',
    'APPWRITE_DRIVER_COLLECTION_ID',
    'TERMII_API_KEY',
  ];
  const missing = REQUIRED.filter((k) => !process.env[k]);
  if (missing.length) {
    error(`Missing env vars: ${missing.join(', ')}`);
    return res.json({ success: false, error: 'Server misconfiguration' }, 500);
  }

  const {
    APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID,
    APPWRITE_API_KEY,
    APPWRITE_DATABASE_ID,
    APPWRITE_DELIVERIES_COLLECTION_ID,
    APPWRITE_DRIVER_COLLECTION_ID,
    TERMII_API_KEY,
    TERMII_SENDER_ID,
  } = process.env;

  // Parse body — handles all Appwrite trigger shapes
  const body = parseBody(req);
  log(`Parsed body: ${JSON.stringify(body)}`);

  const { deliveryId, driverId } = body;
  if (!deliveryId || !driverId) {
    error(`Body missing fields. Raw req.body type: ${typeof req.body}, value: ${JSON.stringify(req.body)}`);
    return res.json({
      success: false,
      error: 'deliveryId and driverId are required',
      received: body,
    }, 400);
  }

  // Init Appwrite — correct positional args for node-appwrite v13
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);
  const db = new Databases(client);

  // Fetch driver — getDocument(databaseId, collectionId, documentId)
  let driver;
  try {
    driver = await db.getDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_DRIVER_COLLECTION_ID,
      driverId
    );
    log(`Driver fetched: ${driver.name}, phoneType: ${driver.phoneType}`);
  } catch (err) {
    error(`Driver fetch failed [${driverId}]: ${err.message}`);
    return res.json({ success: false, error: 'Driver not found' }, 404);
  }

  // Only keypad drivers get an SMS
  if (driver.phoneType !== 'keypad') {
    log(`Driver ${driverId} is phoneType="${driver.phoneType}" — no SMS needed`);
    return res.json({
      success: true,
      smsSent: false,
      reason: 'Android driver — portal link handles notification',
    });
  }

  // Validate phone
  const phone = formatPhoneNG(driver.phone);
  if (!phone) {
    error(`Driver ${driverId} has no usable phone number`);
    return res.json({ success: false, error: 'Driver phone number missing' }, 400);
  }
  log(`Formatted phone: ${phone}`);

  // Fetch delivery — getDocument(databaseId, collectionId, documentId)
  let delivery;
  try {
    delivery = await db.getDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_DELIVERIES_COLLECTION_ID,
      deliveryId
    );
    log(`Delivery fetched: ${deliveryId}`);
  } catch (err) {
    error(`Delivery fetch failed [${deliveryId}]: ${err.message}`);
    return res.json({ success: false, error: 'Delivery not found' }, 404);
  }

  // Send SMS
  const message = buildSMS({ delivery, driverName: driver.name });
  log(`SMS message:\n${message}`);

  try {
    const result = await sendTermiiSMS({
      to: phone,
      message,
      apiKey: TERMII_API_KEY,
      senderId: TERMII_SENDER_ID,
    });
    log(`SMS sent OK: ${JSON.stringify(result)}`);
    return res.json({ success: true, smsSent: true, phone, termii: result });
  } catch (err) {
    error(`SMS failed: ${err.message}`);
    return res.json({ success: false, error: err.message }, 500);
  }
};