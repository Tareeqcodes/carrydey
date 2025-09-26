
import crypto from 'crypto';

export function createResponse(res, status, data) {
  return res.json(data, status);
}

export function validateWebhook(body, signature, secret) {
  const hash = crypto.createHmac('sha512', secret)
    .update(body)
    .digest('hex');
  return hash === signature;
}

export function calculatePlatformFee(amount, feePercentage = 0.05) {
  return Math.round(amount * feePercentage);
}

export function calculateTravelerAmount(amount, platformFee) {
  return amount - platformFee;
}

// Input validation function
export function validateInput(data, schema) {
  const errors = [];
  
  for (const [key, rules] of Object.entries(schema)) {
    if (rules.required && (data[key] === undefined || data[key] === null || data[key] === '')) {
      errors.push(`${key} is required`);
    }
    
    if (data[key] !== undefined && data[key] !== null && rules.type && typeof data[key] !== rules.type) {
      errors.push(`${key} must be of type ${rules.type}`);
    }
    
    if (data[key] !== undefined && data[key] !== null && rules.min !== undefined && data[key] < rules.min) {
      errors.push(`${key} must be at least ${rules.min}`);
    }
    
    if (data[key] !== undefined && data[key] !== null && rules.max !== undefined && data[key] > rules.max) {
      errors.push(`${key} must be at most ${rules.max}`);
    }
  }
  
  return errors;
}

// Email validation
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Amount validation (in kobo)
export function isValidAmount(amount) {
  return Number.isInteger(amount) && amount > 0;
}