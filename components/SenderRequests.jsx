'use client'
import  { useState } from 'react';
import useSenderRequests from '@/hooks/useSenderRequests';
import PaymentModal from './PaymentModal';

export default function SenderRequests() {
  const { 
    groupedRequests, 
    loading, 
    error, 
    updateStatus, 
    acceptAndPay,
    releasePayment,
    pendingCount,
    acceptedCount,
    paidCount,
    completedCount 
  } = useSenderRequests();
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleAccept = async (request) => {
    const result = await acceptAndPay(request);
    if (result.success) {
      setSelectedRequest({ ...request, paymentUrl: result.authorizationUrl });
      setShowPaymentModal(true);
    }
  };

  const handleRelease = async (request) => {
    if (confirm('Are you sure you want to release payment to the traveler?')) {
      await releasePayment(request);
    }
  };

  const getStatusBadge = (request) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    if (request.escrow) {
      switch (request.escrow.status) {
        case 'held':
          return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Payment Held</span>;
        case 'released':
          return <span className={`${baseClasses} bg-green-100 text-green-800`}>Completed</span>;
        case 'refunded':
          return <span className={`${baseClasses} bg-red-100 text-red-800`}>Refunded</span>;
        default:
          break;
      }
    }

    switch (request.status) {
      case 'pending':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Pending</span>;
      case 'accepted':
        return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>Accepted</span>;
      case 'declined':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Declined</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</span>;
    }
  };

  const getActionButton = (request) => {
    if (request.status === 'pending') {
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => updateStatus(request.applicationId, 'declined')}
            className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50"
          >
            Decline
          </button>
          <button
            onClick={() => handleAccept(request)}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Accept & Pay
          </button>
        </div>
      );
    }

    if (request.escrow?.status === 'held') {
      return (
        <button
          onClick={() => handleRelease(request)}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Release Payment
        </button>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-blue-600">{pendingCount}</h3>
          <p className="text-gray-600">Pending Requests</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-purple-600">{acceptedCount}</h3>
          <p className="text-gray-600">Accepted</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-yellow-600">{paidCount}</h3>
          <p className="text-gray-600">Payment Held</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-green-600">{completedCount}</h3>
          <p className="text-gray-600">Completed</p>
        </div>
      </div>

      {/* Requests by Package */}
      {Object.keys(groupedRequests).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No delivery requests found.</p>
        </div>
      ) : (
        Object.entries(groupedRequests).map(([packageId, packageGroup]) => (
          <div key={packageId} className="bg-white rounded-lg shadow border">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">{packageGroup.packageInfo.title}</h3>
              <p className="text-gray-600 text-sm">
                {packageGroup.packageInfo.pickupLocation} → {packageGroup.packageInfo.deliveryLocation}
              </p>
              <p className="text-green-600 font-semibold">
                ₦{packageGroup.packageInfo.reward?.toLocaleString()}
              </p>
            </div>

            <div className="divide-y">
              {packageGroup.requests.map((request) => (
                <div key={request.id} className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {request.profileImage ? (
                            <img
                              src={request.profileImage}
                              alt={request.traveler}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <span className="text-gray-600 font-semibold">
                              {request.traveler.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold">{request.traveler}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>⭐ {request.rating}</span>
                            <span>•</span>
                            <span>{request.completedTrips} trips</span>
                            <span>•</span>
                            {request.verified && (
                              <span className="text-green-600">Verified</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 text-gray-700">{request.message}</p>
                      
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                        <span>{request.appliedAt}</span>
                        {getStatusBadge(request)}
                      </div>
                    </div>

                    <div className="mt-4 lg:mt-0 lg:ml-4">
                      {getActionButton(request)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedRequest && (
        <PaymentModal
          request={selectedRequest}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}