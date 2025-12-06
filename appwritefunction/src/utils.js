// utils.js - ES Module syntax
export function generateTransactionReference(userId) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TRX_${userId}_${timestamp}_${random}`;
}

export function validatePaymentData(data) {
  const requiredFields = ['userId', 'amount', 'email', 'name'];
  const missingFields = [];
  
  requiredFields.forEach(field => {
    if (!data[field]) {
      missingFields.push(field);
    }
  });
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  if (data.amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
  
  return true;
}

export function createResponse(success, data, error = null, statusCode = 200) {
  const response = {
    success,
    timestamp: new Date().toISOString()
  };
  
  if (success) {
    response.data = data;
  } else {
    response.error = error;
  }
  
  return response;
}

export function formatCurrency(amount, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

export function maskEmail(email) {
  if (!email) return '';
  const [username, domain] = email.split('@');
  const maskedUsername = username.length > 2 
    ? username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
    : username;
  return `${maskedUsername}@${domain}`;
}