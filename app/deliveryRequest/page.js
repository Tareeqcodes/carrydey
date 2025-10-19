'use client';
import { useState } from 'react';
import { ArrowLeft, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useSenderRequests from '@/hooks/useSenderRequests';
import { useEscrow } from '@/hooks/useEscrow';
import { useRequestActions } from '@/hooks/useRequestActions';
import { PackageGroup } from '@/components/PackageGroup';
import { PaymentModal } from '@/components/PaymentModal';

export default function SenderRequests() {
  const router = useRouter();
  const { groupedRequests, loading, error, updateStatus, totalRequests } = useSenderRequests();
  const escrowHooks = useEscrow();
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const actions = useRequestActions(updateStatus, escrowHooks);

  const handleAcceptWithPayment = (request) => {
    actions.handleAccept(request, (req) => {
      setSelectedRequest({
        ...req,
        packageId: req.packageId,
        packageReward: req.reward,
      });
      setShowPaymentModal(true);
    });
  };

  const handlePaymentConfirm = async () => {
    if (!selectedRequest) return;

    await actions.handleInitializePayment(
      selectedRequest.packageId,
      selectedRequest.travelerId,
      selectedRequest.packageReward
    );

    setShowPaymentModal(false);
    setSelectedRequest(null);
  };

  const requestActions = {
    ...actions,
    onAccept: handleAcceptWithPayment,
    onPayment: (request) => {
      setSelectedRequest({
        ...request,
        packageId: request.packageId,
        packageReward: request.reward,
      });
      setShowPaymentModal(true);
    },
  };

  if (loading) {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen">
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading delivery requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sm:max-w-md lg:max-w-lg mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white">
        <div className="flex items-center pt-12 pb-6 px-5 border-b border-gray-100">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">
              Delivery Requests
            </h1>
          </div>
        </div>
      </div>

      <div className="px-5 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {Object.entries(groupedRequests).map(
            ([packageId, { packageInfo, requests }]) => (
              <PackageGroup
                key={packageId}
                packageId={packageId}
                packageInfo={packageInfo}
                requests={requests}
                actions={requestActions}
              />
            )
          )}
        </div>

        {totalRequests === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">No requests yet</h3>
            <p className="text-sm text-gray-500">
              We'll notify you when travelers apply for your packages.
            </p>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        request={selectedRequest}
        processingId={actions.processingId}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedRequest(null);
        }}
        onConfirm={handlePaymentConfirm}
      />
    </div>
  );
}