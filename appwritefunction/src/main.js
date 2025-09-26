// main.js - Main Function Entry Point
import { Client, Databases, Users } from 'node-appwrite';
import { PaystackService } from './paystack.js';
import { DatabaseService } from './database.js';
import { createResponse, validateWebhook, validateInput, isValidEmail, isValidAmount } from './utils.js';

export default async ({ req, res, log, error }) => {
  // Initialize Appwrite
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
    const body = JSON.parse(req.body || '{}');

    log(`Processing action: ${action}`);

    switch (action) {
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
      
      case 'create-contract':
        return await createContract(req, res, { db, log, error });
      
      default:
        return createResponse(res, 400, { error: 'Invalid action' });
    }
  } catch (err) {
    error(`Function error: ${err.message}`);
    return createResponse(res, 500, { error: 'Internal server error' });
  }
};

// ====================================
// Helper Functions
// ====================================
async function getUserEmail(userId, users) {
  try {
    const user = await users.get(userId);
    return user.email;
  } catch (error) {
    throw new Error(`Failed to get user email: ${error.message}`);
  }
}

// ====================================
// Contract Creation
// ====================================
async function createContract(req, res, { db, log, error }) {
  const { senderId, travelerId, packageId, amount, platformFeePercentage = 0.05 } = JSON.parse(req.body);
  
  try {
    // Validate input
    const validationErrors = validateInput({ senderId, travelerId, packageId, amount }, {
      senderId: { required: true, type: 'string' },
      travelerId: { required: true, type: 'string' },
      packageId: { required: true, type: 'string' },
      amount: { required: true, type: 'number', min: 1000 } // Minimum 10 NGN (1000 kobo)
    });

    if (validationErrors.length > 0) {
      return createResponse(res, 400, { errors: validationErrors });
    }

    if (!isValidAmount(amount)) {
      return createResponse(res, 400, { error: 'Invalid amount' });
    }

    // Calculate fees
    const platformFee = Math.round(amount * platformFeePercentage);
    const travelerAmount = amount - platformFee;

    // Create contract
    const contract = await db.createContract({
      senderId,
      travelerId,
      packageId,
      amount,
      platformFee,
      travelerAmount,
      status: 'AWAITING_PAYMENT'
    });

    log(`Contract created: ${contract.$id}`);

    return createResponse(res, 200, {
      success: true,
      contract: {
        ...contract,
        amountNGN: (amount / 100).toFixed(2),
        platformFeeNGN: (platformFee / 100).toFixed(2),
        travelerAmountNGN: (travelerAmount / 100).toFixed(2)
      }
    });

  } catch (err) {
    error(`Contract creation error: ${err.message}`);
    return createResponse(res, 500, { error: 'Failed to create contract' });
  }
}

// ====================================
// Payment Initiation
// ====================================
async function initiatePayment(req, res, { paystack, db, users, log, error }) {
  const { contractId, userId } = JSON.parse(req.body);
  
  try {
    // Validate input
    const validationErrors = validateInput({ contractId, userId }, {
      contractId: { required: true, type: 'string' },
      userId: { required: true, type: 'string' }
    });

    if (validationErrors.length > 0) {
      return createResponse(res, 400, { errors: validationErrors });
    }

    // Get contract details
    const contract = await db.getContract(contractId);
    if (!contract) {
      return createResponse(res, 404, { error: 'Contract not found' });
    }

    if (contract.senderId !== userId) {
      return createResponse(res, 403, { error: 'Unauthorized' });
    }

    if (contract.status !== 'AWAITING_PAYMENT') {
      return createResponse(res, 400, { 
        error: `Contract not in AWAITING_PAYMENT status. Current status: ${contract.status}` 
      });
    }

    // Get sender email
    const senderEmail = await getUserEmail(contract.senderId, users);
    if (!isValidEmail(senderEmail)) {
      return createResponse(res, 400, { error: 'Invalid sender email' });
    }

    // Initialize Paystack transaction
    const paystackData = {
      email: senderEmail,
      amount: contract.amount, // in kobo
      reference: `sendr_${contractId}_${Date.now()}`,
      callback_url: `${process.env.FRONTEND_URL}/contracts/${contractId}/payment/callback`,
      metadata: {
        contractId,
        senderId: contract.senderId,
        travelerId: contract.travelerId,
        custom_fields: [
          {
            display_name: "Contract ID",
            variable_name: "contract_id",
            value: contractId
          }
        ]
      },
      channels: ['card', 'bank', 'ussd', 'mobile_money']
    };

    const transaction = await paystack.initializeTransaction(paystackData);

    // Create payment record
    const payment = await db.createPayment({
      contractId,
      paystackReference: transaction.reference,
      paystackAccessCode: transaction.access_code,
      amount: contract.amount,
      status: 'PENDING',
      metadata: { 
        authorization_url: transaction.authorization_url,
        created_at: new Date().toISOString()
      }
    });

    log(`Payment initiated for contract ${contractId}`);

    return createResponse(res, 200, {
      success: true,
      payment: {
        ...payment,
        amountNGN: (contract.amount / 100).toFixed(2)
      },
      authorization_url: transaction.authorization_url,
      access_code: transaction.access_code,
      reference: transaction.reference
    });

  } catch (err) {
    error(`Payment initiation error: ${err.message}`);
    return createResponse(res, 500, { error: 'Failed to initiate payment' });
  }
}

