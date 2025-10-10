import { useAuth } from "./Authcontext";

// Import the Appwrite SDK client here to perform the polling
// You must have the Appwrite SDK installed for this to work
import { Client, Functions } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT_ID)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const functions = new Functions(client);

// This is the corrected version of the initializeEscrowPayment function
export const useEscrow = () => {
  const { user } = useAuth();

  const initializeEscrowPayment = async (packageId, travelerId, amount) => {
    const amountInKobo = amount * 100;
    
    try {
      // 1. Initiate the asynchronous function execution via your API route
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
      console.log('Full API response:', result);
      console.log('Response status:', response.status);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to initiate payment');
      }

      const executionId = result.executionId;
      if (!executionId) {
        throw new Error('No execution ID received from the server.');
      }

      // 2. Poll for the execution status until it's completed
      const checkExecutionStatus = async () => {
        const executionResult = await functions.getExecution(
          process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_ID,
          executionId
        );
        
        // 3. Check if the execution is completed
        if (executionResult.status === 'completed') {
          // Parse the response body from the completed execution
          const finalResult = JSON.parse(executionResult.responseBody);
          
          if (finalResult.success) {
            // 4. Redirect the user to the authorization URL
            window.location.href = finalResult.authorizationUrl;
          } else {
            console.error('Error details:', finalResult);
            throw new Error(finalResult.error?.message || 'Failed to initialize payment');
          }
        } else if (executionResult.status === 'failed') {
          throw new Error('Appwrite function execution failed.');
        } else {
          // Continue polling if the status is not yet completed
          setTimeout(checkExecutionStatus, 2000); // Poll every 2 seconds
        }
      };

      // Start the polling process
      checkExecutionStatus();

    } catch (error) {
      console.error('Escrow initialization error:', error);
      throw error;
    }
  };

  const confirmDelivery = async (escrowId) => {
    // This part of the code does not need to change as it is not for payment initiation.
    // It is likely that confirmDelivery is a synchronous and fast operation.
    // ... (rest of the function remains the same)
  };

  const initiateRefund = async (escrowId, reason) => {
    // This part of the code does not need to change.
    // ... (rest of the function remains the same)
  };

  return {
    initializeEscrowPayment,
    confirmDelivery,
    initiateRefund,
  };
};