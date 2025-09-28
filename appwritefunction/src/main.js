import { Client, Databases, Users } from 'node-appwrite';
import { PaystackService } from './paystack.js';
import { DatabaseService } from './database.js';
import { createResponse, validateWebhook, validateInput, isValidEmail, isValidAmount } from './utils.js';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const users = new Users(client);
  const paystack = new PaystackService(process.env.PAYSTACK_SECRET_KEY);
  const db = new DatabaseService(databases, process.env.APPWRITE_DATABASE_ID);

  try {
    const { action } = req.query;
    const body = req.body ? JSON.parse(req.body) : {};

    log(`Processing action: ${action}`);

    switch (action) {
      case 'create-contract':
        return await createContract(req, res, { db, users, log, error });
      case 'initiate':
        return await initiatePayment(req, res, { paystack, db, users, log, error });
      case 'verify':
        return await verifyPayment(req, res, { paystack, db, log, error });
      case 'webhook':
        return await handleWebhook(req, res, { paystack, db, log, error });
      case 'release':
        return await releaseEscrow(req, res, { paystack, db, users, log, error });
      case 'refund':
        return await processRefund(req, res, { paystack, db, log, error });
      default:
        return createResponse(res, 400, { error: 'Invalid action' });
    }
  } catch (err) {
    error(`Function error: ${err.message}`);
    return createResponse(res, 500, { error: 'Internal server error' });
  }
};

async function getUserEmail(userId, users) {
  try {
    const user = await users.get(userId);
    return user.email;
  } catch (error) {
    throw new Error(`Failed to get user email: ${error.message}`);
  }
}

async function createContract(req, res, { db, users, log, error }) {
  const { senderId, travelerId, packageId, amount, platformFeePercentage = 0.05 } = JSON.parse(req.body);

  try {
    const validationErrors = validateInput({ senderId, travelerId, packageId, amount }, {
      senderId: { required: true, type: 'string' },
      travelerId: { required: true, type: 'string' },
      packageId: { required: true, type: 'string' },
      amount: { required: true, type: 'number', min: 1000 },
    });

    if (validationErrors.length > 0) {
      return createResponse(res, 400, { errors: validationErrors });
    }

    if (!isValidAmount(amount)) {
      return createResponse(res, 400, { error: 'Invalid amount' });
    }

    // Calculate Paystack fees (1.5% + ₦100 for > ₦2500)
    const paystackFee = amount > 250000 ? Math.round(amount * 0.015) + 10000 : Math.round(amount * 0.015);
    const platformFee = Math.round(amount * platformFeePercentage);
    const travelerAmount = amount - platformFee - paystackFee;

    if (travelerAmount <= 0) {
      return createResponse(res, 400, { error: 'Invalid amount: Traveler amount must be positive' });
    }

    const contract = await db.createContract({
      senderId,
      travelerId,
      packageId,
      amount,
      platformFee,
      paystackFee,
      travelerAmount,
      status: 'AWAITING_PAYMENT',
    });

    log(`Contract created: ${contract.$id}`);

    return createResponse(res, 200, {
      success: true,
      contract: {
        ...contract,
        amountNGN: (amount / 100).toFixed(2),
        platformFeeNGN: (platformFee / 100).toFixed(2),
        travelerAmountNGN: (travelerAmount / 100).toFixed(2),
        paystackFeeNGN: (paystackFee / 100).toFixed(2),
      },
    });
  } catch (err) {
    error(`Contract creation error: ${err.message}`);
    return createResponse(res, 500, { error: 'Failed to create contract' });
  }
}