// ====================================
// Payment Verification
// ====================================
async function verifyPayment(req, res, { paystack, db, log, error }) {
  const { reference } = JSON.parse(req.body);
  
  try {
    // Validate input
    const validationErrors = validateInput({ reference }, {
      reference: { required: true, type: 'string' }
    });

    if (validationErrors.length > 0) {
      return createResponse(res, 400, { errors: validationErrors });
    }

    // Verify transaction with Paystack
    const verification = await paystack.verifyTransaction(reference);
    
    if (verification.data.status === 'success') {
      const payment = await db.getPaymentByReference(reference);
      if (!payment) {
        return createResponse(res, 404, { error: 'Payment not found' });
      }

      // Update payment status
      await db.updatePayment(payment.$id, {
        status: 'ESCROWED',
        metadata: { 
          ...payment.metadata, 
          verification: verification.data,
          escrowed_at: new Date().toISOString()
        }
      });

      // Update contract status
      await db.updateContract(payment.contractId, {
        status: 'FUNDED',
        updatedAt: new Date().toISOString()
      });

      log(`Payment verified and escrowed for reference ${reference}`);

      return createResponse(res, 200, {
        success: true,
        status: 'verified',
        data: verification.data
      });
    } else {
      // Payment failed
      const payment = await db.getPaymentByReference(reference);
      if (payment) {
        await db.updatePayment(payment.$id, {
          status: 'FAILED',
          metadata: { 
            ...payment.metadata, 
            verification: verification.data,
            failed_at: new Date().toISOString()
          }
        });
      }

      return createResponse(res, 400, {
        success: false,
        status: 'failed',
        message: 'Payment verification failed',
        data: verification.data
      });
    }

  } catch (err) {
    error(`Payment verification error: ${err.message}`);
    return createResponse(res, 500, { error: 'Verification failed' });
  }
}

// ====================================
// Paystack Webhook Handler
// ====================================
async function handleWebhook(req, res, { paystack, db, log, error }) {
  const body = req.body;
  const signature = req.headers['x-paystack-signature'];

  try {
    // Validate webhook signature
    if (!validateWebhook(body, signature, process.env.PAYSTACK_SECRET_KEY)) {
      error('Invalid webhook signature');
      return createResponse(res, 400, { error: 'Invalid signature' });
    }

    const event = JSON.parse(body);
    log(`Webhook received: ${event.event}`);

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
        metadata: { 
          ...payment.metadata, 
          charge_data: data,
          escrowed_at: new Date().toISOString()
        }
      });

      await db.updateContract(payment.contractId, {
        status: 'FUNDED',
        updatedAt: new Date().toISOString()
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
        metadata: { 
          ...payment.metadata, 
          charge_data: data,
          failed_at: new Date().toISOString()
        }
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
        metadata: {
          ...payment.metadata,
          transfer_success: data,
          transferred_at: new Date().toISOString()
        }
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
        metadata: {
          ...payment.metadata,
          transfer_failed: data,
          transfer_failed_at: new Date().toISOString()
        }
      });
      
      // Revert contract status to DISPUTED for manual intervention
      await db.updateContract(payment.contractId, {
        status: 'DISPUTED',
        updatedAt: new Date().toISOString()
      });
      
      log(`Transfer failed for ${data.reference}`);
    }
  } catch (err) {
    error(`Transfer failed handler error: ${err.message}`);
  }
}

