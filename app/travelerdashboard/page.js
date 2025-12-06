'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Package, User, Plus, Clock, DollarSign, Navigation, CheckCircle, XCircle, Calendar, ChevronRight } from 'lucide-react';

export default function TravelerDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [showCreateTrip, setShowCreateTrip] = useState(false);
  const [tripForm, setTripForm] = useState({
    pickupCity: '',
    destinationCity: '',
    date: 'today',
    pricePerKm: '',
  });

  // Mock data
  const [trips] = useState([
    {
      id: 1,
      from: 'Lagos',
      to: 'Abuja',
      date: '2024-12-02',
      status: 'active',
      earnings: 15000,
      deliveries: 3
    },
    {
      id: 2,
      from: 'Abuja',
      to: 'Port Harcourt',
      date: '2024-12-05',
      status: 'upcoming',
      earnings: 0,
      deliveries: 0
    }
  ]);

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
    <div className="min-h-screen bg-white p-20">
      {/* Header */}
      <div className="bg-[#3A0A21] text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-light">Hello, Traveler</h1>
            <p className="text-white/70 text-sm mt-1">Ready to earn today?</p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"> 
          <Link href="/setting">
            <User size={24} />
          </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-white/70 text-xs mb-1">Earnings</p>
            <p className="text-xl font-semibold">₦15,000</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-white/70 text-xs mb-1">Deliveries</p>
            <p className="text-xl font-semibold">8</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-white/70 text-xs mb-1">Rating</p>
            <p className="text-xl font-semibold">4.9 ⭐</p>
          </div>
        </div>
      </div>

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

        {activeTab === 'trips' && (
          <div>
            <h2 className="text-xl font-medium text-[#3A0A21] mb-4">My Trips</h2>
            {trips.map((trip) => (
              <div key={trip.id} className="border-2 border-[#3A0A21] rounded-2xl p-4 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#3A0A21] rounded-full flex items-center justify-center text-white">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-[#3A0A21]">{trip.from} → {trip.to}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar size={12} />
                        {trip.date}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    trip.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {trip.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Earnings</p>
                    <p className="font-semibold text-[#3A0A21]">₦{trip.earnings.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Deliveries</p>
                    <p className="font-semibold text-[#3A0A21]">{trip.deliveries}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h2 className="text-xl font-medium text-[#3A0A21] mb-4">Profile Settings</h2>
            <div className="space-y-3">
              {['Personal Information', 'Payment Methods', 'Verification', 'Settings'].map((item) => (
                <button
                  key={item}
                  className="w-full border border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:border-[#3A0A21] transition-colors"
                >
                  <span className="text-[#3A0A21]">{item}</span>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
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

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'home' ? 'text-[#3A0A21]' : 'text-gray-400'
            }`}
          >
            <Package size={24} />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('trips')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'trips' ? 'text-[#3A0A21]' : 'text-gray-400'
            }`}
          >
            <MapPin size={24} />
            <span className="text-xs">Trips</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'profile' ? 'text-[#3A0A21]' : 'text-gray-400'
            }`}
          >
            <User size={24} />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}