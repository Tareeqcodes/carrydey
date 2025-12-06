// main.js - ES Module syntax
import { Client } from 'node-appwrite';
import {
  handleWebhook,
  initializePayment,
  createWallet,
  debitWallet,
  getWallet,
  createPayout,
  getVirtualAccount
} from './monnify.js';

export default async (req, res) => {
  try {
    const client = new Client();

    // Initialize Appwrite client
    client
      .setEndpoint(req.variables['APPWRITE_ENDPOINT_ID'])
      .setProject(req.variables['APPWRITE_PROJECT_ID'])
      .setKey(req.variables['APPWRITE_API_KEY']);

    // Route based on request type
    const route = req.headers['x-operation'] || req.query.operation || 'unknown';

    switch (route) {
      case 'webhook':
        return await handleWebhook(req, res, client);
      
      case 'initialize-payment':
        const paymentData = JSON.parse(req.payload || '{}');
        return await initializePayment(paymentData, client, req.variables);
      
      case 'create-wallet':
        const userData = JSON.parse(req.payload || '{}');
        return await createWallet(userData, client, req.variables);
      
      case 'debit-wallet':
        const debitData = JSON.parse(req.payload || '{}');
        return await debitWallet(debitData, client, req.variables);
      
      case 'get-wallet':
        const walletData = JSON.parse(req.payload || '{}');
        return await getWallet(walletData, client, req.variables);
      
      case 'create-payout':
        const payoutData = JSON.parse(req.payload || '{}');
        return await createPayout(payoutData, client, req.variables);
      
      case 'get-virtual-account':
        const accountData = JSON.parse(req.payload || '{}');
        return await getVirtualAccount(accountData, client, req.variables);
      
      default:
        return res.json({
          success: false,
          error: 'Invalid operation',
          available_operations: [
            'webhook',
            'initialize-payment',
            'create-wallet',
            'debit-wallet',
            'get-wallet',
            'create-payout',
            'get-virtual-account'
          ]
        }, 400);
    }
  } catch (error) {
    console.error('Function error:', error);
    return res.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, 500);
  }
};