import { Client, Databases } from 'node-appwrite';
import PaystackService from './paystack.js';
import DatabaseService from './database.js';
import Utils from './utils.js';
 
export default async ({ req, res, log, error }) => {
  try {
   
    const client = new Client();
    const paystack = new PaystackService(process.env.PAYSTACK_SECRET_KEY);
    
    client
      .setEndpoint(process.env.APPWRITE_ENDPOINT_ID)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const dbService = new DatabaseService(
      databases, 
      process.env.APPWRITE_DATABASE_ID
    );

    
    const { method, path } = req;
    
    const body = typeof req.body === 'string' 
      ? JSON.parse(req.body) 
      : req.body;

    log(`Received ${method} request to ${path}`);
    log(`Body: ${JSON.stringify(body)}`);


    // Route requests
    if (path === '/initialize-payment' && method === 'POST') {
      const result = await handleInitializePayment(body, dbService, paystack, log);
      return res.json(result);
    } else if (path === '/verify-payment' && method === 'POST') {
      const result = await handleVerifyPayment(body, dbService, paystack, log);
      return res.json(result);
    } else if (path === '/confirm-delivery' && method === 'POST') {
      const result = await handleConfirmDelivery(body, dbService, paystack, log);
      return res.json(result);
    } else if (path === '/initiate-refund' && method === 'POST') {
      const result = await handleInitiateRefund(body, dbService, paystack, log);
      return res.json(result);
    } else if (path === '/resolve-dispute' && method === 'POST') {
      const result = await handleResolveDispute(body, dbService, paystack, log);
      return res.json(result);
    } else {
      return res.json(Utils.formatResponse(false, null, 'Endpoint not found', 404));
    }

  } catch (err) {
    error('Unhandled error in main function:', err);
    return res.json(Utils.handleError(err, 'main function'));
  }
};


async function handleInitializePayment(body, dbService, paystack, log) {
  try {
    Utils.validateRequiredFields(body, [
      'packageId',  
      'senderId', 
      'travelerId', 
      'amount', 
      'senderEmail'
    ]);

    const { packageId, senderId, travelerId, amount, senderEmail } = body;

    log(`Initializing payment: ${amount} kobo`);
    
    const existingEscrow = await dbService.getEscrowByPackage(packageId);
    if (existingEscrow.success && existingEscrow.data) {
      throw new Error('Escrow already exists for this package');
    }

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
      throw new Error(paystackResult.error);
    }

    // Create escrow record
    const escrowResult = await dbService.createEscrowRecord({
      packageId,
      senderId,
      travelerId,
      amount: amount,
      paystackReference: paystackResult.reference,
    });

    if (!escrowResult.success) {
      throw new Error(escrowResult.error);
    }

    // Update package status
    await dbService.updatePackageStatus(packageId, 'payment_pending');

    return Utils.formatResponse(true, {
      authorizationUrl: paystackResult.authorizationUrl,
      reference: paystackResult.reference,
      escrowId: escrowResult.escrowId,
    });

  } catch (err) {
    return Utils.handleError(err, 'initialize payment');
  }
}

async function handleVerifyPayment(body, dbService, paystack, log) {
  try {
    Utils.validateRequiredFields(body, ['reference']);

    const { reference } = body;

    log(`Verifying payment with reference: ${reference}`);

    // Verify Paystack transaction
    const verification = await paystack.verifyTransaction(reference);
    if (!verification.success) {
      throw new Error(verification.error);
    }

    // Get escrow record
    const escrowRecord = await dbService.getEscrowByReference(reference);
    if (!escrowRecord.success || !escrowRecord.data) {
      throw new Error('Escrow record not found');
    }

    const escrow = escrowRecord.data;

    if (verification.verified) {
      // Update escrow status to funded
      await dbService.updateEscrowStatus(escrow.$id, 'funded', {
        paidAt: verification.transaction.paidAt,
        paymentChannel: verification.transaction.channel,
      });

      // Update package status
      await dbService.updatePackageStatus(escrow.packageId, 'in_transit');

      return Utils.formatResponse(true, {
        status: 'funded',
        escrowId: escrow.$id,
        amount: verification.transaction.amount,
      });
    } else {
      // Payment failed
      await dbService.updateEscrowStatus(escrow.$id, 'failed');
      await dbService.updatePackageStatus(escrow.packageId, 'payment_failed');

      return Utils.formatResponse(false, null, 'Payment verification failed');
    }

  } catch (err) {
    return Utils.handleError(err, 'verify payment');
  }
}

