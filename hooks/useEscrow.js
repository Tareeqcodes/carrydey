import { useAuth } from "./Authcontext";


export const useEscrow = () => {
  const { user } = useAuth();
  const initializeEscrowPayment = async (packageId, travelerId, amount) => {
    try {
      const response = await fetch('/api/appwrite/function', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          functionId: process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_ID,
          path: '/initialize-payment',
          data: {
            packageId,
            travelerId,
            amount,
            senderId: user?.$id, // from your auth context
            senderEmail: user?.email, // from your auth context
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to Paystack payment page
        window.location.href = result.data.authorizationUrl;
      } else {
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