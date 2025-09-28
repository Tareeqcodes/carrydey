import fetch from 'node-fetch';
import { RateLimiter } from './utils.js';

export class PaystackService {
  constructor(secretKey) {
    this.secretKey = secretKey;
    this.baseURL = 'https://api.paystack.co';
    this.rateLimiter = new RateLimiter(100, 60000); // 100 requests per minute
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    if (!this.rateLimiter.canMakeRequest()) {
      throw new Error(`Rate limit exceeded. Try again in ${this.rateLimiter.getWaitTime()}ms`);
    }

    const url = `${this.baseURL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || `Paystack API error: ${response.status}`);
      }
      return result;
    } catch (error) {
      throw new Error(`Paystack API request failed: ${error.message}`);
    }
  }

  async initializeTransaction(data) {
    return await this.makeRequest('/transaction/initialize', 'POST', data);
  }

  async verifyTransaction(reference) {
    return await this.makeRequest(`/transaction/verify/${reference}`);
  }

  async createTransferRecipient(data) {
    return await this.makeRequest('/transferrecipient', 'POST', data);
  }

  async initiateTransfer(data) {
    return await this.makeRequest('/transfer', 'POST', data);
  }

  async refundTransaction(data) {
    return await this.makeRequest('/refund', 'POST', data);
  }

  async checkBalance() {
    return await this.makeRequest('/balance');
  }

  async verifyAccount(accountNumber, bankCode) {
    const params = new URLSearchParams({ account_number: accountNumber, bank_code: bankCode });
    return await this.makeRequest(`/bank/resolve?${params}`);
  }
}