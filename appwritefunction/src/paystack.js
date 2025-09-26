// paystack.js - Paystack API Service
export class PaystackService {
  constructor(secretKey) {
    this.secretKey = secretKey;
    this.baseURL = 'https://api.paystack.co';
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
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
      console.error('Paystack API request failed:', error);
      throw new Error(`Paystack API request failed: ${error.message}`);
    }
  }

  // Initialize a transaction
  async initializeTransaction(data) {
    return await this.makeRequest('/transaction/initialize', 'POST', data);
  }

  // Verify a transaction
  async verifyTransaction(reference) {
    return await this.makeRequest(`/transaction/verify/${reference}`);
  }

  // Create transfer recipient
  async createTransferRecipient(data) {
    return await this.makeRequest('/transferrecipient', 'POST', data);
  }

  // Initiate transfer
  async initiateTransfer(data) {
    return await this.makeRequest('/transfer', 'POST', data);
  }

  // Refund transaction
  async refundTransaction(data) {
    return await this.makeRequest('/refund', 'POST', data);
  }

  // Check balance
  async checkBalance() {
    return await this.makeRequest('/balance');
  }

  // List transfers
  async listTransfers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/transfer?${queryString}` : '/transfer';
    return await this.makeRequest(endpoint);
  }

  // Verify transfer recipient
  async verifyTransferRecipient(recipientCode) {
    return await this.makeRequest(`/transferrecipient/${recipientCode}`);
  }

  // Resend OTP for transfer
  async resendTransferOTP(transferCode) {
    return await this.makeRequest('/transfer/resend_otp', 'POST', {
      transfer_code: transferCode
    });
  }

  // Disable OTP requirement (for automated transfers)
  async disableOTP() {
    return await this.makeRequest('/transfer/disable_otp', 'POST');
  }

  // Finalize transfer with OTP
  async finalizeTransfer(transferCode, otp) {
    return await this.makeRequest('/transfer/finalize_transfer', 'POST', {
      transfer_code: transferCode,
      otp: otp
    });
  }

  // Bulk transfers
  async bulkTransfers(transfers) {
    return await this.makeRequest('/transfer/bulk', 'POST', {
      transfers: transfers
    });
  }

  // Verify bank account
  async verifyAccount(accountNumber, bankCode) {
    return await this.makeRequest('/bank/resolve', 'GET', null, {
      account_number: accountNumber,
      bank_code: bankCode
    });
  }

  // List banks
  async listBanks(country = 'nigeria') {
    const params = country ? `?country=${country}` : '';
    return await this.makeRequest(`/bank${params}`);
  }

  // Create subscription
  async createSubscription(data) {
    return await this.makeRequest('/subscription', 'POST', data);
  }

  // Transaction timeline
  async getTransactionTimeline(id) {
    return await this.makeRequest(`/transaction/timeline/${id}`);
  }

  // Transaction totals
  async getTransactionTotals(from = null, to = null) {
    let endpoint = '/transaction/totals';
    if (from || to) {
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      endpoint += `?${params.toString()}`;
    }
    return await this.makeRequest(endpoint);
  }

  // Export transactions
  async exportTransactions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/transaction/export?${queryString}` : '/transaction/export';
    return await this.makeRequest(endpoint);
  }

  // Partial refund
  async partialRefund(transactionReference, amount, currency = 'NGN') {
    return await this.makeRequest('/refund', 'POST', {
      transaction: transactionReference,
      amount: amount,
      currency: currency
    });
  }

  // Check refund status
  async getRefund(refundId) {
    return await this.makeRequest(`/refund/${refundId}`);
  }

  // List refunds
  async listRefunds(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/refund?${queryString}` : '/refund';
    return await this.makeRequest(endpoint);
  }
}

// Utility function for currency conversion
export function formatAmount(amount, currency = 'NGN') {
  if (currency === 'NGN') {
    return Math.round(amount * 100); // Convert to kobo
  }
  return amount;
}

// Utility function to format response data
export function formatPaystackResponse(response) {
  if (response.status && response.data) {
    return {
      success: response.status,
      data: response.data,
      message: response.message
    };
  }
  return response;
}

// Error handling utility
export class PaystackError extends Error {
  constructor(message, code = null, details = null) {
    super(message);
    this.name = 'PaystackError';
    this.code = code;
    this.details = details;
  }
}

// Rate limiting helper
export class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    return false;
  }

  getWaitTime() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    if (this.requests.length < this.maxRequests) {
      return 0;
    }
    
    const oldestRequest = this.requests[0];
    return this.timeWindow - (now - oldestRequest);
  }
}