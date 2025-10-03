'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Package, MapPin, DollarSign } from 'lucide-react';
import Script from 'next/script';
import { databases } from '@/lib/config/Appwriteconfig'; 
import { useAuth } from '@/contexts/AuthContext'; 

export default function FundDelivery() {
  const router = useRouter();
  const { contractId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to login if user is not authenticated
      router.push('/login');
      return;
    }

    const fetchContract = async () => {
      try {
        const response = await databases.getDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          'contracts',
          contractId
        );
        setContract(response);
        setLoading(false);
      } catch (err) {
        setError('Failed to load contract details');
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchContract();
    }
  }, [contractId, authLoading, user, router]);

  const initializePayment = async () => {

    setPaymentLoading(true);
    try {
      const response = await fetch('/api/paystack/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractId, userId: user.$id }),
      });
      const data = await response.json();
      if (data.success) {
        const handler = window.PaystackPop.setup({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
          email: user.email,
          amount: contract.amount,
          ref: data.reference,
          callback: async (response) => {
            const verifyResponse = await fetch('/api/paystack/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ reference: response.reference }),
            });
            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              router.push(`/contracts/${contractId}/callback?status=success`);
            } else {
              router.push(`/contracts/${contractId}/callback?status=failed`);
            }
          },
          onClose: () => {
            setPaymentLoading(false);
            router.push(`/contracts/${contractId}/callback?status=cancelled`);
          },
        });
        handler.openIframe();
      } else {
        setError(data.error || 'Failed to initiate payment');
        setPaymentLoading(false);
      }
    } catch (err) {
      setError('Payment initiation failed');
      setPaymentLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen">
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  if (error || !contract) {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen">
        <div className="px-5 py-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700">{error || 'Contract not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto bg-gray-50 min-h-screen">
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />
      <div className="bg-white">
        <div className="flex items-center pt-12 pb-6 px-5 border-b border-gray-100">
          <button onClick={() => router.back()} className="mr-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Fund Delivery</h1>
        </div>
      </div>
      <div className="px-5 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Details</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package size={14} className="text-gray-400" />
              <span>Package ID: {contract.packageId}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={14} className="text-gray-400" />
              <span>Traveler ID: {contract.travelerId}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign size={14} className="text-gray-400" />
              <span>Total Amount: ₦{(contract.amount / 100).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign size={14} className="text-gray-400" />
              <span>Platform Fee: ₦{(contract.platformFee / 100).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign size={14} className="text-gray-400" />
              <span>Traveler Amount: ₦{(contract.travelerAmount / 100).toLocaleString()}</span>
            </div>
            {contract.paystackFee && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign size={14} className="text-gray-400" />
                <span>Paystack Fee: ₦{(contract.paystackFee / 100).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Fund This Delivery</h2>
          <p className="text-sm text-gray-600 mb-4">
            Your payment will be held in escrow until the delivery is confirmed. You'll be able to request a refund if the delivery is cancelled or disputed.
          </p>
          <button
            onClick={initializePayment}
            disabled={paymentLoading || contract.status !== 'AWAITING_PAYMENT'}
            className="w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paymentLoading ? 'Processing...' : 'Pay with Paystack'}
          </button>
        </div>
      </div>
    </div>
  );
}