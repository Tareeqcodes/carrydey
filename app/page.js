'use client'
import React, { useState, useEffect } from 'react';
import { Package, Plane, Wallet, User, Plus, ArrowLeft, MapPin, Calendar, Clock, CreditCard, History, Settings, LogOut, Bell, Search, Filter, Star, MessageCircle, Phone, CheckCircle, XCircle, TrendingUp, Eye, Edit } from 'lucide-react';

const Sendr = () => {
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState('sender'); // 'sender' or 'traveler'
  const [walletBalance, setWalletBalance] = useState(2500.75);
  const [notifications, setNotifications] = useState(3);

  // Sample data
  const [packages] = useState([
    {
      id: 1,
      title: 'Electronics Package',
      from: 'Lagos, Nigeria',
      to: 'Abuja, Nigeria',
      size: 'Medium',
      weight: '2.5kg',
      reward: '₦15,000',
      deadline: '2025-06-15',
      status: 'active',
      description: 'Laptop and accessories for business meeting',
      sender: 'John Doe',
      rating: 4.8
    },
    {
      id: 2,
      title: 'Documents & Books',
      from: 'Abuja, Nigeria',
      to: 'Port Harcourt, Nigeria',
      size: 'Small',
      weight: '1.0kg',
      reward: '₦8,000',
      deadline: '2025-06-18',
      status: 'active',
      description: 'Important business documents',
      sender: 'Sarah Ahmed',
      rating: 4.9
    }
  ]);

  const [trips] = useState([
    {
      id: 1,
      from: 'Lagos, Nigeria',
      to: 'Abuja, Nigeria',
      date: '2025-06-14',
      time: '09:00 AM',
      capacity: '15kg',
      available: '12kg',
      traveler: 'Mike Johnson',
      rating: 4.7,
      transport: 'Flight',
      price: '₦5,000/kg'
    },
    {
      id: 2,
      from: 'Abuja, Nigeria',
      to: 'Port Harcourt, Nigeria',
      date: '2025-06-17',
      time: '02:00 PM',
      capacity: '20kg',
      available: '18kg',
      traveler: 'Grace Okafor',
      rating: 4.9,
      transport: 'Road',
      price: '₦3,000/kg'
    }
  ]);

  const [transactions] = useState([
    { id: 1, type: 'credit', amount: 15000, description: 'Package delivery completed', date: '2025-06-10', status: 'completed' },
    { id: 2, type: 'debit', amount: 5000, description: 'Travel booking payment', date: '2025-06-08', status: 'completed' },
    { id: 3, type: 'credit', amount: 10000, description: 'Wallet top-up', date: '2025-06-05', status: 'completed' },
    { id: 4, type: 'debit', amount: 2500, description: 'Service fee', date: '2025-06-03', status: 'completed' }
  ]);

  useEffect(() => {
    // Simulate user login after onboarding
    if (currentScreen !== 'onboarding') {
      setUser({ name: 'Alex Johnson', email: 'alex@example.com', phone: '+234 901 234 5678' });
    }
  }, [currentScreen]);

  // Onboarding Screen
  const OnboardingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
            <Package size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold">Sendr</h1>
          <p className="text-lg text-white/90">Connect senders with travelers for seamless package delivery across Nigeria</p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <Package size={24} className="text-blue-200" />
              <span>Send packages safely</span>
            </div>
            <div className="flex items-center space-x-3">
              <Plane size={24} className="text-green-200" />
              <span>Travel and earn money</span>
            </div>
            <div className="flex items-center space-x-3">
              <Wallet size={24} className="text-yellow-200" />
              <span>Secure payments</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => { setUserType('sender'); setCurrentScreen('dashboard'); }}
              className="w-full bg-white text-blue-600 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-colors"
            >
              I want to send packages
            </button>
            <button 
              onClick={() => { setUserType('traveler'); setCurrentScreen('dashboard'); }}
              className="w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white py-4 rounded-2xl font-semibold hover:bg-white/30 transition-colors"
            >
              I'm a traveler
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Dashboard Screen
  const DashboardScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dashboard" />
      
      <div className="p-4 space-y-6">
        {/* Wallet Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100">Wallet Balance</p>
              <h2 className="text-3xl font-bold">₦{walletBalance.toLocaleString()}</h2>
            </div>
            <Wallet size={32} className="text-blue-200" />
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setCurrentScreen('wallet')}
              className="flex-1 bg-white/20 backdrop-blur-sm py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              Manage Wallet
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active {userType === 'sender' ? 'Packages' : 'Trips'}</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              {userType === 'sender' ? <Package size={24} className="text-blue-500" /> : <Plane size={24} className="text-green-500" />}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">This Month</p>
                <p className="text-2xl font-bold text-gray-900">₦45k</p>
              </div>
              <TrendingUp size={24} className="text-green-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setCurrentScreen(userType === 'sender' ? 'package-listing' : 'trip-listing')}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-center space-y-2">
                <Plus size={24} className="text-blue-500 mx-auto" />
                <p className="font-medium">{userType === 'sender' ? 'Post Package' : 'Post Trip'}</p>
              </div>
            </button>
            <button 
              onClick={() => setCurrentScreen('matches')}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-center space-y-2">
                <Search size={24} className="text-green-500 mx-auto" />
                <p className="font-medium">Find {userType === 'sender' ? 'Travelers' : 'Packages'}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-green-500" />
                  <div>
                    <p className="font-medium">Package delivered successfully</p>
                    <p className="text-sm text-gray-600">Lagos → Abuja • 2 hours ago</p>
                  </div>
                </div>
                <span className="text-green-600 font-semibold">+₦15,000</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock size={20} className="text-blue-500" />
                  <div>
                    <p className="font-medium">New match found</p>
                    <p className="text-sm text-gray-600">Electronics package • 1 day ago</p>
                  </div>
                </div>
                <Eye size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );

  // Package Listing Screen
  const PackageListingScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <Header title="Post Package" showBack />
      
      <div className="p-4 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Package Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Title</label>
              <input 
                type="text" 
                placeholder="e.g., Electronics Package"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                placeholder="Describe your package contents"
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input 
                  type="number" 
                  placeholder="2.5"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
              <div className="relative">
                <MapPin size={20} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Enter pickup address"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Location</label>
              <div className="relative">
                <MapPin size={20} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Enter delivery address"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                <div className="relative">
                  <Calendar size={20} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="date" 
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reward (₦)</label>
                <input 
                  type="number" 
                  placeholder="15000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-blue-700 transition-colors">
            Post Package
          </button>
        </div>
      </div>
    </div>
  );

  // Trip Listing Screen
  const TripListingScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <Header title="Post Trip" showBack />
      
      <div className="p-4 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Trip Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <div className="relative">
                <MapPin size={20} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Departure city"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <div className="relative">
                <MapPin size={20} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Destination city"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date</label>
                <div className="relative">
                  <Calendar size={20} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="date" 
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <div className="relative">
                  <Clock size={20} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="time" 
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transport Mode</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Flight</option>
                <option>Road (Car/Bus)</option>
                <option>Train</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Capacity (kg)</label>
                <input 
                  type="number" 
                  placeholder="20"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per kg (₦)</label>
                <input 
                  type="number" 
                  placeholder="3000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea 
                placeholder="Any special instructions or requirements"
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-green-700 transition-colors">
            Post Trip
          </button>
        </div>
      </div>
    </div>
  );

  // Matches Screen
  const MatchesScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <Header title={userType === 'sender' ? 'Find Travelers' : 'Find Packages'} showBack />
      
      <div className="p-4 space-y-4">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder={`Search ${userType === 'sender' ? 'travelers' : 'packages'}...`}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Results */}
        <div className="space-y-3">
          {userType === 'sender' ? trips.map(trip => (
            <div key={trip.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{trip.from} → {trip.to}</h3>
                  <p className="text-gray-600">{trip.traveler}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{trip.price}</p>
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{trip.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  {trip.date}
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  {trip.time}
                </div>
                <div className="flex items-center">
                  <Package size={16} className="mr-2" />
                  {trip.available} available
                </div>
                <div className="flex items-center">
                  <Plane size={16} className="mr-2" />
                  {trip.transport}
                </div>
              </div>
              
              <button 
                onClick={() => setCurrentScreen('detail')}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
            </div>
          )) : packages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{pkg.title}</h3>
                  <p className="text-gray-600">{pkg.sender}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{pkg.reward}</p>
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{pkg.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  {pkg.from}
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  {pkg.to}
                </div>
                <div className="flex items-center">
                  <Package size={16} className="mr-2" />
                  {pkg.size} • {pkg.weight}
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  By {pkg.deadline}
                </div>
              </div>
              
              <button 
                onClick={() => setCurrentScreen('detail')}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );

  // Detail Screen
  const DetailScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <Header title="Details" showBack />
      
      <div className="p-4 space-y-6">
        {/* Main Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">Electronics Package</h2>
              <p className="text-gray-600">Posted by John Doe</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">₦15,000</p>
              <div className="flex items-center">
                <Star size={16} className="text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600 ml-1">4.8 (127 reviews)</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">Laptop and accessories for business meeting. Handle with care - fragile electronics inside.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Size & Weight</h4>
                <p className="text-gray-600">Medium • 2.5kg</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Deadline</h4>
                <p className="text-gray-600">June 15, 2025</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Route</h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Lagos, Nigeria</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Abuja, Nigeria</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Contact Sender</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              <MessageCircle size={20} />
              <span>Message</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
              <Phone size={20} />
              <span>Call</span>
            </button>
          </div>
        </div>
        
        {/* Accept/Decline */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
            Decline
          </button>
          <button className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Accept Request
          </button>
        </div>
      </div>
    </div>
  );

  // Wallet Screen
  const WalletScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <Header title="Wallet" showBack />
      
      <div className="p-4 space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="text-center space-y-2 mb-6">
            <p className="text-blue-100">Available Balance</p>
            <h2 className="text-4xl font-bold">₦{walletBalance.toLocaleString()}</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white/20 backdrop-blur-sm py-3 rounded-lg font-medium hover:bg-white/30 transition-colors">
              Top Up
            </button>
            <button className="bg-white/20 backdrop-blur-sm py-3 rounded-lg font-medium hover:bg-white/30 transition-colors">
              Withdraw
            </button>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-4">
            <button className="text-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <CreditCard size={24} className="text-blue-500 mx-auto" />
              <span className="text-sm font-medium">Add Card</span>
            </button>
            <button className="text-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <History size={24} className="text-green-500 mx-auto" />
              <span className="text-sm font-medium">History</span>
            </button>
            <button className="text-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings size={24} className="text-gray-500 mx-auto" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>
        </div>
        
        {/* Transaction History */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Recent Transactions</h3>
            <button className="text-blue-600 text-sm font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            {transactions.slice(0, 5).map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'credit' ? 
                      <TrendingUp size={16} className="text-green-600" /> : 
                      <TrendingUp size={16} className="text-red-600 rotate-180" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-gray-600">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 capitalize">{transaction.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Settings Screen  
  const SettingsScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <Header title="Settings" showBack />
      
      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user?.name}</h3>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500">{user?.phone}</p>
            </div>
          </div>
          <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Edit Profile
          </button>
        </div>
        
        {/* Settings Options */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="divide-y divide-gray-100">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Bell size={20} className="text-gray-600" />
                <span className="font-medium">Notifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Enabled</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <CreditCard size={20} className="text-gray-600" />
                <span className="font-medium">Payment Methods</span>
              </div>
              <span className="text-sm text-gray-600">2 cards</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Settings size={20} className="text-gray-600" />
                <span className="font-medium">Account Settings</span>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <MessageCircle size={20} className="text-gray-600" />
                <span className="font-medium">Help & Support</span>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <User size={20} className="text-gray-600" />
                <span className="font-medium">Privacy Policy</span>
              </div>
            </button>
          </div>
        </div>
        
        {/* User Type Switch */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Account Type</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setUserType('sender')}
              className={`p-3 rounded-lg font-medium transition-colors ${
                userType === 'sender' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sender
            </button>
            <button 
              onClick={() => setUserType('traveler')}
              className={`p-3 rounded-lg font-medium transition-colors ${
                userType === 'traveler' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Traveler
            </button>
          </div>
        </div>
        
        {/* Logout */}
        <button 
          onClick={() => setCurrentScreen('onboarding')}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  // Header Component
  const Header = ({ title, showBack = false }) => (
    <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center space-x-4">
      {showBack && (
        <button 
          onClick={() => setCurrentScreen('dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
      )}
      <h1 className="text-xl font-semibold flex-1">{title}</h1>
      {notifications > 0 && (
        <div className="relative">
          <Bell size={24} className="text-gray-600" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-medium">{notifications}</span>
          </div>
        </div>
      )}
    </div>
  );

  // Bottom Navigation Component
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        <button 
          onClick={() => setCurrentScreen('dashboard')}
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
            currentScreen === 'dashboard' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <div className="relative">
            {currentScreen === 'dashboard' && <div className="absolute inset-0 bg-blue-100 rounded-lg"></div>}
            <User size={24} className="relative z-10" />
          </div>
          <span className="text-xs font-medium">Home</span>
        </button>
        
        <button 
          onClick={() => setCurrentScreen('matches')}
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
            currentScreen === 'matches' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <div className="relative">
            {currentScreen === 'matches' && <div className="absolute inset-0 bg-blue-100 rounded-lg"></div>}
            <Search size={24} className="relative z-10" />
          </div>
          <span className="text-xs font-medium">Search</span>
        </button>
        
        <button 
          onClick={() => setCurrentScreen(userType === 'sender' ? 'package-listing' : 'trip-listing')}
          className="flex flex-col items-center space-y-1 p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Plus size={24} />
          <span className="text-xs font-medium">Post</span>
        </button>
        
        <button 
          onClick={() => setCurrentScreen('wallet')}
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
            currentScreen === 'wallet' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <div className="relative">
            {currentScreen === 'wallet' && <div className="absolute inset-0 bg-blue-100 rounded-lg"></div>}
            <Wallet size={24} className="relative z-10" />
          </div>
          <span className="text-xs font-medium">Wallet</span>
        </button>
        
        <button 
          onClick={() => setCurrentScreen('settings')}
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
            currentScreen === 'settings' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <div className="relative">
            {currentScreen === 'settings' && <div className="absolute inset-0 bg-blue-100 rounded-lg"></div>}
            <Settings size={24} className="relative z-10" />
          </div>
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>
    </div>
  );

  // Main render logic
  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'package-listing':
        return <PackageListingScreen />;
      case 'trip-listing':
        return <TripListingScreen />;
      case 'matches':
        return <MatchesScreen />;
      case 'detail':
        return <DetailScreen />;
      case 'wallet':
        return <WalletScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {renderScreen()}
    </div>
  );
};

export default Sendr;