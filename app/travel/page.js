'use client';
import React, { useState } from 'react';
import { MapPin, Plus, Navigation, CheckCircle, XCircle, Calendar, Package, Clock, DollarSign, User, TrendingUp, Award, X } from 'lucide-react';

export default function TravelPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateTrip, setShowCreateTrip] = useState(false);
  const [tripForm, setTripForm] = useState({
    pickupCity: '',
    destinationCity: '',
    date: 'today',
    pricePerKm: '',
    availableSpace: '',
    notes: ''
  });

  const [myTrips] = useState([
    {
      id: 1,
      route: 'Lagos → Abuja',
      date: 'Dec 12, 2025',
      status: 'active',
      requests: 3,
      accepted: 1,
      earning: 12000
    },
    {
      id: 2,
      route: 'Abuja → Port Harcourt',
      date: 'Dec 15, 2025',
      status: 'scheduled',
      requests: 0,
      accepted: 0,
      earning: 0
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
      packageSize: 'Medium',
      status: 'pending'
    },
    {
      id: 2,
      sender: 'Sarah Ahmed',
      pickup: 'Victoria Island, Lagos',
      dropoff: 'Garki, Abuja',
      distance: '755 km',
      price: 11500,
      packageSize: 'Small',
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
      status: 'in-transit',
      estimatedArrival: '2 hours'
    }
  ]);

  const [stats] = useState({
    totalTrips: 24,
    completedDeliveries: 18,
    totalEarnings: 245000,
    rating: 4.8
  });

  const handleCreateTrip = () => {
    if (tripForm.pickupCity && tripForm.destinationCity && tripForm.pricePerKm) {
      console.log('Trip created:', tripForm);
      setShowCreateTrip(false);
      setTripForm({
        pickupCity: '',
        destinationCity: '',
        date: 'today',
        pricePerKm: '',
        availableSpace: '',
        notes: ''
      });
    }
  };

  const handleAcceptRequest = (id) => {
    console.log('Accepted request:', id);
  };

  const handleDeclineRequest = (id) => {
    console.log('Declined request:', id);
  };

  return (
    <div className="min-h-screen mx-auto mt-16 md:m-20 bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-[#3A0A21] text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Travel Dashboard</h1>
        <p className="text-gray-200 text-sm">Earn money while traveling</p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} />
              <span className="text-xs text-gray-200">Total Trips</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalTrips}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Package size={16} />
              <span className="text-xs text-gray-200">Completed</span>
            </div>
            <p className="text-2xl font-bold">{stats.completedDeliveries}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={16} />
              <span className="text-xs text-gray-200">Earnings</span>
            </div>
            <p className="text-2xl font-bold">₦{(stats.totalEarnings / 1000).toFixed(0)}k</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Award size={16} />
              <span className="text-xs text-gray-200">Rating</span>
            </div>
            <p className="text-2xl font-bold">{stats.rating} ⭐</p>
          </div>
        </div>
      </div>

      {/* Create Trip CTA */}
      <div className="px-6 -mt-6">
        <button
          onClick={() => setShowCreateTrip(true)}
          className="w-full bg-gradient-to-r from-[#3A0A21] to-[#5A1A31] text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-xl transition-all shadow-lg"
        >
          <Plus size={24} />
          <span className="font-semibold">Create New Trip</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="px-6 mt-6">
        <div className="flex gap-2 bg-white rounded-2xl p-1 shadow-sm">
          {['overview', 'trips', 'requests'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'bg-[#3A0A21] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6 mt-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Active Deliveries */}
            {activeDeliveries.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-3">Active Deliveries</h2>
                {activeDeliveries.map((delivery) => (
                  <div key={delivery.id} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#3A0A21] rounded-full flex items-center justify-center">
                          <User size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{delivery.sender}</p>
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <Navigation size={12} />
                            In Transit
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#3A0A21]">{delivery.progress}%</p>
                        <p className="text-xs text-gray-500">{delivery.estimatedArrival}</p>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className="bg-gradient-to-r from-[#3A0A21] to-[#5A1A31] h-2 rounded-full transition-all"
                        style={{ width: `${delivery.progress}%` }}
                      />
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Pickup</p>
                          <p className="text-sm text-gray-800">{delivery.pickup}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-red-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Dropoff</p>
                          <p className="text-sm text-gray-800">{delivery.dropoff}</p>
                        </div>
                      </div>
                    </div>

                    <button className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                      View on Map
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Requests */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3">Recent Requests</h2>
              {deliveryRequests.slice(0, 2).map((request) => (
                <div key={request.id} className="bg-white rounded-2xl p-4 shadow-sm mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{request.sender}</p>
                        <p className="text-xs text-gray-500">{request.packageSize} Package</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#3A0A21]">₦{request.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{request.distance}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-green-600 mt-1 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{request.pickup}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-red-600 mt-1 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{request.dropoff}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleDeclineRequest(request.id)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="flex-1 bg-[#3A0A21] text-white py-2 rounded-xl font-medium hover:bg-[#4A1231] transition-colors"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Trips Tab */}
        {activeTab === 'trips' && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-800">My Trips</h2>
            {myTrips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-800">{trip.route}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar size={14} className="text-gray-500" />
                      <p className="text-sm text-gray-600">{trip.date}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    trip.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {trip.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Requests</p>
                    <p className="text-lg font-bold text-gray-800">{trip.requests}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Accepted</p>
                    <p className="text-lg font-bold text-gray-800">{trip.accepted}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Earning</p>
                    <p className="text-lg font-bold text-[#3A0A21]">₦{trip.earning.toLocaleString()}</p>
                  </div>
                </div>

                <button className="w-full mt-3 bg-gray-100 text-gray-800 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">All Requests</h2>
              <span className="bg-[#3A0A21] text-white px-3 py-1 rounded-full text-xs font-medium">
                {deliveryRequests.length} New
              </span>
            </div>
            {deliveryRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <User size={24} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{request.sender}</p>
                      <p className="text-xs text-gray-500">{request.packageSize} Package • {request.distance}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#3A0A21]">₦{request.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Estimated</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Pickup</p>
                      <p className="text-sm text-gray-800">{request.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Dropoff</p>
                      <p className="text-sm text-gray-800">{request.dropoff}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeclineRequest(request.id)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
                    Decline
                  </button>
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="flex-1 bg-[#3A0A21] text-white py-3 rounded-xl font-medium hover:bg-[#4A1231] transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Trip Modal */}
      {showCreateTrip && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 mx-48 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create New Trip</h2>
              <button
                onClick={() => setShowCreateTrip(false)}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup City
                </label>
                <input
                  type="text"
                  placeholder="e.g., Lagos"
                  value={tripForm.pickupCity}
                  onChange={(e) => setTripForm({ ...tripForm, pickupCity: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#3A0A21] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination City
                </label>
                <input
                  type="text"
                  placeholder="e.g., Abuja"
                  value={tripForm.destinationCity}
                  onChange={(e) => setTripForm({ ...tripForm, destinationCity: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#3A0A21] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  When are you traveling?
                </label>
                <div className="flex gap-2">
                  {['today', 'tomorrow', 'next week'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setTripForm({ ...tripForm, date: option })}
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium capitalize transition-all ${
                        tripForm.date === option
                          ? 'bg-[#3A0A21] text-white shadow-md'
                          : 'border-2 border-gray-200 text-gray-700 hover:border-[#3A0A21]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per KM (₦)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 50"
                  value={tripForm.pricePerKm}
                  onChange={(e) => setTripForm({ ...tripForm, pricePerKm: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#3A0A21] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Space
                </label>
                <select
                  value={tripForm.availableSpace}
                  onChange={(e) => setTripForm({ ...tripForm, availableSpace: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#3A0A21] transition-colors"
                >
                  <option value="">Select space</option>
                  <option value="small">Small (1-2 packages)</option>
                  <option value="medium">Medium (3-5 packages)</option>
                  <option value="large">Large (5+ packages)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  placeholder="Any special conditions or notes..."
                  value={tripForm.notes}
                  onChange={(e) => setTripForm({ ...tripForm, notes: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#3A0A21] transition-colors h-24 resize-none"
                />
              </div>

              <button
                onClick={handleCreateTrip}
                className="w-full bg-gradient-to-r from-[#3A0A21] to-[#5A1A31] text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all mt-6"
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