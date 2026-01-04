import {  Databases, Query, ID } from 'node-appwrite';

export async function saveTransaction(transactionData, client, variables) {
  const databases = new Databases(client);
  
  const document = {
    userId: transactionData.userId,
    amount: transactionData.amount,
    type: transactionData.type,
    status: transactionData.status || 'pending',
    reference: transactionData.reference,
    paymentReference: transactionData.paymentReference || null,
    checkoutUrl: transactionData.checkoutUrl || null,
    description: transactionData.description || '',
    balanceAfter: transactionData.balanceAfter || null,
    metadata: transactionData.metadata || {},
  };
  
  return await databases.createDocument(
    variables['APPWRITE_DATABASE_ID'],
    variables['APPWRITE_TRANSACTIONS_COLLECTION_ID'],
    ID.unique(),
    document
  );
}

export async function updateWalletBalance(userId, amount, type, client, variables) {
  const databases = new Databases(client);
  
  // Get current wallet
  const wallets = await databases.listDocuments(
    variables['APPWRITE_DATABASE_ID'],
    variables['APPWRITE_WALLETS_COLLECTION_ID'],
    [Query.equal('userId', userId)]
  );
  
  if (wallets.documents.length === 0) {
    throw new Error('Wallet not found');
  }
  
  const wallet = wallets.documents[0];
  let newBalance = wallet.balance;
   
  // Update balance based on type
  if (type === 'credit') {
    newBalance = wallet.balance + amount;
  } else if (type === 'debit') {
    newBalance = wallet.balance - amount;
    if (newBalance < 0) {
      throw new Error('Insufficient balance');
    }
  }
  
  // Update wallet
  await databases.updateDocument(
    variables['APPWRITE_DATABASE_ID'],
    variables['APPWRITE_WALLETS_COLLECTION_ID'],
    wallet.$id,
    {
      balance: newBalance,
    }
  );
  
  return newBalance;
}

export async function getUserWallet(userId, client, variables) {
  const databases = new Databases(client);
  
  const wallets = await databases.listDocuments(
    variables['APPWRITE_DATABASE_ID'],
    variables['APPWRITE_WALLETS_COLLECTION_ID'],
    [Query.equal('userId', userId)]
  );
  
  return wallets.documents[0] || null;
}
 
export async function getTransactions(userId, limit = 50, client, variables) {
  const databases = new Databases(client);
  
  return await databases.listDocuments( 
    variables['APPWRITE_DATABASE_ID'],
    variables['APPWRITE_TRANSACTIONS_COLLECTION_ID'],
    [
      Query.equal('userId', userId),
      Query.orderDesc('createdAt'),
      Query.limit(limit)
    ]
  );
}