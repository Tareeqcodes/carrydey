import fetch from 'node-fetch';
import crypto from 'crypto'; 

class PaystackService {
  constructor(secretKey) {
    this.secretKey = secretKey; 
    this.baseURL = 'https://api.paystack.co';
  }

  async initializeTransaction(email, amount, metadata = {}) {
    try {
      const response = await fetch(`${this.baseURL}/transaction/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.secretKey}`, 
        },
        body: JSON.stringify({
          email,
          amount: amount,
          metadata,
          callback_url: `${process.env.APP_URL}/payment/verify`,
        }),
      });

      const data = await response.json();

      if (!data.status) {
        throw new Error(data.message || 'Failed to initialize transaction');
      }

      return {
        success: true,
        authorizationUrl: data.data.authorization_url,
        reference: data.data.reference,
        accessCode: data.data.access_code,
      };
    } catch (error) {
      console.error('Paystack initialization error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async verifyTransaction(reference) {
    try {
      const response = await fetch(`${this.baseURL}/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!data.status) {
        throw new Error(data.message || 'Failed to verify transaction');
      }

      const transaction = data.data;

      return {
        success: true,
        verified: transaction.status === 'success',
        transaction: {
          id: transaction.id,
          reference: transaction.reference,
          amount: transaction.amount,
          currency: transaction.currency,
          paidAt: transaction.paid_at,
          channel: transaction.channel,
          metadata: transaction.metadata,
        },
      };
    } catch (error) {
      console.error('Paystack verification error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async transferToTraveler(recipientCode, amount, reference) {
    try {
      const response = await fetch(`${this.baseURL}/transfer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'balance',
          reason: 'Package delivery payment',
          amount: amount,
          recipient: recipientCode,
          reference: `sendr_${reference}_${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (!data.status) {
        throw new Error(data.message || 'Failed to process transfer');
      }

      return {
        success: true,
        transferCode: data.data.transfer_code,
        reference: data.data.reference,
        status: data.data.status,
      };
    } catch (error) {
      console.error('Paystack transfer error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async createTransferRecipient(accountNumber, bankCode, accountName) {
    try {
      const response = await fetch(`${this.baseURL}/transferrecipient`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'nuban',
          name: accountName,
          account_number: accountNumber,
          bank_code: bankCode,
          currency: 'NGN',
        }),
      });

      const data = await response.json();

      if (!data.status) {
        throw new Error(data.message || 'Failed to create transfer recipient');
      }

      return {
        success: true,
        recipientCode: data.data.recipient_code,
      };
    } catch (error) {
      console.error('Paystack recipient creation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

   verifyWebhookSignature(requestBody, signature) {
    const hash = crypto
      .createHmac('sha512', this.secretKey)
      .update(JSON.stringify(requestBody))
      .digest('hex');
    return hash === signature;
  }
}

export default PaystackService;