async function initiatePayment(req, res, { paystack, db, users, log, error }) {
  const { contractId, userId } = JSON.parse(req.body);

  try {
    const validationErrors = validateInput({ contractId, userId }, {
      contractId: { required: true, type: 'string' },
      userId: { required: true, type: 'string' },
    });

    if (validationErrors.length > 0) {
      return createResponse(res, 400, { errors: validationErrors });
    }

    const contract = await db.getContract(contractId);
    if (!contract) {
      return createResponse(res, 404, { error: 'Contract not found' });
    }

    if (contract.senderId !== userId) {
      return createResponse(res, 403, { error: 'Unauthorized' });
    }

    if (contract.status !== 'AWAITING_PAYMENT') {
      return createResponse(res, 400, { error: `Contract not in AWAITING_PAYMENT status. Current status: ${contract.status}` });
    }

    const senderEmail = await getUserEmail(contract.senderId, users);
    if (!isValidEmail(senderEmail)) {
      return createResponse(res, 400, { error: 'Invalid sender email' });
    }

    // Check for existing payment
    const existingPayment = await db.getPaymentByContract(contractId);
    if (existingPayment && existingPayment.status !== 'FAILED') {
      return createResponse(res, 400, { error: 'Payment already exists for this contract' });
    }

    const paystackData = {
      email: senderEmail,
      amount: contract.amount,
      reference: `sendr_${contractId}_${Date.now()}`,
      callback_url: `${process.env.FRONTEND_URL}/contracts/${contractId}/callback`,
      metadata: {
        contractId,
        senderId: contract.senderId,
        travelerId: contract.travelerId,
        custom_fields: [{ display_name: 'Contract ID', variable_name: 'contract_id', value: contractId }],
      },
      channels: ['card', 'bank', 'ussd', 'mobile_money'],
    };

    const transaction = await paystack.initializeTransaction(paystackData);

    const payment = await db.createPayment({
      contractId,
      paystackReference: transaction.data.reference,
      paystackAccessCode: transaction.data.access_code,
      amount: contract.amount,
      status: 'PENDING',
      metadata: { authorization_url: transaction.data.authorization_url, created_at: new Date().toISOString() },
    });

    log(`Payment initiated for contract ${contractId}`);

    return createResponse(res, 200, {
      success: true,
      payment: {
        ...payment,
        amountNGN: (contract.amount / 100).toFixed(2),
      },
      authorization_url: transaction.data.authorization_url,
      access_code: transaction.data.access_code,
      reference: transaction.data.reference,
    });
  } catch (err) {
    error(`Payment initiation error: ${err.message}`);
    return createResponse(res, 500, { error: 'Failed to initiate payment' });
  }
}

async function verifyPayment(req, res, { paystack, db, log, error }) {
  const { reference } = JSON.parse(req.body);

  try {
    const validationErrors = validateInput({ reference }, { reference: { required: true, type: 'string' } });
    if (validationErrors.length > 0) {
      return createResponse(res, 400, { errors: validationErrors });
    }

    const verification = await paystack.verifyTransaction(reference);
    if (verification.data.status === 'success') {
      const payment = await db.getPaymentByReference(reference);
      if (!payment) {
        return createResponse(res, 404, { error: 'Payment not found' });
      }

      await db.updatePayment(payment.$id, {
        status: 'ESCROWED',
        metadata: { ...payment.metadata, verification: verification.data, escrowed_at: new Date().toISOString() },
      });

      await db.updateContract(payment.contractId, {
        status: 'FUNDED',
        updatedAt: new Date().toISOString(),
      });

      log(`Payment verified and escrowed for reference ${reference}`);

      return createResponse(res, 200, {
        success: true,
        status: 'verified',
        data: verification.data,
      });
    } else {
      const payment = await db.getPaymentByReference(reference);
      if (payment) {
        await db.updatePayment(payment.$id, {
          status: 'FAILED',
          metadata: { ...payment.metadata, verification: verification.data, failed_at: new Date().toISOString() },
        });
      }
      return createResponse(res, 400, {
        success: false,
        status: 'failed',
        message: 'Payment verification failed',
        data: verification.data,
      });
    }
  } catch (err) {
    error(`Payment verification error: ${err.message}`);
    return createResponse(res, 500, { error: 'Verification failed' });
  }
}

async function handleWebhook(req, res, { paystack, db, log, error }) {
  const body = req.body;
  const signature = req.headers['x-paystack-signature'];

  try {
    if (!validateWebhook(body, signature, process.env.PAYSTACK_SECRET_KEY)) {
      error('Invalid webhook signature');
      return createResponse(res, 400, { error: 'Invalid signature' });
    }

    const event = JSON.parse(body);
    const eventId = event.data.id;

    const existingEvent = await db.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      'delivery_events',
      [Query.equal('paystackEventId', eventId)]
    );
    if (existingEvent.documents.length > 0) {
      log(`Duplicate webhook event received: ${eventId}`);
      return createResponse(res, 200, { received: true });
    }

    await db.createDeliveryEvent({
      contractId: event.data.metadata?.contractId || 'unknown',
      eventType: event.event,
      paystackEventId: eventId,
      triggeredBy: 'paystack',
      metadata: event.data,
    });

    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data, { db, log, error });
        break;
      case 'transfer.success':
        await handleTransferSuccess(event.data, { db, log, error });
        break;
      case 'transfer.failed':
        await handleTransferFailed(event.data, { db, log, error });
        break;
      case 'charge.failed':
        await handleChargeFailed(event.data, { db, log, error });
        break;
      default:
        log(`Unhandled webhook event: ${event.event}`);
    }

    return createResponse(res, 200, { received: true });
  } catch (err) {
    error(`Webhook error: ${err.message}`);
    return createResponse(res, 500, { error: 'Webhook processing failed' });
  }
}

