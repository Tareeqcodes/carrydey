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
  if (digits.length === 10) return '234' + digits; // missing leading 0
  return digits; // pass through whatever we have
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

  // Parse body
  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
  } catch {
    return res.json({ success: false, error: 'Invalid JSON body' }, 400);
  }

  const { deliveryId, driverId } = body;
  if (!deliveryId || !driverId) {
    return res.json({ success: false, error: 'deliveryId and driverId are required' }, 400);
  }

  // Init Appwrite
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);
  const db = new Databases(client);

  // Fetch driver
  let driver;
  try {
    driver = await db.getDocument({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_DRIVER_COLLECTION_ID,
      rowId: driverId,
    }
      
    );
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

  // Fetch delivery
  let delivery;
  try {
    delivery = await db.getDocument({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_DELIVERIES_COLLECTION_ID,
      rowId: deliveryId
    });
  } catch (err) {
    error(`Delivery fetch failed [${deliveryId}]: ${err.message}`);
    return res.json({ success: false, error: 'Delivery not found' }, 404);
  }

  // Send SMS
  const message = buildSMS({ delivery, driverName: driver.name });
  log(`Sending SMS → ${phone} for delivery ${deliveryId}`);

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