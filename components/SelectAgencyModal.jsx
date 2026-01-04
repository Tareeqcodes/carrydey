import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

const SelectAgencyModal = ({ traveler, onCancel, onConfirm }) => {
  if (!traveler) return null;
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price || 15000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fadeIn">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#3A0A21] to-purple-900 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Confirm Booking
          </h2>
          <p className="text-gray-600">
            You're about to book with {traveler.name}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3A0A21] to-purple-900 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={traveler.avatar}
                alt={traveler.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{traveler.name}</h3>
                {traveler.verified && (
                  <CheckCircle
                    className="w-4 h-4 text-blue-500"
                    fill="currentColor"
                  />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{traveler.rating}</span>
                <span className="text-gray-500">•</span>
                <span>{traveler.totalDeliveries || '0 deliveries'}</span>
              </div>
              
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Starting Price</span>
              <span className="font-bold text-[#3A0A21]">
                {formatPrice(traveler.minPrice)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Pickup</span>
              <span className="font-medium">
                ~{traveler.pickupTime} minutes
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Distance</span>
              <span className="font-medium">{traveler.distance} km away</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location</span>
              <span className="font-medium">{traveler.route}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 text-sm py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 text-sm md:py-3 bg-[#3A0A21] text-white rounded-lg font-medium hover:bg-[#4a0a2a] transition-colors"
          >
            Confirm Booking
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SelectAgencyModal;
