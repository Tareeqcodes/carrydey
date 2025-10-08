import { Client, Databases } from 'node-appwrite';
import PaystackService from './paystack.js';
import DatabaseService from './database.js';
import Utils from './utils.js';
 
export default async ({ req, res, log, error }) => {
  try {
    const client = new Client();
    const paystack = new PaystackService(process.env.PAYSTACK_SECRET_KEY);
    
    client
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const dbService = new DatabaseService(
      databases, 
      process.env.APPWRITE_DATABASE_ID
    );

    // Parse request body
    const body = typeof req.body === 'string' 
      ? JSON.parse(req.body) 
      : req.body;

    // Extract path and method from body
    const { path, method } = body;

    log(`Received ${method} request to ${path}`);
    log(`Body: ${JSON.stringify(body)}`);

    // Route requests - PASS log and error to ALL handlers
    if (path === '/initialize-payment' && method === 'POST') {
      const result = await handleInitializePayment(body, dbService, paystack, log, error);
      return res.json(result);
    } else if (path === '/verify-payment' && method === 'POST') {
      const result = await handleVerifyPayment(body, dbService, paystack, log, error);
      return res.json(result);
    } else if (path === '/confirm-delivery' && method === 'POST') {
      const result = await handleConfirmDelivery(body, dbService, paystack, log, error);
      return res.json(result);
    } else if (path === '/initiate-refund' && method === 'POST') {
      const result = await handleInitiateRefund(body, dbService, paystack, log, error);
      return res.json(result);
    } else if (path === '/resolve-dispute' && method === 'POST') {
      const result = await handleResolveDispute(body, dbService, paystack, log, error);
      return res.json(result);
    } else {
      return res.json(Utils.formatResponse(false, null, 'Endpoint not found', 404));
    }

  } catch (err) {
    error('Unhandled error in main function:', err);
    return res.json(Utils.handleError(err, 'main function'));
  }
};

// ALL HANDLERS NOW RECEIVE log AND error AS PARAMETERS
async function handleInitializePayment(body, dbService, paystack, log, error) {
  try {
    Utils.validateRequiredFields(body, [
      'packageId',  
      'senderId', 
      'travelerId', 
      'amount', 
      'senderEmail'
    ]);

    const { packageId, senderId, travelerId, amount, senderEmail } = body;

    log(`Initializing payment: ${amount} kobo for package ${packageId}`);
    
    // Check for existing escrow
    const existingEscrow = await dbService.getEscrowByPackage(packageId);
    if (existingEscrow.success && existingEscrow.data) {
      log(`Escrow already exists for package ${packageId}`);
      throw new Error('Escrow already exists for this package');
    }

    log(`Creating Paystack transaction for ${senderEmail}`);
    // Paystack transaction
    const paystackResult = await paystack.initializeTransaction(
      senderEmail,
      amount,
      {
        packageId,
        senderId,
        travelerId,
        type: 'escrow',
      }
    );

    if (!paystackResult.success) {
      error(`Paystack initialization failed: ${paystackResult.error}`);
      throw new Error(paystackResult.error);
    }

    log(`Paystack transaction created: ${paystackResult.reference}`);

    // Create escrow record
    const escrowResult = await dbService.createEscrowRecord({
      packageId,
      senderId,
      travelerId,
      amount: amount,
      paystackReference: paystackResult.reference,
    });

    if (!escrowResult.success) {
      error(`Failed to create escrow record: ${escrowResult.error}`);
      throw new Error(escrowResult.error);
    }

    log(`Escrow record created: ${escrowResult.escrowId}`);

    // Update package status
    await dbService.updatePackageStatus(packageId, 'payment_pending');
    log(`Package status updated to payment_pending`);

    return Utils.formatResponse(true, {
      authorizationUrl: paystackResult.authorizationUrl,
      reference: paystackResult.reference,
      escrowId: escrowResult.escrowId,
    });

  } catch (err) {
    error('Error in handleInitializePayment:', err.message);
    return Utils.handleError(err, 'initialize payment');
  }
}

