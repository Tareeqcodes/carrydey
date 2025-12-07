// lib/WalletService.js - UPDATED
import { Functions, Client } from 'appwrite';

// Initialize Appwrite client
const initializeClient = () => {
  // Use the correct environment variable name
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT_ID;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  
  console.log('Appwrite Config:', { endpoint, projectId }); // Debug log
  
  if (!endpoint || !projectId) {
    console.error('Missing Appwrite environment variables');
    console.error('Endpoint:', endpoint);
    console.error('Project ID:', projectId);
    return null;
  }
  
  // Make sure the endpoint URL is properly formatted
  if (!endpoint.startsWith('http')) {
    console.error('Invalid endpoint URL:', endpoint);
    return null;
  }
  
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);
    
  return client;
};

export class WalletService {
  static async callFunction(operation, data = {}) {
    try {
      const client = initializeClient();
      if (!client) {
        throw new Error('Appwrite client not initialized');
      }

      const functions = new Functions(client);
      
      // Log the function ID for debugging
      const functionId = process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_ID;
      console.log('Calling function:', { functionId, operation, data });
      
      const execution = await functions.createExecution(
        functionId,
        JSON.stringify({
          ...data,
          operation
        }),
        false,
        '/',
        'POST',
        { 
          'x-operation': operation,
          'Content-Type': 'application/json'
        }
      );
      
      if (!execution.responseBody || execution.responseBody.trim() === '') {
        throw new Error('Empty response from server');
      }
      
      const response = JSON.parse(execution.responseBody);
      console.log(`WalletService.${operation}:`, response);
      
      return response;
      
    } catch (error) {
      console.error(`WalletService.${operation} error:`, error);
      return {
        success: false,
        error: error.message,
        code: 'FUNCTION_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };
    }
  }

  // Rest of your methods remain the same...
  static async initializePayment(userId, amount, email, name) {
    return this.callFunction('initialize-payment', {
      userId,
      amount,
      email,
      name
    });
  }

  static async createWallet(userId, email, name) {
    return this.callFunction('create-wallet', {
      userId,
      email,
      name
    });
  }

  static async getWallet(userId) {
    return this.callFunction('get-wallet', { userId });
  }

  static async debitWallet(userId, amount, description = '') {
    return this.callFunction('debit-wallet', {
      userId,
      amount,
      description
    });
  }

  static async getVirtualAccount(userId) {
    return this.callFunction('get-virtual-account', { userId });
  }

  static async createPayout(userId, amount, bankCode, accountNumber, accountName) {
    return this.callFunction('create-payout', {
      userId,
      amount,
      bankCode,
      accountNumber,
      accountName
    });
  }

  static async getTransactions(userId, limit = 50) {
    return this.callFunction('get-transactions', {
      userId,
      limit
    });
  }
}