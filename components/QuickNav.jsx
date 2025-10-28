'use client';
import { MessageSquare, Clock, Wallet, MapPin, Star, Package, ChevronRight } from 'lucide-react';

export default function QuickNav() {
  const deliveries = [
    {
      id: 1,
      package: 'Electronics Box',
      destination: 'Lagos, Nigeria',
      traveler: 'Chioma A.',
      rating: 4.9,
      status: 'In Transit',
      progress: 65,
      arrival: 'Today, 6:30 PM',
      color: 'from-blue-400 to-cyan-400',
    },
    {
      id: 2,
      package: 'Documents Bundle',
      destination: 'Ibadan, Nigeria',
      traveler: 'Kadir M.',
      rating: 4.8,
      status: 'Pending',
      progress: 10,
      arrival: 'Tomorrow, 2:00 PM',
      color: 'from-purple-400 to-pink-400',
    },
    {
      id: 3,
      package: 'Gift Box',
      destination: 'Abuja, Nigeria',
      traveler: 'Zainab S.',
      rating: 5.0,
      status: 'Delivered',
      progress: 100,
      arrival: 'Delivered',
      color: 'from-green-400 to-emerald-400',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Transit':
        return 'bg-blue-100 text-blue-700';
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-bold text-gray-900">In Transit Packages</h3>

        <div className="space-y-3">
          {deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-purple-200 group cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Package size={18} className="text-purple-500" />
                    <h4 className="font-semibold text-gray-900">
                      {delivery.package}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin size={16} className="text-gray-400" />
                    {delivery.destination}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    delivery.status
                  )}`}
                >
                  {delivery.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${delivery.color} transition-all duration-500`}
                    style={{ width: `${delivery.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {delivery.progress}% Complete
                </p>
              </div>

              {/* Traveler & Arrival */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Traveler</p>
                  <div className="flex items-center gap-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {delivery.traveler}
                    </p>
                    <div className="flex items-center gap-0.5">
                      <Star
                        size={14}
                        className="text-amber-400 fill-amber-400"
                      />
                      <span className="text-xs font-semibold text-gray-700">
                        {delivery.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 mb-1">Arrives</p>
                  <p className="font-medium text-gray-900 text-sm">
                    {delivery.arrival}
                  </p>
                </div>
              </div>

              {/* Hover Action */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-4 pt-4 border-t border-gray-100">
                <button className="flex items-center gap-2 text-purple-600 font-medium text-sm hover:text-purple-700">
                  View Details <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 mt-8">
        <h3 className="text-lg font-bold text-gray-900">Quick Tools</h3>

        <div className="grid grid-cols-1 gap-3">
          {/* Messages */}
          <button className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-green-200 group active:scale-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <MessageSquare size={20} className="text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">Messages</p>
                <p className="text-xs text-gray-600">2 unread</p>
              </div>
            </div>
          </button>

          {/* History */}
          <button className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-purple-200 group active:scale-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Clock size={20} className="text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">History</p>
                <p className="text-xs text-gray-600">View all shipments</p>
              </div>
            </div>
          </button>
          
        </div>
      </div>
    </>
  );
}
