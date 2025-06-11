'use client'
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  MapPin, 
  User, 
  Wallet, 
  Settings, 
  Plus, 
  Search, 
  Bell, 
  Eye,
  EyeOff,
  ArrowLeft,
  Send,
  Plane,
  Calendar,
  Clock,
  DollarSign,
  Filter,
  Star,
  Check,
  X,
  ChevronRight,
  LogOut,
  Edit,
  CreditCard,
  History,
  TrendingUp,
  Users
} from 'lucide-react';

const Sendr = () => {
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [walletBalance, setWalletBalance] = useState(2500.00);
  const [activeTab, setActiveTab] = useState('packages');

  // Animation component for screen transitions
  const ScreenTransition = ({ children, show }) => (
    <div className={`transition-all duration-300 ${show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
      {children}
    </div>
  );

  // Onboarding Screen
  const OnboardingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center mb-12 animate-fade-in">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
          <Package className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Sendr</h1>
        <p className="text-lg opacity-90 leading-relaxed">
          Connect with travelers to send your packages safely across the country
        </p>
      </div>
      
      <div className="space-y-6 mb-12">
        {[
          { icon: Send, title: "Send Packages", desc: "Post your delivery needs" },
          { icon: Plane, title: "Travel & Earn", desc: "Make money while traveling" },
          { icon: Users, title: "Safe Community", desc: "Verified travelers & senders" }
        ].map((feature, idx) => (
          <div key={idx} className="flex items-center space-x-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
            <feature.icon className="w-8 h-8" />
            <div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm opacity-75">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-4 w-full max-w-sm">
        <button 
          onClick={() => setCurrentScreen('register')}
          className="w-full bg-white text-purple-600 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
        >
          Get Started
        </button>
        <button 
          onClick={() => setCurrentScreen('login')}
          className="w-full border-2 border-white/30 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
        >
          Sign In
        </button>
      </div>
    </div>
  );

  // Registration Screen
  const RegisterScreen = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <button 
          onClick={() => setCurrentScreen('onboarding')}
          className="mb-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-600 mb-8">Join the Sendr community today</p>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                  placeholder="Create a password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <button 
              type="button"
              onClick={() => {
                setUser({ name: 'John Doe', email: 'john@example.com' });
                setCurrentScreen('dashboard');
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Create Account
            </button>
          </form>
          
          <p className="text-center text-gray-600 mt-6">
            Already have an account? 
            <button 
              onClick={() => setCurrentScreen('login')}
              className="text-purple-600 font-semibold ml-1 hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  // Login Screen
  const LoginScreen = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <button 
          onClick={() => setCurrentScreen('onboarding')}
          className="mb-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-600 mb-8">Sign in to your Sendr account</p>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                  placeholder="Enter your password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <button 
              type="button"
              onClick={() => {
                setUser({ name: 'John Doe', email: 'john@example.com' });
                setCurrentScreen('dashboard');
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Sign In
            </button>
          </form>
          
          <p className="text-center text-gray-600 mt-6">
            Don't have an account? 
            <button 
              onClick={() => setCurrentScreen('register')}
              className="text-purple-600 font-semibold ml-1 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  // Dashboard Screen
  const DashboardScreen = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 pb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome back!</h1>
            <p className="opacity-90">{user?.name}</p>
          </div>
          <div className="flex space-x-3">
            <button className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Bell className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentScreen('settings')}
              className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Wallet Balance */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="opacity-90">Wallet Balance</span>
            <button 
              onClick={() => setCurrentScreen('wallet')}
              className="text-sm bg-white/20 px-3 py-1 rounded-lg"
            >
              Manage
            </button>
          </div>
          <div className="text-3xl font-bold">₦{walletBalance.toLocaleString()}</div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="p-6 -mt-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => setCurrentScreen('packageListing')}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-left"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-1">Send Package</h3>
            <p className="text-sm text-gray-600">Post delivery request</p>
          </button>
          
          <button 
            onClick={() => setCurrentScreen('tripListing')}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-left"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Plane className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-1">Post Trip</h3>
            <p className="text-sm text-gray-600">Earn while traveling</p>
          </button>
        </div>
        
        {/* Active Waybills */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Active Deliveries</h3>
            <button 
              onClick={() => setCurrentScreen('matches')}
              className="text-purple-600 text-sm font-medium"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              { id: 'WB001', from: 'Lagos', to: 'Abuja', status: 'In Transit', date: 'Today' },
              { id: 'WB002', from: 'Kano', to: 'Port Harcourt', status: 'Pending', date: 'Tomorrow' }
            ].map((waybill) => (
              <div key={waybill.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium">#{waybill.id}</div>
                  <div className="text-sm text-gray-600">{waybill.from} → {waybill.to}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm px-2 py-1 rounded-lg ${
                    waybill.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {waybill.status}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{waybill.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );

  // Package Listing Screen
  const PackageListingScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-6 border-b">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Send Package</h1>
        </div>
      </div>
      
      <div className="p-6">
        <form className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold mb-4">Package Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Type</label>
                <select className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500">
                  <option>Documents</option>
                  <option>Electronics</option>
                  <option>Clothing</option>
                  <option>Food Items</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input 
                    type="number" 
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <select className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500">
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 h-24"
                  placeholder="Brief description of your package..."
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold mb-4">Delivery Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From (Pickup Location)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter pickup address"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To (Destination)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter destination address"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
                  <input 
                    type="date" 
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget (₦)</label>
                  <input 
                    type="number" 
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="5000"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={() => setCurrentScreen('matches')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Find Travelers
          </button>
        </form>
      </div>
    </div>
  );

  // Trip Listing Screen
  const TripListingScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-6 border-b">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Post Your Trip</h1>
        </div>
      </div>
      
      <div className="p-6">
        <form className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold mb-4">Trip Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="Departure city"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="Destination city"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date</label>
                  <input 
                    type="date" 
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input 
                    type="time" 
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transportation Mode</label>
                <select className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500">
                  <option>Flight</option>
                  <option>Bus</option>
                  <option>Car</option>
                  <option>Train</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold mb-4">Package Preferences</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Weight (kg)</label>
                <input 
                  type="number" 
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder="10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Types You Accept</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Documents', 'Electronics', 'Clothing', 'Food Items'].map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per kg (₦)</label>
                <input 
                  type="number" 
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder="500"
                />
              </div>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={() => setCurrentScreen('matches')}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all"
          >
            Post Trip
          </button>
        </form>
      </div>
    </div>
  );

  // Match Results Screen
  const MatchResultsScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Matches</h1>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Filter className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'packages' 
                ? 'bg-purple-100 text-purple-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Package Requests
          </button>
          <button 
            onClick={() => setActiveTab('travelers')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'travelers' 
                ? 'bg-purple-100 text-purple-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Available Travelers
          </button>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {activeTab === 'packages' ? (
          // Package Requests
          [{
            id: 1,
            from: 'Lagos, VI',
            to: 'Abuja, Wuse',
            type: 'Documents',
            weight: '2kg',
            budget: '₦3,500',
            date: 'Jun 15',
            user: 'Sarah M.',
            rating: 4.8,
            urgent: true
          }, {
            id: 2,
            from: 'Kano, Sabon Gari',
            to: 'Port Harcourt, GRA',
            type: 'Electronics',
            weight: '5kg',
            budget: '₦8,000',
            date: 'Jun 16',
            user: 'Ahmed K.',
            rating: 4.9,
            urgent: false
          }].map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold">{pkg.from} → {pkg.to}</h3>
                    {pkg.urgent && (
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-lg">
                        Urgent
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{pkg.type}</span>
                    <span>{pkg.weight}</span>
                    <span>{pkg.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{pkg.budget}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{pkg.user}</div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">{pkg.rating}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentScreen('requestDetail')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-purple-700 transition-colors"
                >
                  Accept
                </button>
              </div>
            </div>
          ))
        ) : (
          // Available Travelers
          [{
            id: 1,
            from: 'Lagos',
            to: 'Abuja',
            date: 'Jun 15, 2:00 PM',
            mode: 'Flight',
            capacity: '10kg available',
            price: '₦500/kg',
            user: 'David O.',
            rating: 4.7,
            verified: true
          }, {
            id: 2,
            from: 'Kano',
            to: 'Port Harcourt',
            date: 'Jun 16, 8:00 AM',
            mode: 'Bus',
            capacity: '15kg available',
            price: '₦300/kg',
            user: 'Fatima A.',
            rating: 4.9,
            verified: true
          }].map((traveler) => (
            <div key={traveler.id} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{traveler.from} → {traveler.to}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{traveler.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Plane className="w-4 h-4" />
                      <span>{traveler.mode}</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">{traveler.price}</div>
                  <div className="text-sm text-gray-600">{traveler.capacity}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-medium text-sm">{traveler.user}</span>
                      {traveler.verified && (
                        <Check className="w-3 h-3 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">{traveler.rating}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentScreen('requestDetail')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Request
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );

  // Request Detail Screen
  const RequestDetailScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-6 border-b">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => setCurrentScreen('matches')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Request Details</h1>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Route Information */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold mb-4">Route Information</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-medium">Lagos, Victoria Island</div>
                <div className="text-sm text-gray-600">Pickup: 123 Ahmadu Bello Way</div>
              </div>
            </div>
            <div className="ml-1.5 w-0.5 h-8 bg-gray-300"></div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <div className="font-medium">Abuja, Wuse</div>
                <div className="text-sm text-gray-600">Delivery: 456 Aminu Kano Crescent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold mb-4">Package Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Type</div>
              <div className="font-medium">Documents</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Weight</div>
              <div className="font-medium">2kg</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Size</div>
              <div className="font-medium">Small</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Delivery Date</div>
              <div className="font-medium">June 15, 2025</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600">Description</div>
            <div className="font-medium">Important business documents for client meeting</div>
          </div>
        </div>

        {/* Sender Information */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold mb-4">Sender Information</h3>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Sarah Mohammed</div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>4.8 rating</span>
                <span>•</span>
                <span>23 completed deliveries</span>
              </div>
            </div>
            <Check className="w-5 h-5 text-green-500" />
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold mb-4">Payment Information</h3>
          <div className="flex justify-between items-center mb-2">
            <span>Delivery Fee</span>
            <span className="font-medium">₦3,500</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span>Service Fee</span>
            <span className="font-medium">₦350</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">₦3,850</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => {
              alert('Request accepted! Sender will be notified.');
              setCurrentScreen('dashboard');
            }}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all"
          >
            Accept Request
          </button>
          <button 
            onClick={() => setCurrentScreen('matches')}
            className="w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );

  // Wallet Management Screen
  const WalletScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="mr-4 p-2 bg-white/20 rounded-lg backdrop-blur-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Wallet</h1>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="text-center">
            <div className="text-sm opacity-90 mb-2">Available Balance</div>
            <div className="text-4xl font-bold mb-4">₦{walletBalance.toLocaleString()}</div>
            <div className="flex space-x-3">
              <button className="flex-1 bg-white/20 backdrop-blur-sm py-3 rounded-xl font-medium hover:bg-white/30 transition-colors">
                <Plus className="w-4 h-4 inline mr-2" />
                Top Up
              </button>
              <button className="flex-1 bg-white/20 backdrop-blur-sm py-3 rounded-xl font-medium hover:bg-white/30 transition-colors">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 -mt-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button className="bg-white p-4 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-sm font-medium">Add Card</div>
          </button>
          
          <button className="bg-white p-4 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-sm font-medium">Earnings</div>
          </button>
          
          <button className="bg-white p-4 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <History className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-sm font-medium">History</div>
          </button>
        </div>
        
        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Recent Transactions</h3>
            <button className="text-purple-600 text-sm font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            {[
              { 
                type: 'credit', 
                description: 'Package delivery payment', 
                amount: '+₦3,500', 
                date: 'Today, 2:30 PM',
                status: 'completed'
              },
              { 
                type: 'debit', 
                description: 'Wallet top-up', 
                amount: '+₦5,000', 
                date: 'Yesterday, 10:15 AM',
                status: 'completed'
              },
              { 
                type: 'debit', 
                description: 'Service fee', 
                amount: '-₦350', 
                date: 'Jun 10, 4:45 PM',
                status: 'completed'
              },
              { 
                type: 'credit', 
                description: 'Package delivery payment', 
                amount: '+₦2,800', 
                date: 'Jun 9, 1:20 PM',
                status: 'completed'
              }
            ].map((transaction, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'credit' 
                      ? 'bg-green-100' 
                      : 'bg-red-100'
                  }`}>
                    {transaction.type === 'credit' ? (
                      <TrendingUp className={`w-5 h-5 ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    ) : (
                      <DollarSign className={`w-5 h-5 ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-gray-600">{transaction.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">{transaction.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );

  // Settings Screen
  const SettingsScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-6 border-b">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </div>
      
      <div className="p-6">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{user?.name}</h3>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">4.8 rating</span>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Verified</span>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Edit className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Settings Options */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {[
            { icon: User, title: 'Profile Settings', desc: 'Update your personal information' },
            { icon: Bell, title: 'Notifications', desc: 'Manage your notification preferences' },
            { icon: Wallet, title: 'Payment Methods', desc: 'Manage cards and bank accounts' },
            { icon: Settings, title: 'Privacy & Security', desc: 'Control your privacy settings' },
            { icon: Package, title: 'Delivery Preferences', desc: 'Set your delivery preferences' },
            { icon: Star, title: 'Rate the App', desc: 'Share your feedback with us' }
          ].map((item, idx) => (
            <button 
              key={idx}
              className="w-full flex items-center space-x-4 p-6 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <item.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
        
        {/* Logout Button */}
        <button 
          onClick={() => {
            setUser(null);
            setCurrentScreen('onboarding');
          }}
          className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-semibold mt-6 hover:bg-red-100 transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
      
      <BottomNavigation />
    </div>
  );

  // Bottom Navigation Component
  const BottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <button 
          onClick={() => setCurrentScreen('dashboard')}
          className={`flex flex-col items-center space-y-1 ${
            currentScreen === 'dashboard' ? 'text-purple-600' : 'text-gray-400'
          }`}
        >
          <Package className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </button>
        
        <button 
          onClick={() => setCurrentScreen('matches')}
          className={`flex flex-col items-center space-y-1 ${
            currentScreen === 'matches' ? 'text-purple-600' : 'text-gray-400'
          }`}
        >
          <Search className="w-6 h-6" />
          <span className="text-xs">Matches</span>
        </button>
        
        <button 
          onClick={() => setCurrentScreen('wallet')}
          className={`flex flex-col items-center space-y-1 ${
            currentScreen === 'wallet' ? 'text-purple-600' : 'text-gray-400'
          }`}
        >
          <Wallet className="w-6 h-6" />
          <span className="text-xs">Wallet</span>
        </button>
        
        <button 
          onClick={() => setCurrentScreen('settings')}
          className={`flex flex-col items-center space-y-1 ${
            currentScreen === 'settings' ? 'text-purple-600' : 'text-gray-400'
          }`}
        >
          <Settings className="w-6 h-6" />
          <span className="text-xs">Settings</span>
        </button>
      </div>
    </div>
  );

  // Main render function
  const renderScreen = () => {
    switch(currentScreen) {
      case 'onboarding':
        return <OnboardingScreen />;
      case 'register':
        return <RegisterScreen />;
      case 'login':
        return <LoginScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'packageListing':
        return <PackageListingScreen />;
      case 'tripListing':
        return <TripListingScreen />;
      case 'matches':
        return <MatchResultsScreen />;
      case 'requestDetail':
        return <RequestDetailScreen />;
      case 'wallet':
        return <WalletScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <OnboardingScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <ScreenTransition show={true}>
        {renderScreen()}
      </ScreenTransition>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Sendr;