async function handleChargeSuccess(data, { db, log, error }) {
  try {
    const reference = data.reference;
    const payment = await db.getPaymentByReference(reference);
    if (payment && payment.status === 'PENDING') {
      await db.updatePayment(payment.$id, {
        status: 'ESCROWED',
        metadata: { ...payment.metadata, charge_data: data, escrowed_at: new Date().toISOString() },
      });
      await db.updateContract(payment.contractId, {
        status: 'FUNDED',
        updatedAt: new Date().toISOString(),
      });
      log(`Charge success processed for ${reference}`);
    }
  } catch (err) {
    error(`Charge success handler error: ${err.message}`);
  }
}

async function handleChargeFailed(data, { db, log, error }) {
  try {
    const reference = data.reference;
    const payment = await db.getPaymentByReference(reference);
    if (payment && payment.status === 'PENDING') {
      await db.updatePayment(payment.$id, {
        status: 'FAILED',
        metadata: { ...payment.metadata, charge_data: data, failed_at: new Date().toISOString() },
      });
      log(`Charge failed processed for ${reference}`);
    }
  } catch (err) {
    error(`Charge failed handler error: ${err.message}`);
  }
}

async function handleTransferSuccess(data, { db, log, error }) {
  try {
    const payment = await db.getPaymentByReference(data.reference);
    if (payment) {
      await db.updatePayment(payment.$id, {
        metadata: { ...payment.metadata, transfer_success: data, transferred_at: new Date().toISOString() },
      });
      log(`Transfer success processed for ${data.reference}`);
    }
  } catch (err) {
    error(`Transfer success handler error: ${err.message}`);
  }
}

async function handleTransferFailed(data, { db, log, error }) {
  try {
    const payment = await db.getPaymentByReference(data.reference);
    if (payment) {
      await db.updatePayment(payment.$id, {
        metadata: { ...payment.metadata, transfer_failed: data, transfer_failed_at: new Date().toISOString() },
      });
      await db.updateContract(payment.contractId, {
        status: 'DISPUTED',
        updatedAt: new Date().toISOString(),
      });
      log(`Transfer failed for ${data.reference}`);
    }
  } catch (err) {
    error(`Transfer failed handler error: ${err.message}`);
  }
}

