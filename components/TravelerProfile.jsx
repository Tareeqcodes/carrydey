import { Star, Shield } from 'lucide-react';
import { getInitials } from '@/utils/requestHelpers';

export const TravelerProfile = ({ request }) => {
  return (
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
  );
};