import React from 'react';
import { MapPin, Star, CheckCircle, Clock, Navigation, User } from 'lucide-react';

const TravelerCard = ({ traveler, index, isSelected, onSelect, onBook }) => {
  return (
    <div
      className={`bg-white border-2 rounded-2xl p-4 transition-all duration-300 relative ${
        isSelected
          ? 'border-[#3A0A21] shadow-lg scale-[1.02]'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      onClick={() => onSelect(traveler)}
    >
      {/* Top Row: Avatar, Name, Rating */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={traveler.avatar}
          alt={traveler.name}
          className="w-12 h-12 rounded-full bg-gray-100"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{traveler.name}</h3>
            {traveler.verified && (
              <CheckCircle className="w-4 h-4 text-blue-500" fill="currentColor" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className='flex items-center'>
            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
            <span className="text-sm font-medium text-gray-700">{traveler.rating}</span>
            </div>
            <div className='flex items-center gap-1'>

            <span className="text-xs">{traveler.totalDeliveries || '0 deliveries'}</span>
            <p className='text-xs'>deliveries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Route Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Navigation className="w-4 h-4 text-[#3A0A21]" />
          <span className="text-gray-600">Going:</span>
          <span className="font-medium text-gray-900">{traveler.route}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{traveler.distance} km away</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Picks up in ~{traveler.pickupTime} mins</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBook(traveler);
          }}
          className="flex-1 bg-[#3A0A21] text-white py-3 rounded-lg font-medium hover:bg-[#4a0a2a] transition-colors"
        >
          Book Traveler
        </button>
      </div>

      {/* Best Choice Badge */}
      {index === 0 && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          Best Choice
        </div>
      )}
    </div>
  );
};

export default TravelerCard;