'use client'
import { useState } from 'react';
import { functions } from '@/lib/config/Appwriteconfig';

export default function useEsrow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initializeEscrow = async (applicationData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await functions.createExecution(
        'YOUR_ESCROW_FUNCTION_ID',
        JSON.stringify({
          action: 'initialize_escrow',
          data: applicationData
        })
      );

      const result = JSON.parse(response.response);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    } catch (err) {
      console.error('Error initializing escrow:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (reference) => {
    try {
      setLoading(true);
      setError(null);

      const response = await functions.createExecution(
        'YOUR_ESCROW_FUNCTION_ID',
        JSON.stringify({
          action: 'confirm_payment',
          data: { reference }
        })
      );

      const result = JSON.parse(response.response);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    } catch (err) {
      console.error('Error confirming payment:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const releaseEscrow = async (escrowId, travelerId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await functions.createExecution(
        'YOUR_ESCROW_FUNCTION_ID',
        JSON.stringify({
          action: 'release_escrow',
          data: { escrowId, travelerId }
        })
      );

      const result = JSON.parse(response.response);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    } catch (err) {
      console.error('Error releasing escrow:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const refundEscrow = async (escrowId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await functions.createExecution(
        'YOUR_ESCROW_FUNCTION_ID',
        JSON.stringify({
          action: 'refund_escrow',
          data: { escrowId }
        })
      );

      const result = JSON.parse(response.response);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    } catch (err) {
      console.error('Error refunding escrow:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    initializeEscrow,
    confirmPayment,
    releaseEscrow,
    refundEscrow
  };
}