async function handleConfirmDelivery(body, dbService, paystack, log) {
  try {
    Utils.validateRequiredFields(body, ['escrowId']);

    const { escrowId } = body;

    log(`Confirming delivery for escrow: ${escrowId}`);

    // Get escrow record
    const escrowRecord = await dbService.getEscrowById(escrowId);
    if (!escrowRecord.success || !escrowRecord.data) {
      throw new Error('Escrow record not found');
    }

    const escrow = escrowRecord.data;

    if (escrow.status !== 'funded') {
      throw new Error('Escrow must be funded to confirm delivery');
    }

    // Get traveler's bank details
    const bankDetails = await dbService.getUserBankDetails(escrow.travelerId);
    if (!bankDetails.success) {
      throw new Error('Failed to get traveler bank details');
    }

    // Create transfer recipient if not exists
    let recipientCode = escrow.travelerRecipientCode;
    if (!recipientCode) {
      const recipientResult = await paystack.createTransferRecipient(
        bankDetails.data.accountNumber,
        bankDetails.data.bankCode,
        bankDetails.data.accountName
      );

      if (!recipientResult.success) {
        throw new Error(recipientResult.error);
      }

      recipientCode = recipientResult.recipientCode;
    }

    // Transfer funds to traveler
    const transferResult = await paystack.transferToTraveler(
      recipientCode,
      escrow.amount,
      escrow.paystackReference
    );

    if (!transferResult.success) {
      throw new Error(transferResult.error);
    }

    // Update escrow status
    await dbService.updateEscrowStatus(escrowId, 'completed', {
      travelerRecipientCode: recipientCode,
      transferReference: transferResult.reference,
      transferCode: transferResult.transferCode,
      completedAt: new Date().toISOString(),
    });

    // Update package status
    await dbService.updatePackageStatus(escrow.packageId, 'delivered');

    return Utils.formatResponse(true, {
      status: 'completed',
      transferReference: transferResult.reference,
    });

  } catch (err) {
    return Utils.handleError(err, 'confirm delivery');
  }
}

async function handleInitiateRefund(body, dbService, paystack, log) {
  try {
    Utils.validateRequiredFields(body, ['escrowId', 'reason']);

    const { escrowId, reason } = body;

    log(`Initiating refund for escrow: ${escrowId}`);

    // Get escrow record
    const escrowRecord = await dbService.getEscrowById(escrowId);
    if (!escrowRecord.success || !escrowRecord.data) {
      throw new Error('Escrow record not found');
    }

    const escrow = escrowRecord.data;

    if (escrow.status !== 'funded') {
      throw new Error('Only funded escrow can be refunded');
    }

    // Update escrow status to refunding
    await dbService.updateEscrowStatus(escrowId, 'refunding', {
      refundReason: reason,
      refundInitiatedAt: new Date().toISOString(),
    });

    // Update package status
    await dbService.updatePackageStatus(escrow.packageId, 'refunding');

    return Utils.formatResponse(true, {
      status: 'refunding',
      message: 'Refund initiated and pending processing',
    });

  } catch (err) {
    return Utils.handleError(err, 'initiate refund');
  }
}

async function handleResolveDispute(body, dbService, paystack, log) {
  try {
    Utils.validateRequiredFields(body, ['escrowId', 'resolution']);

    const { escrowId, resolution } = body;

    log(`Resolving dispute for escrow: ${escrowId}`);

    // Get escrow record
    const escrowRecord = await dbService.getEscrowById(escrowId);
    if (!escrowRecord.success || !escrowRecord.data) {
      throw new Error('Escrow record not found');
    }

    const escrow = escrowRecord.data;

    if (escrow.status !== 'disputed') {
      throw new Error('Only disputed escrow can be resolved');
    }

    if (resolution === 'release_to_traveler') {
      // Proceed with payment to traveler
      return await handleConfirmDelivery(body, dbService, paystack, log);
    } else if (resolution === 'refund_to_sender') {
      // Initiate refund
      return await handleInitiateRefund(
        { ...body, reason: 'Dispute resolution - refund to sender' },
        dbService,
        paystack,
        log
      );
    } else {
      throw new Error('Invalid resolution type');
    }

  } catch (err) {
    return Utils.handleError(err, 'resolve dispute');
  }
}