// ====================================
// Escrow Release (Split Payment)
// ====================================
async function releaseEscrow(req, res, { paystack, db, users, log, error }) {
  const { contractId, eventType, triggeredBy } = JSON.parse(req.body);
  
  try {
    // Validate input
    const validationErrors = validateInput({ contractId, eventType, triggeredBy }, {
      contractId: { required: true, type: 'string' },
      eventType: { required: true, type: 'string' },
      triggeredBy: { required: true, type: 'string' }
    });

    if (validationErrors.length > 0) {
      return createResponse(res, 400, { errors: validationErrors });
    }

    // Get contract and validate
    const contract = await db.getContract(contractId);
    if (!contract) {
      return createResponse(res, 404, { error: 'Contract not found' });
    }

    if (contract.status !== 'IN_TRANSIT') {
      return createResponse(res, 400, { 
        error: `Contract must be IN_TRANSIT. Current status: ${contract.status}` 
      });
    }

    // Only allow delivery confirmation to trigger payout
    if (eventType !== 'DELIVERY_CONFIRMED') {
      return createResponse(res, 400, { error: 'Only delivery confirmation can trigger payout' });
    }

    // Get payment record
    const payment = await db.getPaymentByContract(contractId);
    if (!payment) {
      return createResponse(res, 404, { error: 'Payment record not found' });
    }

    if (payment.status !== 'ESCROWED') {
      return createResponse(res, 400, { 
        error: `Payment must be ESCROWED. Current status: ${payment.status}` 
      });
    }

    // Get traveler details for payout
    let traveler;
    try {
      traveler = await users.get(contract.travelerId);
    } catch (err) {
      return createResponse(res, 404, { error: 'Traveler not found' });
    }

    const travelerBankDetails = traveler.prefs?.bankDetails;
    if (!travelerBankDetails?.account_number || !travelerBankDetails?.bank_code) {
      return createResponse(res, 400, { 
        error: 'Traveler bank details incomplete. Account number and bank code required.' 
      });
    }

    // Create transfer recipient for traveler
    const recipient = await paystack.createTransferRecipient({
      type: 'nuban',
      name: traveler.name || traveler.email,
      account_number: travelerBankDetails.account_number,
      bank_code: travelerBankDetails.bank_code,
      currency: 'NGN'
    });

    // Initiate transfer to traveler
    const transfer = await paystack.initiateTransfer({
      source: 'balance',
      amount: contract.travelerAmount,
      recipient: recipient.recipient_code,
      reason: `Payment for delivery - Contract ${contractId}`,
      reference: `payout_${contractId}_${Date.now()}`
    });

    // Update payment status
    await db.updatePayment(payment.$id, {
      status: 'RELEASED',
      metadata: {
        ...payment.metadata,
        payout: {
          transfer_code: transfer.transfer_code,
          recipient_code: recipient.recipient_code,
          amount: contract.travelerAmount,
          released_at: new Date().toISOString()
        }
      }
    });

    // Update contract status
    await db.updateContract(contractId, {
      status: 'DELIVERED',
      updatedAt: new Date().toISOString()
    });

    // Record delivery event
    await db.createDeliveryEvent({
      contractId,
      eventType: 'DELIVERY_CONFIRMED',
      triggeredBy,
      metadata: {
        payoutReference: transfer.reference,
        transferCode: transfer.transfer_code,
        travelerAmount: contract.travelerAmount
      }
    });

    log(`Escrow released for contract ${contractId}`);

    return createResponse(res, 200, {
      success: true,
      transfer: {
        reference: transfer.reference,
        amount: contract.travelerAmount,
        amountNGN: (contract.travelerAmount / 100).toFixed(2),
        status: transfer.status
      }
    });

  } catch (err) {
    error(`Escrow release error: ${err.message}`);
    return createResponse(res, 500, { error: 'Failed to release escrow' });
  }
}

// ====================================
// Refund Process
// ====================================
async function processRefund(req, res, { paystack, db, log, error }) {
  const { contractId, reason, triggeredBy } = JSON.parse(req.body);
  
  try {
    // Validate input
    const validationErrors = validateInput({ contractId, reason, triggeredBy }, {
      contractId: { required: true, type: 'string' },
      reason: { required: true, type: 'string' },
      triggeredBy: { required: true, type: 'string' }
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
      return createResponse(res, 400, { 
        error: `Payment must be ESCROWED to refund. Current status: ${payment.status}` 
      });
    }

    // Initiate refund via Paystack
    const refund = await paystack.refundTransaction({
      transaction: payment.paystackReference,
      amount: contract.amount // Full refund
    });

    // Update payment status
    await db.updatePayment(payment.$id, {
      status: 'REFUNDED',
      metadata: {
        ...payment.metadata,
        refund: {
          refund_reference: refund.data.reference,
          refunded_at: new Date().toISOString(),
          reason
        }
      }
    });

    // Update contract status
    await db.updateContract(contractId, {
      status: 'CANCELLED',
      updatedAt: new Date().toISOString()
    });

    // Record event
    await db.createDeliveryEvent({
      contractId,
      eventType: 'CANCELLED',
      triggeredBy,
      metadata: { 
        reason, 
        refund_reference: refund.data.reference,
        refund_amount: contract.amount
      }
    });

    log(`Refund processed for contract ${contractId}`);

    return createResponse(res, 200, {
      success: true,
      refund: {
        reference: refund.data.reference,
        amount: contract.amount,
        amountNGN: (contract.amount / 100).toFixed(2),
        status: refund.data.status
      }
    });

  } catch (err) {
    error(`Refund error: ${err.message}`);
    return createResponse(res, 500, { error: 'Refund processing failed' });
  }
}