'use client';
import { useState } from 'react';
import { ArrowLeft, MessageCircle, Star, Shield, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useRequest from '@/hooks/useRequest';

export default function DeliveryRequest({ packageId, packageDetails }) {
  const router = useRouter();
  const { requests, loading, error, updateStatus } = useRequest(packageId);
  const [processingId, setProcessingId] = useState(null);

  const handleAccept = async (applicationId) => {
    setProcessingId(applicationId);
    const success = await updateStatus(applicationId, 'accepted');
    if (success) {
      // Optional: Show success notification
    }
    setProcessingId(null);
  };

  const handleDecline = async (applicationId) => {
    setProcessingId(applicationId);
    const success = await updateStatus(applicationId, 'declined');
    if (success) {
      // Optional: Show success notification
    }
    setProcessingId(null);
  };

  const handleMessage = (travelerId, travelerName) => {
    // Navigate to chat or open messaging modal
    console.log(`Opening chat with ${travelerName} (ID: ${travelerId})`);
    // You can implement navigation to chat here
    // router.push(`/chat/${travelerId}`);
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const acceptedCount = requests.filter(r => r.status === 'accepted').length;

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center pt-12 pb-6 px-5 border-b border-gray-100">
        <button 
          onClick={() => router.back()}
          className="mr-4 p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900">Delivery Requests</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pendingCount} pending • {acceptedCount} accepted
          </p>
        </div>
      </div>

      {/* Package Summary */}
      <div className="px-5 py-6 border-b border-gray-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-medium text-gray-900 mb-1">
              {packageDetails?.title || 'Package Delivery'}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              {packageDetails?.pickupLocation || 'Pickup'} → {packageDetails?.deliveryLocation || 'Delivery'}
            </p>
            <div className="flex items-center gap-2">
              <Package size={14} className="text-gray-400" />
              <span className="text-xs text-gray-500">
                {packageDetails?.size || 'Medium'} • {packageDetails?.weight || '3.5'}kg
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold text-gray-900">
              ₦{packageDetails?.reward?.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              by {packageDetails?.deadline || 'TBD'}
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="px-5 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="border border-gray-100 rounded-2xl p-4 hover:border-gray-200 transition-colors">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-medium text-sm">
                    {getInitials(request.traveler)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {request.traveler}
                      </h3>
                      {request.verified && (
                        <Shield size={14} className="text-blue-500" />
                      )}
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
                  <span className="text-xs text-gray-400">
                    {request.appliedAt}
                  </span>
                  {getStatusBadge(request.status)}
                </div>
              </div>

              {/* Message */}
              <p className="text-sm text-gray-600 leading-relaxed mb-4 bg-gray-50 rounded-lg p-3">
                {request.message}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {request.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleAccept(request.applicationId)}
                      disabled={processingId === request.applicationId}
                      className="flex-1 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === request.applicationId ? 'Processing...' : 'Accept'}
                    </button>
                    <button
                      onClick={() => handleDecline(request.applicationId)}
                      disabled={processingId === request.applicationId}
                      className="flex-1 py-2 text-gray-600 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === request.applicationId ? 'Processing...' : 'Decline'}
                    </button>
                  </>
                ) : (
                  <div className="flex-1"></div>
                )}
                
                <button 
                  onClick={() => handleMessage(request.travelerId, request.traveler)}
                  className="p-2 text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {requests.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">No requests yet</h3>
            <p className="text-sm text-gray-500">
              We'll notify you when travelers apply for your delivery.
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-100 p-5">
        <div className="flex gap-3">
          <button 
            onClick={() => router.back()}
            className="flex-1 py-3 text-gray-600 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Back to listing
          </button>
          <button 
            onClick={() => {
              // Navigate to edit listing page
              console.log('Edit listing');
            }}
            className="flex-1 py-3 bg-gray-50 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors"
          >
            Edit listing
          </button>
        </div>
      </div>
    </div>
  );
}