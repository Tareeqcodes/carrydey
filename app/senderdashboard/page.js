'use client';
import React, { useState } from 'react';
import { MapPin, Package, Clock, Star, MessageCircle, History, User, ChevronRight, Check, Navigation, DollarSign, Calendar } from 'lucide-react';

const CarrydeySenderDashboard = () => {
  const [step, setStep] = useState(1);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [pickupOTP, setPickupOTP] = useState('');
  const [deliveryOTP, setDeliveryOTP] = useState('');

  // Mock data
  const estimatedDistance = 12.5;
  const estimatedPrice = 2500;
  const estimatedTime = '45-60 mins';

  const availableTravelers = [
    { id: 1, name: 'John Doe', rating: 4.8, trips: 156, price: 2500, vehicle: 'Toyota Camry', eta: '15 mins', distance: 0.5, avatar: 'JD' },
    { id: 2, name: 'Sarah Adams', rating: 4.9, trips: 203, price: 2300, vehicle: 'Honda Accord', eta: '20 mins', distance: 0.8, avatar: 'SA' },
    { id: 3, name: 'Mike Wilson', rating: 4.7, trips: 124, price: 2700, vehicle: 'Nissan Altima', eta: '25 mins', distance: 1.0, avatar: 'MW' },
  ];

  const bookingHistory = [
    { id: 'CD001', date: '2024-11-28', pickup: 'Wuse 2, Abuja', dropoff: 'Maitama, Abuja', status: 'Delivered', price: 2500 },
    { id: 'CD002', date: '2024-11-25', pickup: 'Garki, Abuja', dropoff: 'Asokoro, Abuja', status: 'Delivered', price: 3000 },
  ];

  const handleBookTraveler = (traveler) => {
    setSelectedTraveler(traveler);
    setBookingConfirmed(true);
    // Generate random 4-digit OTP
    setPickupOTP(Math.floor(1000 + Math.random() * 9000).toString());
    setDeliveryOTP(Math.floor(1000 + Math.random() * 9000).toString());
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 px-4">
      {[1, 2, 3, 4].map((num) => (
        <React.Fragment key={num}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= num ? 'bg-[#3A0A21] text-white' : 'bg-gray-200 text-gray-500'}`}>
            {step > num ? <Check size={20} /> : num}
          </div>
          {num < 4 && <div className={`h-1 w-12 mx-2 ${step > num ? 'bg-[#3A0A21]' : 'bg-gray-200'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Enter Pickup Location</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="relative">
          <MapPin className="absolute left-4 top-4 text-[#3A0A21]" size={20} />
          <input
            type="text"
            placeholder="Search pickup location or tap on map"
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#3A0A21] focus:outline-none"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
          />
        </div>
        <div className="mt-4 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Navigation size={48} className="mx-auto mb-2 text-[#3A0A21]" />
            <p>Interactive map view</p>
            <p className="text-sm">Tap to select pickup location</p>
          </div>
        </div>
      </div>
      <button
        onClick={() => pickupLocation && setStep(2)}
        disabled={!pickupLocation}
        className="w-full py-4 bg-[#3A0A21] text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition"
      >
        Continue to Dropoff
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Enter Dropoff Location</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100">
          <div className="w-3 h-3 rounded-full bg-[#3A0A21]"></div>
          <span className="text-sm text-gray-600">{pickupLocation}</span>
        </div>
        <div className="relative">
          <MapPin className="absolute left-4 top-4 text-red-500" size={20} />
          <input
            type="text"
            placeholder="Enter dropoff location"
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#3A0A21] focus:outline-none"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
          />
        </div>
      </div>
      <button
        onClick={() => dropoffLocation && setStep(3)}
        disabled={!dropoffLocation}
        className="w-full py-4 bg-[#3A0A21] text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition"
      >
        Calculate Delivery
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Delivery Estimate</h2>
      <div className="bg-gradient-to-br from-[#3A0A21] to-[#5A1A31] rounded-2xl shadow-lg p-6 text-white">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <Navigation size={24} className="mx-auto mb-2 opacity-80" />
            <p className="text-2xl font-bold">{estimatedDistance} km</p>
            <p className="text-sm opacity-80">Distance</p>
          </div>
          <div className="text-center">
            <Clock size={24} className="mx-auto mb-2 opacity-80" />
            <p className="text-2xl font-bold">{estimatedTime}</p>
            <p className="text-sm opacity-80">Est. Time</p>
          </div>
          <div className="text-center">
            <DollarSign size={24} className="mx-auto mb-2 opacity-80" />
            <p className="text-2xl font-bold">₦{estimatedPrice}</p>
            <p className="text-sm opacity-80">Est. Price</p>
          </div>
        </div>
        <div className="pt-4 border-t border-white border-opacity-20">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="opacity-80">From:</span>
            <span className="font-semibold">{pickupLocation}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="opacity-80">To:</span>
            <span className="font-semibold">{dropoffLocation}</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => setStep(4)}
        className="w-full py-4 bg-[#3A0A21] text-white rounded-xl font-semibold hover:bg-opacity-90 transition"
      >
        Find Available Travelers
      </button>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Available Travelers</h2>
      <p className="text-sm text-gray-600">Travelers heading your way (within 1km)</p>
      <div className="space-y-3">
        {availableTravelers.map((traveler) => (
          <div key={traveler.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-[#3A0A21] text-white flex items-center justify-center font-bold text-lg">
                  {traveler.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{traveler.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span>{traveler.rating}</span>
                    <span>•</span>
                    <span>{traveler.trips} trips</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{traveler.vehicle}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-[#3A0A21]">₦{traveler.price}</p>
                <p className="text-xs text-gray-500">{traveler.distance}km away</p>
                <p className="text-xs text-gray-500">ETA: {traveler.eta}</p>
              </div>
            </div>
            <button
              onClick={() => handleBookTraveler(traveler)}
              className="w-full mt-4 py-3 bg-[#3A0A21] text-white rounded-xl font-semibold hover:bg-opacity-90 transition"
            >
              Book Traveler
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBookingConfirmation = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">Your traveler is on the way</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Traveler Details</h3>
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-[#3A0A21] text-white flex items-center justify-center font-bold text-xl">
            {selectedTraveler?.avatar}
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{selectedTraveler?.name}</h4>
            <p className="text-sm text-gray-600">{selectedTraveler?.vehicle}</p>
            <div className="flex items-center space-x-1 mt-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{selectedTraveler?.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Delivery OTP Codes</h3>
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-2">Pickup OTP (share with traveler)</p>
            <p className="text-3xl font-bold text-[#3A0A21] tracking-wider">{pickupOTP}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-2">Delivery OTP (share with receiver)</p>
            <p className="text-3xl font-bold text-[#3A0A21] tracking-wider">{deliveryOTP}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Live Tracking</h3>
        <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Navigation size={48} className="mx-auto mb-2 text-[#3A0A21] animate-pulse" />
            <p>Traveler en route to pickup</p>
            <p className="text-sm mt-2">ETA: {selectedTraveler?.eta}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="py-3 border-2 border-[#3A0A21] text-[#3A0A21] rounded-xl font-semibold hover:bg-[#3A0A21] hover:text-white transition flex items-center justify-center space-x-2">
          <MessageCircle size={20} />
          <span>Message</span>
        </button>
        <button
          onClick={() => {
            setBookingConfirmed(false);
            setStep(1);
            setPickupLocation('');
            setDropoffLocation('');
            setSelectedTraveler(null);
          }}
          className="py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          New Delivery
        </button>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Delivery History</h2>
      <div className="space-y-3">
        {bookingHistory.map((booking) => (
          <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-800">{booking.id}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                booking.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {booking.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#3A0A21] mt-1"></div>
                <div>
                  <p className="text-gray-600">Pickup</p>
                  <p className="font-medium text-gray-800">{booking.pickup}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin size={12} className="text-red-500 mt-1" />
                <div>
                  <p className="text-gray-600">Dropoff</p>
                  <p className="font-medium text-gray-800">{booking.dropoff}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-600">{booking.date}</span>
              <span className="font-bold text-[#3A0A21]">₦{booking.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-[#3A0A21] text-white flex items-center justify-center font-bold text-2xl">
            AU
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-800">Abuja User</h3>
            <p className="text-gray-600">user@carrydey.com</p>
            <div className="flex items-center space-x-1 mt-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">4.9</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-700">Phone</span>
            <span className="font-semibold">+234 800 000 0000</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-700">Total Deliveries</span>
            <span className="font-semibold">24</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-700">Member Since</span>
            <span className="font-semibold">Nov 2024</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - matches Navbar styling */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100 p-6 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#3A0A21]">Carrydey</h1>
            <p className="text-sm text-gray-600">Sender Dashboard</p>
          </div>
          <div className="w-12 h-12 bg-[#3A0A21] rounded-full flex items-center justify-center text-white font-bold">
            AU
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-6 pb-24">
        {!bookingConfirmed && activeTab === 'home' && (
          <>
            {renderStepIndicator()}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </>
        )}
        {bookingConfirmed && activeTab === 'home' && renderBookingConfirmation()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'profile' && renderProfile()}
      </div>

      {/* Bottom Navigation - matches traveler dashboard style */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-[#3A0A21]' : 'text-gray-400'}`}
          >
            <Package size={24} />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'history' ? 'text-[#3A0A21]' : 'text-gray-400'}`}
          >
            <History size={24} />
            <span className="text-xs">History</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-[#3A0A21]' : 'text-gray-400'}`}
          >
            <User size={24} />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarrydeySenderDashboard;