'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle } from 'lucide-react';

export default function CombinedPackageDetails({ packageData }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleMessage = () => {
    alert(`Opening chat with ${packageData?.senderName || 'sender'}...`);
  };

  const handleAcceptPackage = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsAccepted(true);
      setIsLoading(false);
    }, 1500);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "express":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSenderInitials = (name) => {
    if (!name) return "??";
    const nameParts = name.trim().split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (!packageData) {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen">
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading package details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center pt-12 pb-6 px-5">
        <button 
          onClick={handleGoBack}
          className="mr-4 p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Package Details</h1>
      </div>

      {/* Main Content */}
      <div className="px-5 pb-24 space-y-8">
        {/* Package Info */}
        <div className="text-center">
          {packageData.status && (
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getStatusColor(packageData.status)}`}>
              {packageData.status.toUpperCase()}
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {packageData.title || 'Package Delivery'}
          </h2>
          <p className="text-gray-500">
            {packageData.size || 'Medium'} size • {packageData.weight || '3.5'}kg • {packageData.description || 'Handle with care'}
          </p>
        </div>

        {/* Price */}
        <div className="text-center py-6 bg-green-50 rounded-2xl">
          <div className="text-3xl font-bold text-green-600 mb-1">
            {formatCurrency(packageData.reward)}
          </div>
          <div className="text-sm text-green-700">Payment secured</div>
        </div>

        {/* Route */}
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-4"></div>
            <div>
              <div className="font-medium text-gray-900">Pickup</div>
              <div className="text-sm text-gray-500">
                {packageData.pickupLocation || 'Pickup Location'}
              </div>
            </div>
          </div>
          <div className="ml-6 w-px h-8 bg-gray-200"></div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-4"></div>
            <div>
              <div className="font-medium text-gray-900">Drop-off</div>
              <div className="text-sm text-gray-500">
                {packageData.deliveryLocation || 'Delivery Location'}
              </div>
            </div>
          </div>
        </div>

        {/* Distance & Time */}
        <div className="flex justify-between py-4 px-5 bg-gray-50 rounded-xl">
          <div className="text-center">
            <div className="font-semibold text-gray-900">{packageData.distance || 'N/A'}km</div>
            <div className="text-xs text-gray-500">Distance</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">{packageData.estimatedDuration || '4.5'}hrs</div>
            <div className="text-xs text-gray-500">Duration</div>
          </div>
        </div>

        {/* Sender */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
              {getSenderInitials(packageData.senderName)}
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {packageData.senderName || 'Anonymous Sender'}
              </div>
              <div className="text-sm text-gray-500">
                {packageData.senderRating || '4.9'} rating • {packageData.senderTrips || '127'} trips
              </div>
            </div>
          </div>
          <button 
            onClick={handleMessage}
            className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors"
          >
            <MessageCircle size={18} className="text-blue-600" />
          </button>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-100 p-5">
        <button
          onClick={handleAcceptPackage}
          disabled={isLoading || isAccepted}
          className={`w-full h-12 rounded-xl text-base font-semibold transition-all duration-200 ${
            isAccepted 
              ? 'bg-green-500 text-white' 
              : isLoading 
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95'
          }`}
        >
          {isLoading ? 'Processing...' : isAccepted ? 'Request Sent!' : 'Request Delivery'}
        </button>
      </div>
    </div>
  );
}