async function handleVerifyPayment(body, dbService, paystack, log, error) {
  try {
    Utils.validateRequiredFields(body, ['reference']);

    const { reference } = body;

    log(`Verifying payment for reference: ${reference}`);

    // Verify Paystack transaction
    const verification = await paystack.verifyTransaction(reference);
    if (!verification.success) {
      error(`Paystack verification failed: ${verification.error}`);
      throw new Error(verification.error);
    }

    log(`Paystack verification result: ${verification.verified ? 'SUCCESS' : 'FAILED'}`);

    // Get escrow record
    const escrowRecord = await dbService.getEscrowByReference(reference);
    if (!escrowRecord.success || !escrowRecord.data) {
      error('Escrow record not found for reference:', reference);
      throw new Error('Escrow record not found');
    }

    const escrow = escrowRecord.data;
    log(`Found escrow record: ${escrow.$id}`);

    if (verification.verified) {
      // Update escrow status to funded
      await dbService.updateEscrowStatus(escrow.$id, 'funded', {
        paidAt: verification.transaction.paidAt,
        paymentChannel: verification.transaction.channel,
      });

      log(`Escrow ${escrow.$id} status updated to funded`);

      // Update package status
      await dbService.updatePackageStatus(escrow.packageId, 'in_transit');
      log(`Package ${escrow.packageId} status updated to in_transit`);

      return Utils.formatResponse(true, {
        status: 'funded',
        escrowId: escrow.$id,
        amount: verification.transaction.amount,
      });
    } else {
      // Payment failed
      log(`Payment verification failed for ${reference}`);
      await dbService.updateEscrowStatus(escrow.$id, 'failed');
      await dbService.updatePackageStatus(escrow.packageId, 'payment_failed');

      return Utils.formatResponse(false, null, 'Payment verification failed');
    }

  } catch (err) {
    error('Error in handleVerifyPayment:', err.message);
    return Utils.handleError(err, 'verify payment');
  }
}

async function handleConfirmDelivery(body, dbService, paystack, log, error) {
  try {
    Utils.validateRequiredFields(body, ['escrowId']);

    const { escrowId } = body;

    log(`Confirming delivery for escrow: ${escrowId}`);

    // Get escrow record
    const escrowRecord = await dbService.getEscrowById(escrowId);
    if (!escrowRecord.success || !escrowRecord.data) {
      error('Escrow record not found:', escrowId);
      throw new Error('Escrow record not found');
    }

    const escrow = escrowRecord.data;

    if (escrow.status !== 'funded') {
      error(`Invalid escrow status for delivery: ${escrow.status}`);
      throw new Error('Escrow must be funded to confirm delivery');
    }

    log(`Getting bank details for traveler: ${escrow.travelerId}`);

    // Get traveler's bank details
    const bankDetails = await dbService.getUserBankDetails(escrow.travelerId);
    if (!bankDetails.success) {
      error('Failed to get traveler bank details:', bankDetails.error);
      throw new Error('Failed to get traveler bank details');
    }

    log(`Bank details retrieved: ${bankDetails.data.accountNumber}`);

    // Create transfer recipient if not exists
    let recipientCode = escrow.travelerRecipientCode;
    if (!recipientCode) {
      log('Creating new transfer recipient...');
      const recipientResult = await paystack.createTransferRecipient(
        bankDetails.data.accountNumber,
        bankDetails.data.bankCode,
        bankDetails.data.accountName
      );

      if (!recipientResult.success) {
        error('Failed to create recipient:', recipientResult.error);
        throw new Error(recipientResult.error);
      }

      recipientCode = recipientResult.recipientCode;
      log(`Recipient created: ${recipientCode}`);
    }

    log(`Initiating transfer of ${escrow.amount} kobo to ${recipientCode}`);

    // Transfer funds to traveler
    const transferResult = await paystack.transferToTraveler(
      recipientCode,
      escrow.amount,
      escrow.paystackReference
    );

    if (!transferResult.success) {
      error('Transfer failed:', transferResult.error);
      throw new Error(transferResult.error);
    }

    log(`Transfer successful: ${transferResult.reference}`);

    // Update escrow status
    await dbService.updateEscrowStatus(escrowId, 'completed', {
      travelerRecipientCode: recipientCode,
      transferReference: transferResult.reference,
      transferCode: transferResult.transferCode,
      completedAt: new Date().toISOString(),
    });

    log(`Escrow ${escrowId} marked as completed`);

    // Update package status
    await dbService.updatePackageStatus(escrow.packageId, 'delivered');
    log(`Package ${escrow.packageId} marked as delivered`);

    return Utils.formatResponse(true, {
      status: 'completed',
      transferReference: transferResult.reference,
    });

  } catch (err) {
    error('Error in handleConfirmDelivery:', err.message);
    return Utils.handleError(err, 'confirm delivery');
  }
}

