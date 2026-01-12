'use client';
import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  X,
  Star,
  MoreVertical,
  Map,
} from 'lucide-react';

export default function Trackdelivery() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateTrip, setShowCreateTrip] = useState(false);
  const [tripForm, setTripForm] = useState({
    pickupCity: '',
    destinationCity: '',
    date: 'today',
    pricePerKm: '',
    availableSpace: '',
    notes: '',
  });

  const [myTrips] = useState([
    {
      id: 1,
      route: 'Lagos → Abuja',
      date: 'Dec 12, 2025',
      status: 'active',
      requests: 3,
      accepted: 1,
      earning: 12000,
      progress: 65,
      driver: 'You',
      vehicle: 'Toyota Camry',
    },
    {
      id: 2,
      route: 'Abuja → Port Harcourt',
      date: 'Dec 15, 2025',
      status: 'scheduled',
      requests: 0,
      accepted: 0,
      earning: 0,
      progress: 0,
      driver: 'You',
      vehicle: 'Toyota Camry',
    },
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
      status: 'pending',
      rating: 4.8,
      urgency: 'High',
    },
    {
      id: 2,
      sender: 'Sarah Ahmed',
      pickup: 'Victoria Island, Lagos',
      dropoff: 'Garki, Abuja',
      distance: '755 km',
      price: 11500,
      packageSize: 'Small',
      status: 'pending',
      rating: 4.9,
      urgency: 'Medium',
    },
  ]);

  const [activeDeliveries] = useState([
    {
      id: 1,
      sender: 'Mike Johnson',
      pickup: 'Surulere, Lagos',
      dropoff: 'Maitama, Abuja',
      progress: 65,
      status: 'in-transit',
      estimatedArrival: '2 hours',
      currentLocation: 'Kogi State',
      packageCount: 3,
    },
  ]);

  const handleCreateTrip = () => {
    if (
      tripForm.pickupCity &&
      tripForm.destinationCity &&
      tripForm.pricePerKm
    ) {
      console.log('Trip created:', tripForm);
      setShowCreateTrip(false);
      setTripForm({
        pickupCity: '',
        destinationCity: '',
        date: 'today',
        pricePerKm: '',
        availableSpace: '',
        notes: '',
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
    <div className="min-h-screen pt-0 pb-20 md:py-20 bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => setShowCreateTrip(true)}
                className="w-full bg-gradient-to-r from-[#3A0A21] to-[#5A1A31] text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <Plus size={20} />
                <span className="font-medium">Create Trip</span>
              </button>

              <button className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl flex items-center justify-center gap-2 hover:border-[#3A0A21] transition-colors">
                <Map size={20} />
                <span className="font-medium">View Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
            <div className="flex gap-1">
              {['overview', 'trips', 'requests', 'earnings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-[#3A0A21] to-[#5A1A31] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Active Delivery Status */}
          {activeTab === 'overview' && activeDeliveries.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Active Delivery
                </h2>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  In Transit
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Route Progress</span>
                  <span className="text-lg font-bold text-[#3A0A21]">
                    {activeDeliveries[0].progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#3A0A21] to-[#5A1A31] rounded-full transition-all duration-500"
                    style={{ width: `${activeDeliveries[0].progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Pickup</span>
                  <span>{activeDeliveries[0].currentLocation}</span>
                  <span>Dropoff</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <MapPin size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-medium text-gray-900">
                        {activeDeliveries[0].pickup}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <MapPin size={20} className="text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">To</p>
                      <p className="font-medium text-gray-900">
                        {activeDeliveries[0].dropoff}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:border-[#3A0A21] transition-colors">
                  View Details
                </button>
                <button className="flex-1 bg-gradient-to-r from-[#3A0A21] to-[#5A1A31] text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all">
                  Update Status
                </button>
              </div>
            </div>
          )}

          {/* Delivery Requests */}
          {activeTab === 'requests' ? (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {activeTab === 'overview'
                    ? 'Available Requests'
                    : 'All Requests'}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="bg-[#3A0A21] text-white px-3 py-1 rounded-full text-xs font-medium">
                    {deliveryRequests.length} New
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {deliveryRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border border-gray-100 rounded-xl hover:border-[#3A0A21]/20 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                          <User size={24} className="text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {request.sender}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star
                                size={12}
                                className="text-amber-400 fill-current"
                              />
                              <span className="text-xs text-gray-600">
                                {request.rating}
                              </span>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                              {request.packageSize}
                            </span>
                            {request.urgency === 'High' && (
                              <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-600">
                                {request.urgency}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#3A0A21]">
                          ₦{request.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {request.distance}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Pickup</p>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <p className="text-sm font-medium text-gray-900">
                            {request.pickup}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Dropoff</p>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <p className="text-sm font-medium text-gray-900">
                            {request.dropoff}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDeclineRequest(request.id)}
                        className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:border-red-300 hover:text-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle size={18} />
                        Decline
                      </button>
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="flex-1 bg-gradient-to-r from-[#3A0A21] to-[#5A1A31] text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} />
                        Accept Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* My Trips */}
          {activeTab === 'trips' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">My Trips</h2>
                  <button className="text-sm text-[#3A0A21] font-medium hover:underline">
                    View History
                  </button>
                </div>

                <div className="space-y-4">
                  {myTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="p-4 border border-gray-100 rounded-xl hover:border-[#3A0A21]/20 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {trip.route}
                          </h3>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="flex items-center gap-1 text-sm text-gray-600">
                              <Calendar size={14} />
                              {trip.date}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                trip.status === 'active'
                                  ? 'bg-green-50 text-green-700'
                                  : 'bg-blue-50 text-blue-700'
                              }`}
                            >
                              {trip.status}
                            </span>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical size={20} className="text-gray-500" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Requests</p>
                          <p className="text-lg font-bold text-gray-900">
                            {trip.requests}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Accepted</p>
                          <p className="text-lg font-bold text-gray-900">
                            {trip.accepted}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Earning</p>
                          <p className="text-lg font-bold text-[#3A0A21]">
                            ₦{trip.earning.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {trip.progress > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Trip Progress</span>
                            <span>{trip.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#3A0A21] to-[#5A1A31] rounded-full"
                              style={{ width: `${trip.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <button className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:border-[#3A0A21] transition-colors">
                        Manage Trip
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Create Trip Modal */}
      {showCreateTrip && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Trip
              </h2>
              <button
                onClick={() => setShowCreateTrip(false)}
                className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Lagos"
                    value={tripForm.pickupCity}
                    onChange={(e) =>
                      setTripForm({ ...tripForm, pickupCity: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#3A0A21] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Abuja"
                    value={tripForm.destinationCity}
                    onChange={(e) =>
                      setTripForm({
                        ...tripForm,
                        destinationCity: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#3A0A21] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Date
                </label>
                <div className="flex gap-2">
                  {['today', 'tomorrow', 'next week'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setTripForm({ ...tripForm, date: option })}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium capitalize transition-all ${
                        tripForm.date === option
                          ? 'bg-gradient-to-r from-[#3A0A21] to-[#5A1A31] text-white shadow-sm'
                          : 'border border-gray-200 text-gray-700 hover:border-[#3A0A21]'
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
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₦
                  </span>
                  <input
                    type="number"
                    placeholder="50"
                    value={tripForm.pricePerKm}
                    onChange={(e) =>
                      setTripForm({ ...tripForm, pricePerKm: e.target.value })
                    }
                    className="w-full pl-8 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#3A0A21] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Space
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Small', 'Medium', 'Large'].map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        setTripForm({
                          ...tripForm,
                          availableSpace: size.toLowerCase(),
                        })
                      }
                      className={`py-3 rounded-xl text-sm font-medium transition-all ${
                        tripForm.availableSpace === size.toLowerCase()
                          ? 'bg-gradient-to-r from-[#3A0A21] to-[#5A1A31] text-white'
                          : 'border border-gray-200 text-gray-700 hover:border-[#3A0A21]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  placeholder="Any special conditions or notes for senders..."
                  value={tripForm.notes}
                  onChange={(e) =>
                    setTripForm({ ...tripForm, notes: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#3A0A21] transition-colors h-32 resize-none"
                />
              </div>

              <button
                onClick={handleCreateTrip}
                className="w-full bg-gradient-to-r from-[#3A0A21] to-[#5A1A31] text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all mt-2"
              >
                Create Trip & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