async function releaseEscrow(req, res, { paystack, db, users, log, error }) {
  const { contractId, eventType, triggeredBy } = JSON.parse(req.body);

  try {
    const validationErrors = validateInput({ contractId, eventType, triggeredBy }, {
      contractId: { required: true, type: 'string' },
      eventType: { required: true, type: 'string' },
      triggeredBy: { required: true, type: 'string' },
    });
    if (validationErrors.length > 0) {
      return createResponse(res, 400, { errors: validationErrors });
    }

    const contract = await db.getContract(contractId);
    if (!contract) {
      return createResponse(res, 404, { error: 'Contract not found' });
    }
    if (contract.status !== 'IN_TRANSIT') {
      return createResponse(res, 400, { error: `Contract must be IN_TRANSIT. Current status: ${contract.status}` });
    }
    if (eventType !== 'DELIVERY_CONFIRMED') {
      return createResponse(res, 400, { error: 'Only delivery confirmation can trigger payout' });
    }

    const payment = await db.getPaymentByContract(contractId);
    if (!payment) {
      return createResponse(res, 404, { error: 'Payment record not found' });
    }
    if (payment.status !== 'ESCROWED') {
      return createResponse(res, 400, { error: `Payment must be ESCROWED. Current status: ${payment.status}` });
    }

    const balance = await paystack.checkBalance();
    if (balance.data[0].balance < contract.travelerAmount) {
      return createResponse(res, 400, { error: 'Insufficient Paystack balance for payout' });
    }

    const traveler = await users.get(contract.travelerId);
    const travelerBankDetails = traveler.prefs?.bankDetails;
    if (!travelerBankDetails?.account_number || !travelerBankDetails?.bank_code) {
      return createResponse(res, 400, { error: 'Traveler bank details incomplete' });
    }

    const accountVerification = await paystack.verifyAccount(travelerBankDetails.account_number, travelerBankDetails.bank_code);
    if (!accountVerification.status) {
      return createResponse(res, 400, { error: 'Invalid traveler bank details' });
    }

    let recipient = traveler.prefs?.paystackRecipient;
    if (!recipient) {
      const recipientData = await paystack.createTransferRecipient({
        type: 'nuban',
        name: traveler.name || traveler.email,
        account_number: travelerBankDetails.account_number,
        bank_code: travelerBankDetails.bank_code,
        currency: 'NGN',
      });
      recipient = recipientData.data.recipient_code;
      await users.updatePrefs(contract.travelerId, {
        ...traveler.prefs,
        paystackRecipient: recipient,
      });
    }

    const transfer = await paystack.initiateTransfer({
      source: 'balance',
      amount: contract.travelerAmount,
      recipient,
      reason: `Payment for delivery - Contract ${contractId}`,
      reference: `payout_${contractId}_${Date.now()}`,
    });

    if (transfer.data.status === 'otp_required') {
      await db.updatePayment(payment.$id, {
        status: 'PENDING_OTP',
        metadata: { ...payment.metadata, transfer_code: transfer.data.transfer_code },
      });
      return createResponse(res, 200, {
        success: false,
        status: 'otp_required',
        transfer_code: transfer.data.transfer_code,
      });
    }

    await db.updatePayment(payment.$id, {
      status: 'RELEASED',
      metadata: {
        ...payment.metadata,
        payout: {
          transfer_code: transfer.data.transfer_code,
          recipient_code: recipient,
          amount: contract.travelerAmount,
          released_at: new Date().toISOString(),
        },
      },
    });

    await db.updateContract(contractId, {
      status: 'DELIVERED',
      updatedAt: new Date().toISOString(),
    });

    await db.createDeliveryEvent({
      contractId,
      eventType: 'DELIVERY_CONFIRMED',
      triggeredBy,
      metadata: {
        payoutReference: transfer.data.reference,
        transferCode: transfer.data.transfer_code,
        travelerAmount: contract.travelerAmount,
      },
    });

    log(`Escrow released for contract ${contractId}`);
    return createResponse(res, 200, {
      success: true,
      transfer: {
        reference: transfer.data.reference,
        amount: contract.travelerAmount,
        amountNGN: (contract.travelerAmount / 100).toFixed(2),
        status: transfer.data.status,
      },
    });
  } catch (err) {
    error(`Escrow release error: ${err.message}`);
    return createResponse(res, 500, { error: 'Failed to release escrow' });
  }
}

async function processRefund(req, res, { paystack, db, log, error }) {
  const { contractId, reason, triggeredBy } = JSON.parse(req.body);

  try {
    const validationErrors = validateInput({ contractId, reason, triggeredBy }, {
      contractId: { required: true, type: 'string' },
      reason: { required: true, type: 'string' },
      triggeredBy: { required: true, type: 'string' },
    });
    if (validationErrors.length > 0) {
      return createResponse(res, 400, { errors: validationErrors });
    }

    const contract = await db.getContract(contractId);
    if (!contract) {
      return createResponse(res, 404, { error: 'Contract not found' });
    }

    const payment = await db.getPaymentByContract(contractId);
    if (!payment) {
      return createResponse(res, 404, { error: 'Payment record not found' });
    }

    if (payment.status !== 'ESCROWED') {
      return createResponse(res, 400, { error: `Payment must be ESCROWED to refund. Current status: ${payment.status}` });
    }

    const refund = await paystack.refundTransaction({
      transaction: payment.paystackReference,
      amount: contract.amount,
    });

    await db.updatePayment(payment.$id, {
      status: 'REFUNDED',
      metadata: {
        ...payment.metadata,
        refund: {
          refund_reference: refund.data.reference,
          refunded_at: new Date().toISOString(),
          reason,
        },
      },
    });

    await db.updateContract(contractId, {
      status: 'CANCELLED',
      updatedAt: new Date().toISOString(),
    });

    await db.createDeliveryEvent({
      contractId,
      eventType: 'CANCELLED',
      triggeredBy,
      metadata: { reason, refund_reference: refund.data.reference, refund_amount: contract.amount },
    });

    log(`Refund processed for contract ${contractId}`);

    return createResponse(res, 200, {
      success: true,
      refund: {
        reference: refund.data.reference,
        amount: contract.amount,
        amountNGN: (contract.amount / 100).toFixed(2),
        status: refund.data.status,
      },
    });
  } catch (err) {
    error(`Refund error: ${err.message}`);
    return createResponse(res, 500, { error: 'Refund processing failed' });
  }
}