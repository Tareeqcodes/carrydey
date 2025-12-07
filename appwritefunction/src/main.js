// main.js - PROPERLY FIXED
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
import { getTransactions } from './databases.js';

export default async ({ req, res, log, error }) => {
  try {
    log('=== WALLET FUNCTION STARTED ===');
    
    // IMPORTANT: Appwrite functions use context object, not req/res directly
    const client = new Client();

    // Initialize Appwrite client
    if (!process.env.APPWRITE_ENDPOINT || !process.env.APPWRITE_PROJECT_ID || !process.env.APPWRITE_API_KEY) {
      error('Missing Appwrite environment variables');
      return res.json({
        success: false,
        error: 'Server configuration error'
      }, 500);
    }

    client
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    // Parse request body
    let body = {};
    let operation = 'unknown';
    
    try {
      // Appwrite functions receive payload in req.body
      if (req.body) {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        log('Parsed body:', JSON.stringify(body));
      }
      
      // Get operation from header first, then body
      operation = req.headers['x-operation'] || body.operation || 'unknown';
      
    } catch (parseError) {
      log('Parse error, using empty body');
    }

    log(`Operation requested: ${operation}`);

    // Special handling for Monnify webhook (POST with JSON)
    const isMonnifyWebhook = req.headers['monnify-signature'] || 
                            (req.path && req.path.includes('webhook'));
    
    if (isMonnifyWebhook) {
      log('Processing Monnify webhook...');
      return await handleWebhook(
        { 
          payload: req.body, 
          headers: req.headers, 
          variables: process.env 
        },
        res,
        client
      );
    }

    // Handle different operations
    let result;
    
    switch (operation) {
      case 'initialize-payment':
        log('Initialize payment with data:', body);
        result = await initializePayment(body, client, process.env);
        break;
      
      case 'create-wallet':
        log('Creating wallet with data:', body);
        result = await createWallet(body, client, process.env);
        break;
      
      case 'debit-wallet':
        log('Debiting wallet with data:', body);
        result = await debitWallet(body, client, process.env);
        break;
      
      case 'get-wallet':
        log('Getting wallet for userId:', body.userId);
        if (!body.userId) {
          result = {
            success: false,
            error: 'userId is required'
          };
        } else {
          result = await getWallet(body, client, process.env);
        }
        break;
      
      case 'get-virtual-account':
        log('Getting virtual account for userId:', body.userId);
        if (!body.userId) {
          result = {
            success: false,
            error: 'userId is required'
          };
        } else {
          result = await getVirtualAccount(body, client, process.env);
        }
        break;
      
      case 'create-payout':
        log('Creating payout with data:', body);
        result = await createPayout(body, client, process.env);
        break;
      
      case 'get-transactions':
        log('Getting transactions for userId:', body.userId);
        const transactions = await getTransactions(
          body.userId, 
          body.limit || 50,
          client, 
          process.env
        );
        result = {
          success: true,
          transactions: transactions.documents || []
        };
        break;
      
      default:
        log(`Unknown operation: ${operation}`);
        result = {
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
        };
    }

    log('Operation result:', JSON.stringify(result));
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