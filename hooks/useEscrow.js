import { useAuth } from "./Authcontext";

export const useEscrow = () => {
  const { user } = useAuth();

  const initializeEscrowPayment = async (packageId, travelerId, amount) => {
    const amountInKobo = amount * 100;
   
    try {
      console.log('Initializing payment with:', {
        packageId,
        travelerId,
        amount,
        amountInKobo,
        senderId: user?.$id,
        senderEmail: user?.email,
      });

      const response = await fetch('/api/appwrite/function', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          functionId: process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_ID,
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
      
      // DEBUG LOGGING - Remove after testing
      console.log('=== PAYMENT RESPONSE DEBUG ===');
      console.log('Full result:', result);
      console.log('result.success:', result.success);
      console.log('result.data:', result.data);
      console.log('result.error:', result.error);
      console.log('============================');

      if (!response.ok) {
        throw new Error(result.error?.message || result.error || 'Failed to initialize payment');
      }

      // Handle the nested data structure from Utils.formatResponse
      if (result.success && result.data) {
        const authUrl = result.data.authorizationUrl;
        
        if (authUrl) {
          console.log('Redirecting to:', authUrl);
          window.location.href = authUrl;
        } else {
          console.error('No authorization URL in response:', result);
          throw new Error('No authorization URL received from payment provider');
        }
      } else {
        const errorMessage = result.error?.message || result.error || 'Failed to initialize payment';
        console.error('Payment initialization failed:', result);
        throw new Error(errorMessage);
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
        throw new Error(result.error?.message || result.error || 'Failed to confirm delivery');
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
        throw new Error(result.error?.message || result.error || 'Failed to initiate refund');
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