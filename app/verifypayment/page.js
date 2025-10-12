'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import {  CheckCircle, XCircle } from 'lucide-react';

export default function PaymentCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  useEffect(() => {
    if (status === 'success') {
      setTimeout(() => router.push('/sender/requests'), 3000);
    }
  }, [status, router]);

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen">
      <div className="px-5 py-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          {status === 'success' ? (
            <>
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful</h2>
              <p className="text-sm text-gray-600 mb-4">Your payment has been received and is held in escrow. You'll be redirected to your requests shortly.</p>
            </>
          ) : status === 'failed' ? (
            <>
              <XCircle size={48} className="text-red-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Payment Failed</h2>
              <p className="text-sm text-gray-600 mb-4">There was an issue with your payment. Please try again.</p>
            </>
          ) : (
            <>
              <XCircle size={48} className="text-yellow-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Payment Cancelled</h2>
              <p className="text-sm text-gray-600 mb-4">You cancelled the payment. You can try again from your requests.</p>
            </>
          )}
          <button
            onClick={() => router.push('/deliveryRequest')}
            className="w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Requests
          </button>
        </div>
      </div>
    </div>
  );
}