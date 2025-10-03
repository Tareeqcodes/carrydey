'use client';
import { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Shield,
  Package,
  MapPin,
  Clock,
  CreditCard,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import useRequest from '@/hooks/useRequest';
import { useEscrow } from '@/hooks/useEscrow';

export default function SenderRequests() {
  const router = useRouter();
  const {
    groupedRequests,
    loading,
    error,
    updateStatus,
    totalRequests,
    pendingCount,
    acceptedCount,
  } = useRequest();

  const [processingId, setProcessingId] = useState(null);
  const [escrowStatus, setEscrowStatus] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const { initializeEscrowPayment, confirmDelivery, initiateRefund } =
    useEscrow();

  // Step 1: Accept the traveler request
  const handleAccept = async (request) => {
    setProcessingId(request.applicationId);

    try {
      // First update the status to accepted in database
      const result = await updateStatus(request.applicationId, 'accepted');

      if (result.success) {
        console.log('Request accepted successfully');

        // Store the request data and show payment modal
        setSelectedRequest({
          ...request,
          packageId: request.packageId, // Make sure this exists in your request object
          packageReward: request.reward, // The amount to pay
        });
        setShowPaymentModal(true);
      } else {
        console.error('Failed to accept request:', result.error);
      }
    } catch (err) {
      console.error('Error accepting request:', err);
    } finally {
      setProcessingId(null);
    }
  };

  // Step 2: Initialize payment after acceptance
  const handleInitializePayment = async () => {
    if (!selectedRequest) return;

    setProcessingId('payment_' + selectedRequest.applicationId);

    try {
      // Initialize escrow payment
      await initializeEscrowPayment(
        selectedRequest.packageId,
        selectedRequest.travelerId,
        selectedRequest.packageReward
      );

      // Close modal after successful initialization (user will be redirected to Paystack)
      setShowPaymentModal(false);
      setSelectedRequest(null);
    } catch (err) {
      console.error('Error initializing payment:', err);
    } finally {
      setProcessingId(null);
    }
  };

  // Step 3: Confirm delivery and release payment (shown when escrow is funded)
  const handleConfirmDelivery = async (escrowId) => {
    try {
      setProcessingId(escrowId);
      await confirmDelivery(escrowId);
      // Update UI state
      setEscrowStatus((prev) => ({ ...prev, [escrowId]: 'completed' }));
    } catch (error) {
      console.error('Error confirming delivery:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRefund = async (escrowId, reason) => {
    try {
      setProcessingId(escrowId);
      await initiateRefund(escrowId, reason);
      // Update UI state
      setEscrowStatus((prev) => ({ ...prev, [escrowId]: 'refunding' }));
    } catch (error) {
      console.error('Error initiating refund:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (applicationId) => {
    setProcessingId(applicationId);

    try {
      const result = await updateStatus(applicationId, 'declined');

      if (result.success) {
        console.log('Request declined successfully');
      } else {
        console.error('Failed to decline request:', result.error);
      }
    } catch (err) {
      console.error('Error declining request:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const getInitials = (name) => {
    if (!name || name === 'Unknown Traveler') return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-700 font-medium">Accepted</span>
          </div>
        );
      case 'declined':
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-xs text-gray-500 font-medium">Declined</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 rounded-lg">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span className="text-xs text-orange-700 font-medium">Pending</span>
          </div>
        );
    }
  };

  const getEscrowBadge = (request) => {
    // Check if we have escrow status for this request
    const currentEscrowStatus =
      escrowStatus[request.escrowId] || request.escrowStatus;

    if (!currentEscrowStatus) return null;

    const statusConfig = {
      pending: {
        color: 'bg-orange-50 text-orange-700',
        label: 'Payment Pending',
      },
      funded: { color: 'bg-blue-50 text-blue-700', label: 'Funds in Escrow' },
      completed: {
        color: 'bg-green-50 text-green-700',
        label: 'Payment Released',
      },
      refunding: { color: 'bg-yellow-50 text-yellow-700', label: 'Refunding' },
      refunded: { color: 'bg-gray-50 text-gray-700', label: 'Refunded' },
      disputed: { color: 'bg-red-50 text-red-700', label: 'Disputed' },
    };

    const config = statusConfig[currentEscrowStatus] || statusConfig.pending;

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${config.color}`}
      >
        <Shield size={12} />
        {config.label}
      </div>
    );
  };

  const RequestCard = ({ request }) => {
    const currentEscrowStatus =
      escrowStatus[request.escrowId] || request.escrowStatus;

    return (
      <div className="border border-gray-100 rounded-2xl p-4 hover:border-gray-200 transition-colors bg-white">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              {request.profileImage ? (
                <img
                  src={request.profileImage}
                  alt={request.traveler}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-medium text-sm">
                  {getInitials(request.traveler)}
                </div>
              )}

              {request.verified && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Shield size={10} className="text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900 text-sm">
                  {request.traveler}
                </h3>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-amber-400 fill-current" />
                  <span className="text-xs text-gray-600 font-medium">
                    {request.rating}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {request.completedTrips} deliveries
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-gray-400">{request.appliedAt}</span>
            {getStatusBadge(request.status)}
          </div>
        </div>

        {/* Escrow Status */}
        {getEscrowBadge(request)}

        <p className="text-sm text-gray-600 leading-relaxed mb-4 bg-gray-50 rounded-lg p-3">
          {request.message}
        </p>

        <div className="flex items-center gap-2">
          {request.status === 'pending' ? (
            <>
              <button
                onClick={() => handleAccept(request)}
                disabled={processingId === request.applicationId}
                className="flex-1 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingId === request.applicationId
                  ? 'Processing...'
                  : 'Accept'}
              </button>
              <button
                onClick={() => handleDecline(request.applicationId)}
                disabled={processingId === request.applicationId}
                className="flex-1 py-2 text-gray-600 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingId === request.applicationId
                  ? 'Processing...'
                  : 'Decline'}
              </button>
            </>
          ) : request.status === 'accepted' ? (
            <div className="w-full space-y-3">
              {/* Show payment button if no escrow status or escrow is pending */}
              {(!currentEscrowStatus || currentEscrowStatus === 'pending') && (
                <button
                  onClick={() => {
                    setSelectedRequest({
                      ...request,
                      packageId: request.packageId,
                      packageReward: request.reward,
                    });
                    setShowPaymentModal(true);
                  }}
                  className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard size={16} />
                  Pay ₦{request.reward?.toLocaleString() || '0'} to Escrow
                </button>
              )}

              {/* Show delivery confirmation when escrow is funded */}
              {currentEscrowStatus === 'funded' && (
                <button
                  onClick={() => handleConfirmDelivery(request.escrowId)}
                  disabled={processingId === request.escrowId}
                  className="w-full py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {processingId === request.escrowId
                    ? 'Processing...'
                    : 'Confirm Delivery & Release Payment'}
                </button>
              )}

              {/* Show refund option for disputed cases */}
              {request.status === 'disputed' &&
                currentEscrowStatus === 'funded' && (
                  <button
                    onClick={() =>
                      handleRefund(request.escrowId, 'Package dispute')
                    }
                    disabled={processingId === request.escrowId}
                    className="w-full py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {processingId === request.escrowId
                      ? 'Processing...'
                      : 'Request Refund'}
                  </button>
                )}
            </div>
          ) : (
            <div className="flex-1 py-2 text-center text-sm text-gray-500">
              Request Declined
            </div>
          )}
        </div>
      </div>
    );
  };

  // Payment Modal
  const PaymentModal = () => {
    if (!showPaymentModal || !selectedRequest) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Secure Payment Required
          </h3>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Traveler:</span>
              <span className="font-medium">{selectedRequest.traveler}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Package:</span>
              <span className="font-medium">
                {selectedRequest.packageTitle}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-600">Amount to pay:</span>
              <span className="font-semibold text-blue-700">
                ₦{selectedRequest.packageReward?.toLocaleString() || '0'}
              </span>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield size={16} className="text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Funds held securely in escrow
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Payment will only be released to the traveler after you
                    confirm successful delivery
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowPaymentModal(false);
                setSelectedRequest(null);
              }}
              className="flex-1 py-3 text-gray-600 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInitializePayment}
              disabled={
                processingId === 'payment_' + selectedRequest.applicationId
              }
              className="flex-1 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processingId === 'payment_' + selectedRequest.applicationId ? (
                'Processing...'
              ) : (
                <>
                  <CreditCard size={16} />
                  Pay Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
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
    <div className="max-w-sm mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
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
            <p className="text-sm text-gray-500 mt-1">
              {totalRequests} total • {pendingCount} pending • {acceptedCount}{' '}
              accepted
            </p>
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
            ([packageId, { packageInfo, requests: packageRequests }]) => (
              <div
                key={packageId}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                {/* Package Header */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-900 leading-tight">
                      {packageInfo.title}
                    </h2>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ₦{packageInfo.reward?.toLocaleString() || '0'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span>
                      {packageInfo.pickupLocation} →{' '}
                      {packageInfo.deliveryLocation}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Package size={12} className="text-gray-400" />
                      <span>
                        {packageInfo.size} • {packageInfo.weight}kg
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-gray-400" />
                      <span>by {packageInfo.deadline}</span>
                    </div>
                  </div>
                </div>

                {/* Package Requests */}
                <div className="space-y-3">
                  {packageRequests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              </div>
            )
          )}
        </div>

        {/* Empty State */}
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

      {/* Payment Modal */}
      <PaymentModal />
    </div>
  );
}
