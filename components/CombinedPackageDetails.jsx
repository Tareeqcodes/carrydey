'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, Star, Shield, Clock, Package, MapPin, Heart, Share2 } from 'lucide-react';

export default function CombinedPackageDetails({ packageData }) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [badgePulse, setBadgePulse] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBadgePulse(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: packageData?.title || 'Package Delivery',
        text: `Check out this delivery opportunity - ${formatCurrency(packageData?.reward || 0)}`,
        url: window.location.href,
      });
    }
  };

  const handleMessage = () => {
    alert(`Opening chat with ${packageData?.senderName || 'sender'}...`);
  };

  const handleAcceptPackage = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsAccepted(true);
      setIsLoading(false);
      
      setTimeout(() => {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
      }, 800);
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
      case "urgent":
        return "bg-red-100 text-red-700";
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
    <div className="max-w-sm mx-auto bg-white min-h-screen relative">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between pt-12 pb-4 px-5">
          <div className="flex items-center">
            <button 
              onClick={handleGoBack}
              className="w-8 h-8 flex items-center justify-center mr-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={18} className="text-gray-900" strokeWidth={2.5} />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Package Details</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleBookmark}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Heart 
                size={18} 
                className={`${isBookmarked ? 'text-red-500 fill-current' : 'text-gray-500'}`} 
              />
            </button>
            <button 
              onClick={handleShare}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 size={18} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 pb-24 space-y-5">
        {/* Package Header */}
        <div>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {packageData.title || 'Package Delivery'}
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                {packageData.description || 'Handle with care'}
              </p>
            </div>
            <div className="text-right ml-4">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(packageData.reward)}
              </div>
              {packageData.status && (
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                  badgePulse ? 'animate-pulse' : ''
                } ${getStatusColor(packageData.status)}`}>
                  {packageData.status.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Package Specs */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex gap-3">
            <div className="flex-1 text-center py-2">
              <Package className="mx-auto mb-2 text-gray-500" size={18} />
              <div className="text-base font-semibold text-gray-900 mb-1">
                {packageData.weight || 'N/A'}kg
              </div>
              <div className="text-xs text-gray-500 font-medium">Weight</div>
            </div>
            <div className="flex-1 text-center py-2">
              <div className="mx-auto mb-2 w-4 h-4 flex items-center justify-center">
                <span className="text-gray-500 text-sm">📏</span>
              </div>
              <div className="text-base font-semibold text-gray-900 mb-1">
                {packageData.size || 'Medium'}
              </div>
              <div className="text-xs text-gray-500 font-medium">Size</div>
            </div>
            <div className="flex-1 text-center py-2">
              <Clock className="mx-auto mb-2 text-gray-500" size={18} />
              <div className="text-base font-semibold text-gray-900 mb-1">
                {packageData.estimatedDuration || '4.5'}hrs
              </div>
              <div className="text-xs text-gray-500 font-medium">Duration</div>
            </div>
          </div>
        </div>

        {/* Route Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Route</h3>
          <div className="space-y-0">
            <div className="flex items-center py-3 border-b border-gray-100">
              <div className="flex flex-col items-center mr-4">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <div className="w-0.5 h-6 bg-gray-200 mt-1"></div>
              </div>
              <div className="flex items-center flex-1">
                <MapPin size={16} className="text-green-500 mr-2" />
                <div>
                  <div className="text-base font-medium text-gray-900">Pickup</div>
                  <div className="text-sm text-gray-500">
                    {packageData.pickupLocation || 'Pickup Location'}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center py-3">
              <div className="flex flex-col items-center mr-4">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
              </div>
              <div className="flex items-center flex-1">
                <MapPin size={16} className="text-red-500 mr-2" />
                <div>
                  <div className="text-base font-medium text-gray-900">Drop-off</div>
                  <div className="text-sm text-gray-500">
                    {packageData.deliveryLocation || 'Delivery Location'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-blue-700 font-medium">
                Distance: {packageData.distance || 'N/A'}km
              </span>
              <span className="text-blue-700 font-medium">
                Est. {packageData.estimatedDuration || '4.5'} hours
              </span>
            </div>
          </div>
        </div>

        {/* Earnings */}
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-sm text-gray-500 mb-1">You'll earn</div>
          <div className="text-3xl font-bold text-green-500">
            {formatCurrency(packageData.reward)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {packageData.distance || 'N/A'}km • Payment secured
          </div>
        </div>

        {/* Sender Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Sender</h3>
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-semibold mr-3">
                  {getSenderInitials(packageData.senderName)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-semibold text-gray-900">
                      {packageData.senderName || 'Anonymous Sender'}
                    </span>
                    <Shield size={14} className="text-green-500" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={13} className="text-orange-500 fill-current" />
                    <span className="text-sm text-gray-600">
                      {packageData.senderRating || '4.9'} ({packageData.senderTrips || '127'} trips)
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleMessage}
                className="w-9 h-9 border border-gray-200 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors ml-3"
              >
                <MessageCircle size={18} className="text-gray-600" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Requirements */}
        {packageData.requirements && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              {packageData.requirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-600">{requirement}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Default Requirements if none provided */}
        {!packageData.requirements && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-600">Valid driver's license required</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-600">Vehicle capacity: {packageData.size || 'Medium'}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-600">Handle with care</span>
              </div>
            </div>
          </div>
        )}

        {/* Safety Note */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-center justify-center">
            <Shield size={16} className="text-green-600" />
            <span className="text-sm text-green-800 font-medium">Payment protected until successful delivery</span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-100 p-4">
        <button
          onClick={handleAcceptPackage}
          disabled={isLoading || isAccepted}
          className={`w-full h-13 rounded-full text-base font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            isAccepted 
              ? 'bg-green-500 text-white' 
              : isLoading 
                ? 'bg-gray-900 text-white opacity-60 pointer-events-none'
                : 'bg-gray-900 text-white hover:bg-gray-800 hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {isLoading ? (
            <span>Processing...</span>
          ) : isAccepted ? (
            <span>✓ Accepted!</span>
          ) : (
            <span>Request Delivery</span>
          )}
        </button>
        <p className="text-center text-xs text-gray-500 mt-2">
          Response expected within 2 hours
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-90 text-white px-6 py-4 rounded-2xl font-semibold text-base z-50 animate-in slide-in-from-bottom-4 duration-300">
          Package accepted successfully!
        </div>
      )}
    </div>
  );
}