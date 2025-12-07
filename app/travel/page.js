'use client';
import React, { useState } from 'react';
import { MapPin, Plus, Navigation, CheckCircle, XCircle } from 'lucide-react';

export default function page() {
  const [activeTab, setActiveTab] = useState('home'); 
  const [showCreateTrip, setShowCreateTrip] = useState(false);
  const [tripForm, setTripForm] = useState({
    pickupCity: '',
    destinationCity: '',
    date: 'today',
    pricePerKm: '',
  });

  const [deliveryRequests] = useState([
    {
      id: 1,
      sender: 'John Doe',
      pickup: 'Ikeja, Lagos',
      dropoff: 'Wuse, Abuja',
      distance: '750 km',
      price: 12000,
      status: 'pending'
    },
    {
      id: 2,
      sender: 'Sarah Ahmed',
      pickup: 'Victoria Island, Lagos',
      dropoff: 'Garki, Abuja',
      distance: '755 km',
      price: 11500,
      status: 'pending'
    }
  ]);

  const [activeDeliveries] = useState([
    {
      id: 1,
      sender: 'Mike Johnson',
      pickup: 'Surulere, Lagos',
      dropoff: 'Maitama, Abuja',
      progress: 65,
      status: 'in-transit'
    }
  ]);

  const handleCreateTrip = () => {
    if (tripForm.pickupCity && tripForm.destinationCity && tripForm.pricePerKm) {
      console.log('Trip created:', tripForm);
      setShowCreateTrip(false);
      setTripForm({ pickupCity: '', destinationCity: '', date: 'today', pricePerKm: '' });
    }
  };

  const handleAcceptRequest = (id) => {
    console.log('Accepted request:', id);
  };

  const handleDeclineRequest = (id) => {
    console.log('Declined request:', id);
  };

  return (
    <div className="min-h-screen bg-white mt-20  p-20">
      

      {/* Main Content */}
      <div className="p-6">
        {activeTab === 'home' && (
          <>
            {/* Create Trip Button */}
            <button
              onClick={() => setShowCreateTrip(true)}
              className="w-full bg-[#3A0A21] text-white py-4 rounded-2xl flex items-center justify-center gap-2 mb-6 hover:bg-[#4A1231] transition-colors shadow-lg"
            >
              <Plus size={20} />
              <span className="font-medium">Create New Trip</span>
            </button>

            {/* Active Deliveries */}
            {activeDeliveries.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-medium text-[#3A0A21] mb-3">Active Delivery</h2>
                {activeDeliveries.map((delivery) => (
                  <div key={delivery.id} className="border-2 border-[#3A0A21] rounded-2xl p-4 mb-3">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-[#3A0A21]">{delivery.sender}</p>
                        <p className="text-sm text-gray-600 mt-1">In Transit</p>
                      </div>
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                        {delivery.progress}%
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-[#3A0A21] mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Pickup</p>
                          <p className="text-sm">{delivery.pickup}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Navigation size={16} className="text-[#3A0A21] mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Dropoff</p>
                          <p className="text-sm">{delivery.dropoff}</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className="bg-[#3A0A21] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${delivery.progress}%` }}
                      />
                    </div>

                    <button className="w-full bg-[#3A0A21] text-white py-2 rounded-xl text-sm hover:bg-[#4A1231] transition-colors">
                      View on Map
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Delivery Requests */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-[#3A0A21] mb-3">New Requests</h2>
              {deliveryRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-2xl p-4 mb-3 hover:border-[#3A0A21] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-[#3A0A21]">{request.sender}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Navigation size={14} />
                        {request.distance}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-[#3A0A21]">₦{request.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Estimated</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Pickup</p>
                        <p className="text-sm">{request.pickup}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Navigation size={16} className="text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Dropoff</p>
                        <p className="text-sm">{request.dropoff}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleDeclineRequest(request.id)}
                      className="border border-gray-300 text-gray-700 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                      <XCircle size={18} />
                      <span className="text-sm">Decline</span>
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="bg-[#3A0A21] text-white py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-[#4A1231] transition-colors"
                    >
                      <CheckCircle size={18} />
                      <span className="text-sm">Accept</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        
       

      </div>

      {/* Create Trip Modal */}
      {showCreateTrip && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-t-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-[#3A0A21]">Create New Trip</h2>
              <button
                onClick={() => setShowCreateTrip(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#3A0A21] mb-2 block">Pickup City</label>
                <input
                  type="text"
                  placeholder="e.g., Lagos"
                  value={tripForm.pickupCity}
                  onChange={(e) => setTripForm({ ...tripForm, pickupCity: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#3A0A21]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#3A0A21] mb-2 block">Destination City</label>
                <input
                  type="text"
                  placeholder="e.g., Abuja"
                  value={tripForm.destinationCity}
                  onChange={(e) => setTripForm({ ...tripForm, destinationCity: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#3A0A21]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#3A0A21] mb-2 block">When are you traveling?</label>
                <div className="grid grid-cols-3 gap-2">
                  {['today', 'tomorrow', 'next week'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setTripForm({ ...tripForm, date: option })}
                      className={`py-2 px-4 rounded-xl text-sm capitalize transition-colors ${
                        tripForm.date === option
                          ? 'bg-[#3A0A21] text-white'
                          : 'border border-gray-200 text-gray-700 hover:border-[#3A0A21]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#3A0A21] mb-2 block">Price per KM (₦)</label>
                <input
                  type="number"
                  placeholder="e.g., 20"
                  value={tripForm.pricePerKm}
                  onChange={(e) => setTripForm({ ...tripForm, pricePerKm: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#3A0A21]"
                />
              </div>

              <button
                onClick={handleCreateTrip}
                className="w-full bg-[#3A0A21] text-white py-3 rounded-xl font-medium hover:bg-[#4A1231] transition-colors"
              >
                Create Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}