async function handleInitiateRefund(body, dbService, paystack, log, error) {
  try {
    Utils.validateRequiredFields(body, ['escrowId', 'reason']);

    const { escrowId, reason } = body;

    log(`Initiating refund for escrow: ${escrowId}`);
    log(`Refund reason: ${reason}`);

    // Get escrow record
    const escrowRecord = await dbService.getEscrowById(escrowId);
    if (!escrowRecord.success || !escrowRecord.data) {
      error('Escrow record not found:', escrowId);
      throw new Error('Escrow record not found');
    }

    const escrow = escrowRecord.data;

    if (escrow.status !== 'funded') {
      error(`Cannot refund escrow with status: ${escrow.status}`);
      throw new Error('Only funded escrow can be refunded');
    }

    // Update escrow status to refunding
    await dbService.updateEscrowStatus(escrowId, 'refunding', {
      refundReason: reason,
      refundInitiatedAt: new Date().toISOString(),
    });

    log(`Escrow ${escrowId} marked as refunding`);

    // Update package status
    await dbService.updatePackageStatus(escrow.packageId, 'refunding');
    log(`Package ${escrow.packageId} marked as refunding`);

    return Utils.formatResponse(true, {
      status: 'refunding',
      message: 'Refund initiated and pending processing',
    });

  } catch (err) {
    error('Error in handleInitiateRefund:', err.message);
    return Utils.handleError(err, 'initiate refund');
  }
}

async function handleResolveDispute(body, dbService, paystack, log, error) {
  try {
    Utils.validateRequiredFields(body, ['escrowId', 'resolution']);

    const { escrowId, resolution } = body;

    log(`Resolving dispute for escrow: ${escrowId}`);
    log(`Resolution type: ${resolution}`);

    // Get escrow record
    const escrowRecord = await dbService.getEscrowById(escrowId);
    if (!escrowRecord.success || !escrowRecord.data) {
      error('Escrow record not found:', escrowId);
      throw new Error('Escrow record not found');
    }

    const escrow = escrowRecord.data;

    if (escrow.status !== 'disputed') {
      error(`Cannot resolve escrow with status: ${escrow.status}`);
      throw new Error('Only disputed escrow can be resolved');
    }

    if (resolution === 'release_to_traveler') {
      log('Resolution: Releasing funds to traveler');
      // Proceed with payment to traveler
      return await handleConfirmDelivery(body, dbService, paystack, log, error);
    } else if (resolution === 'refund_to_sender') {
      log('Resolution: Refunding to sender');
      // Initiate refund
      return await handleInitiateRefund(
        { ...body, reason: 'Dispute resolution - refund to sender' },
        dbService,
        paystack,
        log,
        error
      );
    } else {
      error(`Invalid resolution type: ${resolution}`);
      throw new Error('Invalid resolution type');
    }

  } catch (err) {
    error('Error in handleResolveDispute:', err.message);
    return Utils.handleError(err, 'resolve dispute'); 
  }
}