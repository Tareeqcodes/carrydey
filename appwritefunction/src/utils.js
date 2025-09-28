import crypto from 'crypto';

export function createResponse(res, status, data) {
  return res.json(data, status);
}

export function validateWebhook(body, signature, secret) {
  const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
  return hash === signature;
}

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
  }
  return errors;
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidAmount(amount) {
  return Number.isInteger(amount) && amount > 0;
}

export class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < this.timeWindow);
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    return false;
  }

  getWaitTime() {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < this.timeWindow);
    if (this.requests.length < this.maxRequests) {
      return 0;
    }
    return this.timeWindow - (now - this.requests[0]);
  }
}