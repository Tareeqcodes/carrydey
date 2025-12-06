// lib/walletService.js
import { Functions, Client } from 'appwrite';

const appwriteClient = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT_ID)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const functions = new Functions(appwriteClient);
 
export class WalletService {
  static async initializePayment(userId, amount, email, name) {
    try {
      const execution = await functions.createExecution(
        process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_ID,
        JSON.stringify({
          userId,
          amount,
          email,
          name
        }),
        false,
        '/',
        'POST',
        { 'x-operation': 'initialize-payment' }
      );
      
      return JSON.parse(execution.responseBody);
    } catch (error) {
      console.error('Initialize payment error:', error);
      throw error;
    }
  }

  static async createWallet(userId, email, name) {
    try {
      const execution = await functions.createExecution(
        process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_ID,
        JSON.stringify({ userId, email, name }),
        false,
        '/',
        'POST',
        { 'x-operation': 'create-wallet' }
      );
      
      return JSON.parse(execution.responseBody);
    } catch (error) {
      console.error('Create wallet error:', error);
      throw error;
    }
  }

  static async getWallet(userId) {
    try {
      const execution = await functions.createExecution(
        process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_ID,
        JSON.stringify({ userId }),
        false,
        '/',
        'POST',
        { 'x-operation': 'get-wallet' }
      );
      
      return JSON.parse(execution.responseBody);
    } catch (error) {
      console.error('Get wallet error:', error);
      throw error;
    }
  }

  static async debitWallet(userId, amount, description = '') {
    try {
      const execution = await functions.createExecution(
        process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_ID,
        JSON.stringify({ userId, amount, description }),
        false,
        '/',
        'POST',
        { 'x-operation': 'debit-wallet' }
      );
      
      return JSON.parse(execution.responseBody);
    } catch (error) {
      console.error('Debit wallet error:', error);
      throw error;
    }
  }

  static async getVirtualAccount(userId) {
    try {
      const execution = await functions.createExecution(
        process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_ID,
        JSON.stringify({ userId }),
        false,
        '/',
        'POST',
        { 'x-operation': 'get-virtual-account' }
      );
      
      return JSON.parse(execution.responseBody);
    } catch (error) {
      console.error('Get virtual account error:', error);
      throw error;
    }
  }

  static async createPayout(userId, amount, bankCode, accountNumber, accountName) {
    try {
      const execution = await functions.createExecution(
        process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_ID,
        JSON.stringify({ userId, amount, bankCode, accountNumber, accountName }),
        false,
        '/',
        'POST',
        { 'x-operation': 'create-payout' }
      );
      
      return JSON.parse(execution.responseBody);
    } catch (error) {
      console.error('Create payout error:', error);
      throw error;
    }
  }
}