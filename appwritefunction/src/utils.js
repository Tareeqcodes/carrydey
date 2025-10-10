class Utils {
  static formatResponse(success, data = null, error = null, statusCode = 200) {
    return {
      success,
      data,
      error,
      statusCode,
      timestamp: new Date().toISOString(),
    };
  }

  static handleError(error, context = 'Unknown context') {
    console.error(`Error in ${context}:`, error);
    
    return this.formatResponse(
      false,
      null,
      {
        message: error.message || 'An unexpected error occurred',
        context,
        code: error.code || 'UNKNOWN_ERROR',
      },
      500
    );
  }

  static validateRequiredFields(fields, required) {
    const missing = required.filter(field => !fields[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
  }

  static generateReference(prefix = 'sendr') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}`.toUpperCase();
  }

  static getEscrowStatusFlow(currentStatus, action) {
    const statusFlow = {
      pending: {
        payment_success: 'funded',
        payment_failed: 'failed',
        cancel: 'cancelled',
      },
      funded: {
        confirm_delivery: 'completed',
        dispute: 'disputed',
        refund: 'refunding',
      },
      disputed: {
        resolve_traveler: 'completed',
        resolve_sender: 'refunding',
      },
      refunding: {
        refund_complete: 'refunded',
      },
    };

    return statusFlow[currentStatus]?.[action] || currentStatus;
  }
}

export default Utils;