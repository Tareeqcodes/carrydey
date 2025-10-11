'use client'
import React, { useState } from 'react';
import useSenderRequests from '@/hooks/useSenderRequests';

export default function PaymentModal({ request, onClose }) {
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const { confirmPayment } = useSenderRequests();

  const handlePaymentSuccess = async () => {
    setPaymentStatus('processing');
    
    try {
      const result = await confirmPayment(request.paymentUrl);
      if (result.success) {
        setPaymentStatus('success');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      setPaymentStatus('failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Complete Payment</h2>
        
        {paymentStatus === 'pending' && (
          <>
            <p className="text-gray-600 mb-4">
              You're about to pay <strong>₦{request.reward?.toLocaleString()}</strong> for the delivery of "{request.packageTitle}".
            </p>
            <p className="text-gray-600 mb-6">
              This amount will be held in escrow and released to the traveler after successful delivery.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => window.open(request.paymentUrl, '_blank')}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Open Payment Page
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                After completing payment on the Paystack page, come back here and click "I've Paid".
              </p>
            </div>
            
            <button
              onClick={handlePaymentSuccess}
              className="w-full mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              I've Completed Payment
            </button>
          </>
        )}

        {paymentStatus === 'processing' && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Verifying your payment...</p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-green-600 font-semibold">Payment Successful!</p>
            <p className="text-gray-600 mt-2">The funds are now held in escrow.</p>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <p className="text-red-600 font-semibold">Payment Failed</p>
            <p className="text-gray-600 mt-2">Please try again or contact support.</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}