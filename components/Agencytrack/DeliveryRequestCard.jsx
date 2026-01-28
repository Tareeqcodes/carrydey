'use client';
import  { useState } from 'react';
import { 
  MapPin,  
  CheckCircle, 
  Clock,
  Loader2,
} from 'lucide-react';
 import { formatNairaSimple } from '@/hooks/currency';

const DeliveryRequestCard = ({ request, onAccept, onCodesModalClosed }) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [showCodesModal, setShowCodesModal] = useState(false);
  const [deliveryData, setDeliveryData] = useState(null);

  const formattedPayout = formatNairaSimple(request.payout || request.offeredFare || request.suggestedFare);
  
  const handleAccept = async () => {
    setIsAccepting(true); 
    try {
      const result = await onAccept(request.id || request.$id);
      
      if (result?.success) {
        // Store delivery data with codes
        setDeliveryData({
          ...result.data,
          pickupCode: result.pickupCode,
          dropoffOTP: result.dropoffOTP,
        });
        setShowCodesModal(true);
      } else {
        // Show error if acceptance failed
        console.error('Failed to accept delivery:', result?.error);
        alert(result?.error || 'Failed to accept delivery. Please try again.');
      }
    } catch (error) {
      console.error('Error accepting delivery:', error);
      alert('An error occurred while accepting the delivery. Please try again.');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleCloseCodesModal = () => {
    setShowCodesModal(false);
    
    // Notify parent component that codes modal is closed
    // This triggers the assignment modal to open
    if (onCodesModalClosed && deliveryData) {
      onCodesModalClosed(deliveryData.$id);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        {/* Header with ID and timestamp */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500">
              <Clock className="w-3 h-3 inline mr-1" />
              {new Date(request.createdAt || request.$createdAt).toLocaleString()}
            </p>
          </div>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            Pending
          </span>
        </div>

        {/* Location Details */}
        <div className="space-y-3 mb-4">
          {/* Pickup Location */}
          <div className="flex items-start gap-2">
            <div className="p-1 bg-green-100 rounded-full mt-0.5">
              <MapPin className="w-3 h-3 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500">Pickup</p>
              <p className="text-sm text-gray-900">{request.pickup || request.pickupAddress}</p>
              {(request.sender || request.pickupContactName) && (
                <p className="text-xs text-gray-500 mt-1">
                  Sender: {request.sender || request.pickupContactName}
                </p>
              )}
            </div>
          </div>
          
          {/* Separator line */}
          <div className="border-l-2 border-dashed border-gray-200 h-4 ml-3"></div>
          
          {/* Dropoff Location */}
          <div className="flex items-start gap-2">
            <div className="p-1 bg-red-100 rounded-full mt-0.5">
              <MapPin className="w-3 h-3 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500">Dropoff</p>
              <p className="text-sm text-gray-900">{request.dropoff || request.dropoffAddress}</p>
              {(request.customerName || request.dropoffContactName) && (
                <p className="text-xs text-gray-500 mt-1">
                  Customer: {request.customerName || request.dropoffContactName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-50 p-3 rounded-xl text-center">
            <p className="text-xs text-gray-500 mb-1">Distance</p>
            <p className="font-semibold">
              {request.distance 
                ? typeof request.distance === 'number' 
                  ? `${(request.distance / 1000).toFixed(1)} km`
                  : request.distance
                : 'N/A'}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl text-center">
            <p className="text-xs text-gray-500 mb-1">Package</p>
            <p className="font-semibold">{request.packageSize || 'Standard'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl text-center">
            <p className="text-xs text-gray-500 mb-1">Phone</p>
            <p className="font-semibold text-xs break-all">
              {request.customerPhone || request.dropoffPhone || 'N/A'}
            </p>
          </div>
        </div>

        {/* Package Details */}
        {(request.instructions || request.packageDescription) && (
          <div className="mb-4 p-3 bg-blue-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Instructions</p>
            <p className="text-sm text-gray-700">
              {request.instructions || request.packageDescription}
            </p>
            {request.isFragile && (
              <span className="inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                ⚠️ Fragile
              </span>
            )}
          </div>
        )}

        {/* Footer with Payout and Accept Button */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Estimated Payout</p>
            <p className="text-2xl font-bold text-green-600">{formattedPayout}</p>
          </div>
          
          <div className="flex gap-2">
            
            <button
              onClick={handleAccept}
              disabled={isAccepting}
              className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAccepting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Accept
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Codes Modal */}
      {/* {showCodesModal && deliveryData && (
        <DeliveryCodesModal
          isOpen={showCodesModal}
          onClose={handleCloseCodesModal}
          delivery={deliveryData}
          pickupCode={deliveryData.pickupCode}
          dropoffOTP={deliveryData.dropoffOTP}
          driverPhone={deliveryData.driverPhone}
        />
      )} */}
    </>
  );
};

export default DeliveryRequestCard;