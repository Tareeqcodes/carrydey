import { Databases, Query, ID } from 'node-appwrite';
import axios from 'axios';
import crypto from 'crypto';
import { saveTransaction, updateWalletBalance } from './databases.js';
// import { generateTransactionReference } from './utils.js';

class MonnifyService {
  constructor(apiKey, secretKey, contractCode, baseUrl = 'https://api.monnify.com') {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
    this.contractCode = contractCode;
    this.baseUrl = baseUrl;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const authString = Buffer.from(`${this.apiKey}:${this.secretKey}`).toString('base64');
    
    const response = await axios.post(
      `${this.baseUrl}/api/v1/auth/login`,
      {},
      {
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        }
      }
    );

    this.accessToken = response.data.responseBody.accessToken;
    this.tokenExpiry = Date.now() + (response.data.responseBody.expiresIn * 1000) - 60000;
    
    return this.accessToken;
  }

  async initializeTransaction(transactionData) {
    const accessToken = await this.getAccessToken();
    
    const response = await axios.post(
      `${this.baseUrl}/api/v1/merchant/transactions/init-transaction`,
      {
        amount: transactionData.amount,
        customerName: transactionData.customerName,
        customerEmail: transactionData.customerEmail,
        paymentReference: transactionData.paymentReference,
        paymentDescription: transactionData.paymentDescription || 'Wallet funding',
        currencyCode: 'NGN',
        contractCode: this.contractCode,
        redirectUrl: transactionData.redirectUrl,
        paymentMethods: ["CARD", "ACCOUNT_TRANSFER"]
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.responseBody;
  }

  verifyWebhookSignature(payload, signature) {
    const computedSignature = crypto
      .createHmac('sha512', this.secretKey)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return signature === computedSignature;
  }
}

export async function createPayout(payoutData, client, variables) {
  try {
    const { userId, amount, bankCode, accountNumber, accountName } = payoutData;
    
    const monnify = new MonnifyService(
      variables['MONNIFY_API_KEY'],
      variables['MONNIFY_SECRET_KEY'],
      variables['MONNIFY_CONTRACT_CODE']
    );
    
    // First check and debit wallet
    const debitResult = await debitWallet({
      userId,
      amount,
      description: 'Payout to bank account'
    }, client, variables);
    
    if (!debitResult.success) {
      return debitResult;
    }
    
    // Initialize Monnify transfer
    const accessToken = await monnify.getAccessToken();
    const reference = `PAYOUT_${userId}_${Date.now()}`;
    
    const transferResponse = await axios.post(
      `${monnify.baseUrl}/api/v2/disbursements/single`,
      {
        amount: amount,
        reference: reference,
        narration: `Payout to ${accountName}`,
        destinationBankCode: bankCode,
        destinationAccountNumber: accountNumber,
        destinationAccountName: accountName,
        currency: 'NGN'
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Save payout transaction
    await saveTransaction({
      userId,
      amount,
      type: 'payout',
      status: 'processing',
      reference: reference,
      paymentReference: transferResponse.data.responseBody.transactionReference,
      description: `Payout to ${accountName} (${accountNumber})`,
      balanceAfter: debitResult.newBalance,
      metadata: transferResponse.data.responseBody
    }, client, variables);
    
    return {
      success: true,
      transactionReference: reference,
      message: 'Payout initiated successfully',
      newBalance: debitResult.newBalance
    };
    
  } catch (error) {
    console.error('Payout error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
}

export async function getVirtualAccount(userData, client, variables) {
  try {
    const { userId } = userData;
    
    const monnify = new MonnifyService(
      variables['MONNIFY_API_KEY'],
      variables['MONNIFY_SECRET_KEY'],
      variables['MONNIFY_CONTRACT_CODE']
    );
    
    const accessToken = await monnify.getAccessToken();
    
    // Generate unique account reference
    const accountReference = `USER_${userId}`;
    
    const response = await axios.post(
      `${monnify.baseUrl}/api/v2/bank-transfer/reserved-accounts`,
      {
        accountReference: accountReference,
        accountName: `${userData.name} - TravelSend`,
        currencyCode: 'NGN',
        contractCode: monnify.contractCode,
        customerEmail: userData.email,
        customerName: userData.name,
        getAllAvailableBanks: false,
        preferredBanks: ['50515'] 
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const accountDetails = response.data.responseBody.accounts[0];
    
    // Save virtual account info to user's wallet
    const databases = new Databases(client);
    
    const wallets = await databases.listDocuments(
      variables['APPWRITE_DATABASE_ID'],
      variables['APPWRITE_WALLETS_COLLECTION_ID'],
      [Query.equal('userId', userId)]
    );
    
    if (wallets.documents.length > 0) {
      await databases.updateDocument(
        variables['APPWRITE_DATABASE_ID'],
        variables['APPWRITE_WALLETS_COLLECTION_ID'],
        wallets.documents[0].$id,
        {
          virtualAccount: {
            accountNumber: accountDetails.accountNumber,
            accountName: accountDetails.accountName,
            bankName: accountDetails.bankName,
            bankCode: accountDetails.bankCode,
            accountReference: accountReference,
            createdAt: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        }
      );
    }
    
    return {
      success: true,
      virtualAccount: {
        accountNumber: accountDetails.accountNumber,
        accountName: accountDetails.accountName,
        bankName: accountDetails.bankName,
        bankCode: accountDetails.bankCode
      }
    };
    
  } catch (error) {
    console.error('Get virtual account error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
}

export async function handleWebhook(req, res, client) {
  try {
    const payload = JSON.parse(req.payload);
    const signature = req.headers['monnify-signature'];
    
    const monnify = new MonnifyService(
      req.variables['MONNIFY_API_KEY'],
      req.variables['MONNIFY_SECRET_KEY'],
      req.variables['MONNIFY_CONTRACT_CODE']
    );
    
    // Verify webhook signature
    if (!monnify.verifyWebhookSignature(payload, signature)) {
      throw new Error('Invalid webhook signature');
    }
    
    const eventData = payload.eventData;
    
    // Find transaction by payment reference
    const databases = new Databases(client);
    const transactions = await databases.listDocuments(
      req.variables['APPWRITE_DATABASE_ID'],
      req.variables['APPWRITE_TRANSACTIONS_COLLECTION_ID'],
      [Query.equal('paymentReference', eventData.transactionReference)]
    );
    
    if (transactions.documents.length === 0) {
      throw new Error('Transaction not found');
    }
    
    const transaction = transactions.documents[0];
    const userId = transaction.userId;
    const amount = parseFloat(eventData.amountPaid);
    
    // Update transaction status
    await databases.updateDocument(
      req.variables['APPWRITE_DATABASE_ID'],
      req.variables['APPWRITE_TRANSACTIONS_COLLECTION_ID'],
      transaction.$id,
      {
        status: eventData.paymentStatus.toLowerCase(),
        completedAt: new Date().toISOString(),
        metadata: eventData
      }
    );
    
    // If payment successful, credit wallet
    if (eventData.paymentStatus === 'PAID') {
      const newBalance = await updateWalletBalance(
        userId, 
        amount, 
        'credit', 
        client, 
        req.variables,
        `Wallet funding via ${eventData.paymentMethod}`
      );
      
      // Save completed transaction
      await saveTransaction({
        userId,
        amount,
        type: 'credit',
        status: 'completed',
        reference: eventData.transactionReference,
        paymentReference: eventData.transactionReference,
        description: `Wallet funding via ${eventData.paymentMethod}`,
        balanceAfter: newBalance,
        metadata: eventData
      }, client, req.variables);
    }
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.json({ success: false, error: error.message }, 500);
  }
}

export async function initializePayment(paymentData, client, variables) {
  try {
    const { userId, amount, email, name } = paymentData;
    
    const monnify = new MonnifyService(
      variables['MONNIFY_API_KEY'],
      variables['MONNIFY_SECRET_KEY'],
      variables['MONNIFY_CONTRACT_CODE']
    );
    
    // Generate unique references
    const paymentReference = `WALLET_${userId}_${Date.now()}`;
    const transactionReference = `TRX_${userId}_${Date.now()}`;
    
    // Initialize payment with Monnify
    const paymentResponse = await monnify.initializeTransaction({
      amount: amount,
      customerName: name,
      customerEmail: email,
      paymentReference: paymentReference,
      paymentDescription: `Wallet funding - ${amount} NGN`,
      redirectUrl: `${variables['FRONTEND_URL']}/wallet/payment-success?reference=${paymentReference}`
    });
    
    // Save pending transaction
    await saveTransaction({
      userId,
      amount,
      type: 'deposit',
      status: 'pending',
      reference: transactionReference,
      paymentReference: paymentResponse.transactionReference,
      checkoutUrl: paymentResponse.checkoutUrl,
      description: 'Wallet funding initiated'
    }, client, variables);
    
    return {
      success: true,
      data: {
        checkoutUrl: paymentResponse.checkoutUrl,
        paymentReference: paymentResponse.transactionReference,
        transactionReference: transactionReference
      }
    };
  } catch (error) {
    console.error('Initialize payment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function createWallet(userData, client, variables) {
  try {
    const { userId, email, name } = userData;
    
    const databases = new Databases(client);
    
    // Check if wallet already exists
    const existingWallets = await databases.listDocuments(
      variables['APPWRITE_DATABASE_ID'],
      variables['APPWRITE_WALLETS_COLLECTION_ID'],
      [Query.equal('userId', userId)]
    );
    
    if (existingWallets.documents.length > 0) {
      return {
        success: true,
        message: 'Wallet already exists',
        wallet: existingWallets.documents[0]
      };
    }
    
    // Create new wallet
    const wallet = await databases.createDocument(
      variables['APPWRITE_DATABASE_ID'],
      variables['APPWRITE_WALLETS_COLLECTION_ID'],
      ID.unique(),
      {
        userId,
        balance: 0,
        email,
        name,
        currency: 'NGN',
        status: 'active',
      }
    );
    
    return {
      success: true,
      message: 'Wallet created successfully',
      wallet
    };
  } catch (error) {
    console.error('Create wallet error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function debitWallet(debitData, client, variables) {
  try {
    const { userId, amount, description } = debitData;
    
    const databases = new Databases(client);
    
    // Get user's wallet
    const wallets = await databases.listDocuments(
      variables['APPWRITE_DATABASE_ID'],
      variables['APPWRITE_WALLETS_COLLECTION_ID'],
      [Query.equal('userId', userId)]
    );
    
    if (wallets.documents.length === 0) {
      return {
        success: false,
        error: 'Wallet not found',
        code: 'WALLET_NOT_FOUND'
      };
    }
    
    const wallet = wallets.documents[0];
    
    // Check sufficient balance
    if (wallet.balance < amount) {
      return {
        success: false,
        error: 'Insufficient balance',
        code: 'INSUFFICIENT_BALANCE',
        currentBalance: wallet.balance,
        requiredAmount: amount
      };
    }
    
    const newBalance = wallet.balance - amount;
    
    // Update wallet balance
    await databases.updateDocument(
      variables['APPWRITE_DATABASE_ID'],
      variables['APPWRITE_WALLETS_COLLECTION_ID'],
      wallet.$id,
      {
        balance: newBalance,
      }
    );
    
    // Save debit transaction
    const transactionReference = `DEBIT_${userId}_${Date.now()}`;
    await saveTransaction({
      userId,
      amount,
      type: 'debit',
      status: 'completed',
      reference: transactionReference,
      description: description || 'Wallet debit',
      balanceAfter: newBalance
    }, client, variables);
    
    return {
      success: true,
      newBalance,
      transactionReference,
      message: 'Wallet debited successfully'
    };
  } catch (error) {
    console.error('Debit wallet error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getWallet(walletData, client, variables) {
  try {
    const { userId } = walletData;
    
    const databases = new Databases(client);
    
    // Get user's wallet
    const wallets = await databases.listDocuments(
      variables['APPWRITE_DATABASE_ID'],
      variables['APPWRITE_WALLETS_COLLECTION_ID'],
      [Query.equal('userId', userId)]
    );
    
    if (wallets.documents.length === 0) {
      return {
        success: false,
        error: 'Wallet not found',
        code: 'WALLET_NOT_FOUND'
      };
    }
    
    const wallet = wallets.documents[0];
    
    return {
      success: true,
      wallet,
      balance: wallet.balance
    };
  } catch (error) {
    console.error('Get wallet error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export { MonnifyService };