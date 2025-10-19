'use client';
import { useState } from 'react';

export const useRequestActions = (updateStatus, escrowHooks) => {
  const [processingId, setProcessingId] = useState(null);
  const [escrowStatus, setEscrowStatus] = useState({});

  const handleAccept = async (request, onSuccess) => {
    setProcessingId(request.applicationId);
    try {
      const result = await updateStatus(request.applicationId, 'Awaiting pickup');
      if (result.success && onSuccess) {
        onSuccess(request);
      }
      return result;
    } catch (err) {
      console.error('Error accepting request:', err);
      throw err;
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (applicationId) => {
    setProcessingId(applicationId);
    try {
      const result = await updateStatus(applicationId, 'declined');
      return result;
    } catch (err) {
      console.error('Error declining request:', err);
      throw err;
    } finally {
      setProcessingId(null);
    }
  };

  const handleInitializePayment = async (packageId, travelerId, amount) => {
    setProcessingId(`payment_${packageId}`);
    try {
      await escrowHooks.initializeEscrowPayment(packageId, travelerId, amount);
    } catch (err) {
      console.error('Error initializing payment:', err);
      throw err;
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmDelivery = async (escrowId) => {
    setProcessingId(escrowId);
    try {
      await escrowHooks.confirmDelivery(escrowId);
      setEscrowStatus(prev => ({ ...prev, [escrowId]: 'completed' }));
    } catch (error) {
      console.error('Error confirming delivery:', error);
      throw error;
    } finally {
      setProcessingId(null);
    }
  };

  const handleRefund = async (escrowId, reason) => {
    setProcessingId(escrowId);
    try {
      await escrowHooks.initiateRefund(escrowId, reason);
      setEscrowStatus(prev => ({ ...prev, [escrowId]: 'refunding' }));
    } catch (error) {
      console.error('Error initiating refund:', error);
      throw error;
    } finally {
      setProcessingId(null);
    }
  };

  return {
    processingId,
    escrowStatus,
    handleAccept,
    handleDecline,
    handleInitializePayment,
    handleConfirmDelivery,
    handleRefund,
  };
};