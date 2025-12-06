// lib/WalletService.js - FIXED with better error handling
import { Functions, Client } from 'appwrite';

// Initialize Appwrite client
const initializeClient = () => {
  if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 
      !process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
    console.error('Missing Appwrite environment variables');
    return null;
  }
  
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
    
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
      
      const execution = await functions.createExecution(
        process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_ID,
        JSON.stringify({
          ...data,
          operation // Include operation in body as fallback
        }),
        false,
        '/',
        'POST',
        { 
          'x-operation': operation,
          'Content-Type': 'application/json'
        }
      );
      
      // Check if response is empty
      if (!execution.responseBody || execution.responseBody.trim() === '') {
        throw new Error('Empty response from server');
      }
      
      // Parse response
      const response = JSON.parse(execution.responseBody);
      
      // Log for debugging
      console.log(`WalletService.${operation}:`, response);
      
      return response;
      
    } catch (error) {
      console.error(`WalletService.${operation} error:`, error);
      
      // Return a structured error response
      return {
        success: false,
        error: error.message,
        code: 'FUNCTION_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };
    }
  }

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