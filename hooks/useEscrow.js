
import { useAuth } from "./Authcontext";

export const useEscrow = () => {
  const { user } = useAuth();

  const initializeEscrowPayment = async (packageId, travelerId, amount) => {
    const amountInKobo = amount * 100;
    
    try {
      const response = await fetch('/api/appwrite/function', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          functionId: process.env.APPWRITE_FUNCTION_ID,
          path: '/initialize-payment',
          method: 'POST',
          data: {
            packageId,
            travelerId,
            amount: amountInKobo,
            senderId: user?.$id,
            senderEmail: user?.email,
          },
        }),
      });

      const result = await response.json();
      console.log('Full API response:', result);
    console.log('Response status:', response.status);

      if (result.success) {
        window.location.href = result.data.authorizationUrl;
      } else {
        console.error('Error details:', result);
        throw new Error(result.error?.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Escrow initialization error:', error);
      throw error;
    }
  };

  const confirmDelivery = async (escrowId) => {
    try {
      const response = await fetch('/api/appwrite/function', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          functionId: process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_ID,
          path: '/confirm-delivery',
          method: 'POST',
          data: { escrowId },
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to confirm delivery');
      }

      return result;
    } catch (error) {
      console.error('Confirm delivery error:', error);
      throw error;
    }
  };

  const initiateRefund = async (escrowId, reason) => {
    try {
      const response = await fetch('/api/appwrite/function', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          functionId: process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_ID,
          path: '/initiate-refund',
          method: 'POST',
          data: { escrowId, reason },
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to initiate refund');
      }

      return result;
    } catch (error) {
      console.error('Refund initiation error:', error);
      throw error;
    }
  };

  return {
    initializeEscrowPayment,
    confirmDelivery,
    initiateRefund,
  };
};