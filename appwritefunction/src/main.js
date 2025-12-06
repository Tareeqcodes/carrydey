// main.js - FIXED VERSION with proper request handling
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
import { getTransactions } from './database.js';

export default async ({ req, res, log, error }) => {
  try {
    // Log incoming request for debugging
    log('Received request:');
    log(`Method: ${req.method}`);
    log(`Path: ${req.path}`);
    log(`Headers: ${JSON.stringify(req.headers)}`);
    log(`Body: ${req.body}`);

    const client = new Client();

    // Initialize Appwrite client
    client
      .setEndpoint(process.env.APPWRITE_ENDPOINT_ID || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    // Parse request body
    let body = {};
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
      log('Could not parse body, using empty object');
    }

    // Get operation from header or body
    const operation = req.headers['x-operation'] || body.operation || 'unknown';
    
    log(`Operation: ${operation}`);

    // Handle webhook from Monnify (special case)
    if (req.path.includes('/webhook') || operation === 'webhook') {
      log('Handling webhook...');
      return await handleWebhook(
        { payload: req.body, headers: req.headers, variables: process.env },
        res,
        client
      );
    }

    let result;

    switch (operation) {
      case 'initialize-payment':
        log('Initialize payment operation');
        result = await initializePayment(body, client, process.env);
        break;
      
      case 'create-wallet':
        log('Create wallet operation');
        result = await createWallet(body, client, process.env);
        break;
      
      case 'debit-wallet':
        log('Debit wallet operation');
        result = await debitWallet(body, client, process.env);
        break;
      
      case 'get-wallet':
        log('Get wallet operation');
        log(`Fetching wallet for userId: ${body.userId}`);
        result = await getWallet(body, client, process.env);
        log(`Wallet result: ${JSON.stringify(result)}`);
        break;
      
      case 'create-payout':
        log('Create payout operation');
        result = await createPayout(body, client, process.env);
        break;
      
      case 'get-virtual-account':
        log('Get virtual account operation');
        result = await getVirtualAccount(body, client, process.env);
        break;
      
      case 'get-transactions':
        log('Get transactions operation');
        const transactions = await getTransactions(
          body.userId, 
          body.limit || 50,
          client, 
          process.env
        );
        result = {
          success: true,
          transactions: transactions.documents
        };
        break;
      
      default:
        log(`Unknown operation: ${operation}`);
        return res.json({
          success: false,
          error: 'Invalid operation',
          receivedOperation: operation,
          available_operations: [
            'webhook',
            'initialize-payment',
            'create-wallet',
            'debit-wallet',
            'get-wallet',
            'create-payout',
            'get-virtual-account',
            'get-transactions'
          ]
        }, 400);
    }

    return res.json(result);
  } catch (err) {
    error('Function error:', err);
    return res.json({
      success: false,
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, 500);
  }
};