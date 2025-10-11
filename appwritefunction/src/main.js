import * as sdk from 'node-appwrite';
import Paystack from 'paystack';

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

export default async (req, res) => {
  const client = new sdk.Client();
  const databases = new sdk.Databases(client);
  
  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT_ID)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  try {
    const { action, data } = JSON.parse(req.payload);

    if (!action || !data) {
      throw new Error('Missing required fields: action and data');
    }

    switch (action) {
      case 'initialize_escrow':
        return await initializeEscrow(databases, data);
      
      case 'confirm_payment':
        return await confirmPayment(databases, data);
      
      case 'release_escrow':
        return await releaseEscrow(databases, data);
      
      case 'refund_escrow':
        return await refundEscrow(databases, data);
      
      default:
        throw new Error(`Invalid action: ${action}`);
    }
  } catch (error) {
    console.error('Escrow function error:', error);
    return res.json({ success: false, error: error.message }, 500);
  }
};

async function initializeEscrow(databases, data) {
  const { applicationId, amount, senderId, travelerId, packageId } = data;

  // Validate required fields
  if (!applicationId || !amount || !senderId || !travelerId || !packageId) {
    throw new Error('Missing required escrow fields');
  }

  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  // Create Paystack transaction
  const paystackResponse = await paystack.transaction.initialize({
    email: `${senderId}@escrow.travelerapp.com`,
    amount: Math.round(amount * 100), // Convert to kobo
    metadata: {
      applicationId,
      type: 'escrow'
    }
  });

  // Create escrow record
  const escrowRecord = await databases.createDocument(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_CONTRACTS_COLLECTION_ID,
    sdk.ID.unique(),
    {
      senderId,
      travelerId,
      packageId,
      applicationId,
      amount,
      paystackReference: paystackResponse.data.reference,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  );

  return {
    success: true,
    authorizationUrl: paystackResponse.data.authorization_url,
    reference: paystackResponse.data.reference,
    escrowId: escrowRecord.$id
  };
}

async function confirmPayment(databases, data) {
  const { reference } = data;

  if (!reference) {
    throw new Error('Missing payment reference');
  }

  // Verify payment with Paystack
  const verification = await paystack.transaction.verify(reference);

  if (verification.data.status !== 'success') {
    throw new Error('Payment not successful');
  }

  // Query for escrow record
  const escrows = await databases.listDocuments(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_CONTRACTS_COLLECTION_ID,
    [sdk.Query.equal('paystackReference', reference)]
  );

  if (escrows.documents.length === 0) {
    throw new Error('Escrow record not found');
  }

  const escrow = escrows.documents[0];

  // Update escrow status
  await databases.updateDocument(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_CONTRACTS_COLLECTION_ID,
    escrow.$id,
    {
      status: 'held',
      paidAt: new Date().toISOString()
    }
  );

  // Update application status
  await databases.updateDocument(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_APPLICATIONS_COLLECTION_ID,
    escrow.applicationId,
    { status: 'paid' }
  );

  return { success: true, escrowId: escrow.$id };
}

async function releaseEscrow(databases, data) {
  const { escrowId, travelerId } = data;

  if (!escrowId || !travelerId) {
    throw new Error('Missing required fields: escrowId and travelerId');
  }

  const escrow = await databases.getDocument(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_CONTRACTS_COLLECTION_ID,
    escrowId
  );

  if (escrow.status !== 'held') {
    throw new Error(`Escrow funds not available for release. Current status: ${escrow.status}`);
  }

  // Transfer to traveler's Paystack recipient
  const transfer = await paystack.transfer.create({
    source: 'balance',
    amount: Math.round(escrow.amount * 100),
    recipient: travelerId,
    reason: 'Escrow release for package delivery'
  });

  // Update escrow status
  await databases.updateDocument(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_CONTRACTS_COLLECTION_ID,
    escrowId,
    {
      status: 'released',
      releasedAt: new Date().toISOString(),
      transferReference: transfer.data.reference
    }
  );

  return { success: true, transferReference: transfer.data.reference };
}

async function refundEscrow(databases, data) {
  const { escrowId } = data;

  if (!escrowId) {
    throw new Error('Missing required field: escrowId');
  }

  const escrow = await databases.getDocument(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_CONTRACTS_COLLECTION_ID,
    escrowId
  );

  // Refund via Paystack
  const refund = await paystack.refund.create({
    transaction: escrow.paystackReference,
    amount: Math.round(escrow.amount * 100)
  });

  // Update escrow status
  await databases.updateDocument(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_CONTRACTS_COLLECTION_ID,
    escrowId,
    {
      status: 'refunded',
      refundedAt: new Date().toISOString(),
      refundReference: refund.data.reference
    }
  );

  return { success: true, refundReference: refund.data.reference };
}