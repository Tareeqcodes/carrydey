'use client';
import { useState } from 'react';
import { ArrowLeft, MessageCircle, Star, Shield, Package, Phone, MapPin, Clock, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useRequest from '@/hooks/useRequest';

export default function SenderRequests() {
  const router = useRouter();
  const { 
    requests,
    groupedRequests, 
    loading, 
    error, 
    updateStatus, 
    totalRequests,
    pendingCount, 
    acceptedCount,
    packagesWithRequests 
  } = useRequest();
  
  const [processingId, setProcessingId] = useState(null);
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' or 'list'

  const handleAccept = async (applicationId) => {
    setProcessingId(applicationId);
    
    try {
      const result = await updateStatus(applicationId, 'accepted');
      
      if (result.success) {
        console.log('Request accepted successfully');
      } else {
        console.error('Failed to accept request:', result.error);
      }
    } catch (err) {
      console.error('Error accepting request:', err);
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

  const handleMessage = (travelerId, travelerName) => {
    console.log(`Opening chat with ${travelerName} (ID: ${travelerId})`);
    // router.push(`/chat/${travelerId}`);
  };

  const handleCall = (phoneNumber, travelerName) => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      console.log(`No phone number available for ${travelerName}`);
    }
  };

  const getInitials = (name) => {
    if (!name || name === "Unknown Traveler") return "??";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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

  const RequestCard = ({ request }) => (
    <div className="border border-gray-100 rounded-2xl p-4 hover:border-gray-200 transition-colors bg-white">
      {/* Request Header */}
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
        ) : request.status === 'accepted' ? (
          <div className="flex-1 py-2 text-center text-sm text-green-600 font-medium">
            Request Accepted
          </div>
        ) : (
          <div className="flex-1 py-2 text-center text-sm text-gray-500">
            Request Declined
          </div>
        )}
        
        <button 
          onClick={() => handleMessage(request.travelerId, request.traveler)}
          className="p-2 text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          title="Send message"
        >
          <MessageCircle size={16} />
        </button>
        
        {request.phoneNumber && (
          <button 
            onClick={() => handleCall(request.phoneNumber, request.traveler)}
            className="p-2 text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Call traveler"
          >
            <Phone size={16} />
          </button>
        )}
      </div>
    </div>
  );

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
            <h1 className="text-xl font-semibold text-gray-900">Delivery Requests</h1>
            <p className="text-sm text-gray-500 mt-1">
              {totalRequests} total • {pendingCount} pending • {acceptedCount} accepted
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('grouped')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                viewMode === 'grouped' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              By Package ({packagesWithRequests})
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Requests ({totalRequests})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {viewMode === 'grouped' ? (
          // Grouped by Package View
          <div className="space-y-6">
            {Object.entries(groupedRequests).map(([packageId, { packageInfo, requests: packageRequests }]) => (
              <div key={packageId} className="bg-white rounded-2xl p-4 shadow-sm">
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
                    <span>{packageInfo.pickupLocation} → {packageInfo.deliveryLocation}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Package size={12} className="text-gray-400" />
                      <span>{packageInfo.size} • {packageInfo.weight}kg</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-gray-400" />
                      <span>by {packageInfo.deadline}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">
                      {packageRequests.length} request{packageRequests.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Package Requests */}
                <div className="space-y-3">
                  {packageRequests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-2xl p-4 shadow-sm">
                {/* Package Context */}
                <div className="mb-3 pb-3 border-b border-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {request.packageTitle}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      ₦{request.reward?.toLocaleString() || '0'}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {request.pickupLocation} → {request.deliveryLocation}
                  </p>
                </div>
                
                <RequestCard request={request} />
              </div>
            ))}
          </div>
        )}

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
    </div>
  );
}