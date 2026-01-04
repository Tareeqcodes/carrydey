// main.js - FINAL CORRECTED VERSION
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
    log('=== WALLET FUNCTION STARTED ===');
    log('Method:', req.method);
    log('Headers:', JSON.stringify(req.headers, null, 2));
    log('Raw body type:', typeof req.body);
    
    const client = new Client();

    // Use consistent environment variable names
    const endpoint = process.env.APPWRITE_ENDPOINT || process.env.APPWRITE_FUNCTION_API_ENDPOINT;
    const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY;
    
    log('Appwrite config:', { 
      endpoint: endpoint ? '✓' : '✗',
      projectId: projectId ? '✓' : '✗',
      apiKey: apiKey ? '✓' : '✗'
    });
    
    // Validate Monnify config
    const monnifyConfig = {
      apiKey: process.env.MONNIFY_API_KEY,
      secretKey: process.env.MONNIFY_SECRET_KEY,
      contractCode: process.env.MONNIFY_CONTRACT_CODE
    };
    
    log('Monnify config:', {
      apiKey: monnifyConfig.apiKey ? '✓' : '✗',
      secretKey: monnifyConfig.secretKey ? '✓' : '✗',
      contractCode: monnifyConfig.contractCode ? '✓' : '✗'
    });
    
    if (!endpoint || !projectId || !apiKey) {
      error('Missing Appwrite configuration');
      return res.json({
        success: false,
        error: 'Server configuration error - Appwrite credentials missing'
      }, 500);
    }

    client
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey);

    // Parse request body - READ FROM BODY ONLY (more reliable)
    let body = {};
    let operation = 'unknown';
    
    try {
      if (req.body) {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        log('Parsed body:', JSON.stringify(body, null, 2));
        
        // Get operation from body (not headers)
        operation = body.operation || 'unknown';
      } else {
        log('No body received');
      }
    } catch (parseError) {
      error('Body parse error:', parseError.message);
      return res.json({
        success: false,
        error: 'Invalid request body - must be valid JSON'
      }, 400);
    }

    log(`Operation: ${operation}`);

    // Check for Monnify webhook
    const isMonnifyWebhook = req.headers['monnify-signature'] || 
                            (req.path && req.path.includes('webhook'));
    
    if (isMonnifyWebhook) {
      log('Processing Monnify webhook');
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

    // Route operations
    let result;
    
    switch (operation) {
      case 'initialize-payment':
        log('Initialize payment:', body);
        if (!body.userId || !body.amount || !body.email || !body.name) {
          result = {
            success: false,
            error: 'Missing required fields: userId, amount, email, name'
          };
        } else {
          result = await initializePayment(body, client, process.env);
        }
        break;
      
      case 'create-wallet':
        log('Create wallet:', body); 
        if (!body.userId || !body.email || !body.name) {
          result = {
            success: false,
            error: 'Missing required fields: userId, email, name'
          };
        } else {
          result = await createWallet(body, client, process.env);
        }
        break;
      
      case 'debit-wallet':
        log('Debit wallet:', body);
        if (!body.userId || !body.amount) {
          result = {
            success: false,
            error: 'Missing required fields: userId, amount'
          };
        } else {
          result = await debitWallet(body, client, process.env);
        }
        break; 
      
      case 'get-wallet':
        log('Get wallet for userId:', body.userId);
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
        log('Get virtual account:', body);
        if (!body.userId || !body.name || !body.email) {
          result = {
            success: false,
            error: 'Missing required fields: userId, name, email'
          };
        } else {
          result = await getVirtualAccount(body, client, process.env);
        }
        break;
      
      case 'create-payout':
        log('Create payout:', body);
        if (!body.userId || !body.amount || !body.bankCode || 
            !body.accountNumber || !body.accountName) {
          result = {
            success: false,
            error: 'Missing required fields: userId, amount, bankCode, accountNumber, accountName'
          };
        } else {
          result = await createPayout(body, client, process.env);
        }
        break;
      
      case 'get-transactions':
        log('Get transactions for userId:', body.userId);
        if (!body.userId) {
          result = {
            success: false,
            error: 'userId is required'
          };
        } else {
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
        }
        break;
      
      default:
        log(`Unknown operation: ${operation}`);
        result = {
          success: false,
          error: 'Invalid operation',
          receivedOperation: operation,
          receivedBody: body,
          availableOperations: [
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

    log('Operation result:', JSON.stringify(result, null, 2));
    return res.json(result);
    
  } catch (err) {
    error('Function error:', err.message);
    error('Stack:', err.stack);
    return res.json({
      success: false,
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, 500);
  }
};