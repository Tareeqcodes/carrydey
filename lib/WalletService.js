
import { Client, Functions } from 'appwrite';

export class WalletService {
  static async callFunction(operation, data = {}) {
    try {
      // Standard environment variable names (no _ID suffix)
      const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
      const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
      const functionId = process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_ID;
      
      // Validate configuration
      if (!endpoint || !projectId || !functionId) {
        console.error('Missing Appwrite configuration:', {
          endpoint: !!endpoint,
          projectId: !!projectId,
          functionId: !!functionId
        });
        throw new Error('Appwrite client not properly configured');
      }
      
      if (!endpoint.startsWith('http')) {
        throw new Error('Invalid endpoint URL format');
      }
      
      // Initialize client WITHOUT API key (uses user session)
      // IMPORTANT: Never expose API keys in frontend code
      const client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId);
      
      const functions = new Functions(client);
      
      // Send operation in body (more reliable than headers)
      const payload = {
        operation: operation,
        ...data
      };
      
      console.log('Calling function:', {
        functionId,
        operation,
        payload
      });
      
      // Execute function
      const execution = await functions.createExecution(
        functionId,
        JSON.stringify(payload),
        false, // async = false (wait for response)
        '/',
        'POST'
      );
      
      // Check execution status
      if (execution.status !== 'completed') {
        throw new Error(`Function execution failed with status: ${execution.status}`);
      }
      
      if (!execution.responseBody || execution.responseBody.trim() === '') {
        throw new Error('Empty response from function');
      }
      
      // Parse response
      const response = JSON.parse(execution.responseBody);
      console.log(`WalletService.${operation} response:`, response);
      
      return response;
      
    } catch (error) {
      console.error(`WalletService.${operation} error:`, error);
      
      // Return structured error
      return {
        success: false,
        error: error.message,
        code: 'FUNCTION_ERROR',
        details: process.env.NODE_ENV === 'development' ? {
          stack: error.stack,
          name: error.name
        } : undefined
      };
    }
  }

  static async initializePayment(userId, amount, email, name) {
    if (!userId || !amount || !email || !name) {
      return {
        success: false,
        error: 'Missing required parameters',
        code: 'INVALID_PARAMS'
      };
    }
    
    return this.callFunction('initialize-payment', {
      userId,
      amount: parseFloat(amount),
      email,
      name
    });
  }

  static async createWallet(userId, email, name) {
    if (!userId || !email || !name) {
      return {
        success: false,
        error: 'Missing required parameters',
        code: 'INVALID_PARAMS'
      };
    }
    
    return this.callFunction('create-wallet', {
      userId,
      email,
      name
    });
  }

  static async getWallet(userId) {
    if (!userId) {
      return {
        success: false,
        error: 'userId is required',
        code: 'INVALID_PARAMS'
      };
    }
    
    return this.callFunction('get-wallet', { userId });
  }

  static async debitWallet(userId, amount, description = '') {
    if (!userId || !amount) {
      return {
        success: false,
        error: 'Missing required parameters',
        code: 'INVALID_PARAMS'
      };
    }
    
    return this.callFunction('debit-wallet', {
      userId,
      amount: parseFloat(amount),
      description
    });
  }

  static async getVirtualAccount(userId, name, email) {
    if (!userId || !name || !email) {
      return {
        success: false,
        error: 'Missing required parameters',
        code: 'INVALID_PARAMS'
      };
    }
    
    return this.callFunction('get-virtual-account', { 
      userId,
      name,
      email
    });
  }

  static async createPayout(userId, amount, bankCode, accountNumber, accountName) {
    if (!userId || !amount || !bankCode || !accountNumber || !accountName) {
      return {
        success: false,
        error: 'Missing required parameters',
        code: 'INVALID_PARAMS'
      };
    }
    
    return this.callFunction('create-payout', {
      userId,
      amount: parseFloat(amount),
      bankCode,
      accountNumber,
      accountName
    });
  }

  static async getTransactions(userId, limit = 50) {
    if (!userId) {
      return {
        success: false,
        error: 'userId is required',
        code: 'INVALID_PARAMS'
      };
    }
    
    return this.callFunction('get-transactions', {
      userId,
      limit: parseInt(limit)
    });
  }
}