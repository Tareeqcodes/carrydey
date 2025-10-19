import { MapPin } from 'lucide-react';
import { RequestCard } from './RequestCard';

export const PackageGroup = ({ packageInfo, requests, actions }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
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

        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
          <MapPin size={14} className="text-gray-400" />
          <span>
            {packageInfo.pickupLocation} → {packageInfo.deliveryLocation}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {requests.map(request => (
          <RequestCard key={request.id} request={request} actions={actions} />
        ))}
      </div>
    </div>
  );
};