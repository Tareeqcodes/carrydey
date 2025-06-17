import React, { useState, useEffect } from 'react';
import { 
  Package, 
  MapPin, 
  Users, 
  Star, 
  Shield, 
  Phone, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Plus, 
  Search, 
  Filter, 
  MessageCircle, 
  Wallet, 
  User, 
  Home, 
  Plane, 
  Car, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Menu,
  X,
  Camera,
  Upload,
  Navigation,
  DollarSign,
  Calendar,
  Weight,
  Truck,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ArrowLeft,
  Send
} from 'lucide-react';
 
const Sendr = () => {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [userRole, setUserRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [notifications, setNotifications] = useState(3);

  // Mock data
  const mockTravelers = [
    {
      id: 1,
      name: "Adebayo K.",
      route: "Lagos → Abuja",
      rating: 4.8,
      reviews: 45,
      price: "₦2,500/kg",
      verified: true,
      departure: "Tomorrow, 8:00 AM",
      vehicle: "SUV",
      capacity: "15kg available"
    },
    {
      id: 2,
      name: "Fatima M.",
      route: "Lagos → Kano",
      rating: 4.9,
      reviews: 67,
      price: "₦3,000/kg",
      verified: true,
      departure: "Today, 6:00 PM",
      vehicle: "Bus",
      capacity: "25kg available"
    }
  ];

  const mockPackages = [
    {
      id: 1,
      sender: "John D.",
      route: "Abuja → Lagos",
      type: "Documents",
      weight: "2kg",
      value: "₦50,000",
      pickup: "Today",
      delivery: "Tomorrow",
      price: "₦5,000"
    },
    {
      id: 2,
      sender: "Sarah O.",
      route: "Lagos → Port Harcourt",
      type: "Electronics",
      weight: "5kg",
      value: "₦200,000",
      pickup: "Tomorrow",
      delivery: "Day after",
      price: "₦12,000"
    }
  ];

  // Landing Screen
  const LandingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-white text-2xl font-bold">Sendr</span>
          </div>
          <button 
            onClick={() => setCurrentScreen('signin')}
            className="text-white hover:text-gray-200"
          >
            Sign In
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center text-white mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Send packages with
            <span className="block text-yellow-300">fellow travelers</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Safe, affordable interstate delivery through our trusted community
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm opacity-80">Deliveries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">5K+</div>
              <div className="text-sm opacity-80">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">99%</div>
              <div className="text-sm opacity-80">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div className="max-w-md mx-auto space-y-4">
          <button 
            onClick={() => {
              setUserRole('sender');
              setCurrentScreen('signup');
            }}
            className="w-full bg-white text-gray-800 py-4 px-6 rounded-xl font-semibold flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Package className="h-6 w-6 text-blue-600" />
              <span>I want to send a package</span>
            </div>
            <ArrowRight className="h-5 w-5" />
          </button>
          
          <button 
            onClick={() => {
              setUserRole('traveler');
              setCurrentScreen('signup');
            }}
            className="w-full bg-white/20 backdrop-blur text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-between hover:bg-white/30 transition-colors border border-white/30"
          >
            <div className="flex items-center space-x-3">
              <Plane className="h-6 w-6" />
              <span>I'm traveling and can help</span>
            </div>
            <ArrowRight className="h-5 w-5" />
          </button>
          
          <button 
            onClick={() => {
              setUserRole('both');
              setCurrentScreen('signup');
            }}
            className="w-full bg-transparent text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-between hover:bg-white/10 transition-colors border border-white/30"
          >
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6" />
              <span>Both (Send & Travel)</span>
            </div>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex justify-center items-center space-x-6 text-white/80">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Verified Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">Secure Payments</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span className="text-sm">Trusted Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Sign Up Screen
  const SignUpScreen = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-md">
        <div className="mb-8">
          <button 
            onClick={() => setCurrentScreen('landing')}
            className="flex items-center text-gray-600 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600">Join as a {userRole}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500">
                  +234
                </span>
                <input
                  type="tel"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="8012345678"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your city"
              />
            </div>
          </div>
          
          <button 
            onClick={() => setCurrentScreen('verification')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <button 
              onClick={() => setCurrentScreen('signin')}
              className="text-blue-600 hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  // Verification Screen
  const VerificationScreen = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Verify Your Account</h1>
          <p className="text-gray-600">Choose your verification level</p>
        </div>

        <div className="space-y-4">
          {/* Level 1 - Basic */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Basic Verification</h3>
                  <p className="text-sm text-gray-500">Required</p>
                </div>
              </div>
              <span className="text-green-600 font-semibold">FREE</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Phone & Email verification</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Profile completion</span>
              </li>
            </ul>
          </div>

          {/* Level 2 - Enhanced */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Enhanced Verification</h3>
                  <p className="text-sm text-blue-600">3x more matches</p>
                </div>
              </div>
              <span className="text-blue-600 font-semibold">FREE</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span>Bank account verification</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span>Social media linking</span>
              </li>
            </ul>
          </div>

          {/* Level 3 - Premium */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Premium Verification</h3>
                  <p className="text-sm text-yellow-600">Trusted badge</p>
                </div>
              </div>
              <span className="text-gray-600 font-semibold">OPTIONAL</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-yellow-500" />
                <span>Government ID verification</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-yellow-500" />
                <span>Address verification</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button 
            onClick={() => {
              setIsAuthenticated(true);
              setCurrentScreen('dashboard');
            }}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start with Basic Verification
          </button>
          <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );

  // Dashboard Screen
  const DashboardScreen = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">Sendr</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, John!
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Verified</span>
            </span>
            <span>3 active packages</span>
            <span>₦25,000 in wallet</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Packages Sent</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-green-600">₦125K</div>
            <div className="text-sm text-gray-600">Total Savings</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">4.9</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-purple-600">100%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => setCurrentScreen('send-package')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-2">Send New Package</h3>
                <p className="text-blue-100">Find travelers on your route</p>
              </div>
              <Plus className="h-8 w-8" />
            </div>
          </button>
          
          <button 
            onClick={() => setCurrentScreen('browse-travelers')}
            className="bg-white text-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          />
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-2">Browse Travelers</h3>
                <p className="text-gray-600">15 travelers available</p>
              </div>
              <Search className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Package delivered to Abuja</p>
                <p className="text-sm text-gray-600">by Adebayo K. • 2 hours ago</p>
              </div>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Package in transit to Lagos</p>
                <p className="text-sm text-gray-600">by Fatima M. • 5 hours ago</p>
              </div>
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );

  // Send Package Screen
  const SendPackageScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Send Package</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-6">
            {/* Package Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Package Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Type
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Documents</option>
                    <option>Electronics</option>
                    <option>Clothing</option>
                    <option>Food Items</option>
                    <option>Others</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Value (₦)
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="50000"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Brief description of the package"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Photo (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Tap to add photo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Route */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Route & Timeline</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter pickup address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Location
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter delivery address"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery By
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setCurrentScreen('browse-travelers')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Find Travelers
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Browse Travelers Screen
  const BrowseTravelersScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentScreen('dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">Browse Travelers</h1>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Filter className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search routes (e.g., Lagos to Abuja)"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filter Tags */}
        <div className="flex space-x-3 mb-6 overflow-x-auto">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium whitespace-nowrap">
            All Routes
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap">
            Today
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap">
            Tomorrow
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap">
            Verified Only
          </button>
        </div>

        {/* Travelers List */}
        <div className="space-y-4">
          {mockTravelers.map((traveler) => (
            <div key={traveler.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-800">{traveler.name}</h3>
                      {traveler.verified && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{traveler.rating}</span>
                      <span>({traveler.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{traveler.price}</div>
                  <div className="text-sm text-gray-500">{traveler.capacity}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Navigation className="h-4 w-4" />
                  <span className="text-sm">{traveler.route}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{traveler.departure}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <Car className="h-4 w-4" />
                  <span className="text-sm">{traveler.vehicle}</span>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-4">
                <button 
                  onClick={() => setCurrentScreen('traveler-profile')}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  View Profile
                </button>
                <button 
                  onClick={() => setCurrentScreen('match-request')}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Request Match
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );

  // Traveler Profile Screen
  const TravelerProfileScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentScreen('browse-travelers')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Traveler Profile</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <h2 className="text-xl font-bold text-gray-800">Adebayo Kemi</h2>
              <CheckCircle className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex items-center justify-center space-x-1 mb-4">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">4.8</span>
              <span className="text-gray-600">(45 reviews)</span>
            </div>
            
            {/* Verification Badges */}
            <div className="flex justify-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Phone Verified
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                ID Verified
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                Bank Verified
              </span>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Trip</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Navigation className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium text-gray-800">Lagos → Abuja</div>
                <div className="text-sm text-gray-600">Via Ibadan, Ilorin</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium text-gray-800">Tomorrow, 8:00 AM</div>
                <div className="text-sm text-gray-600">Estimated arrival: 2:00 PM</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Car className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium text-gray-800">Honda Pilot SUV</div>
                <div className="text-sm text-gray-600">15kg space available</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium text-gray-800">₦2,500 per kg</div>
                <div className="text-sm text-gray-600">Negotiable for bulk packages</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Reviews</h3>
          
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">Sarah O.</span>
              </div>
              <p className="text-sm text-gray-700">
                "Very professional and careful with my electronics. Delivered on time!"
              </p>
              <span className="text-xs text-gray-500">2 days ago</span>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">Mike A.</span>
              </div>
              <p className="text-sm text-gray-700">
                "Great communication throughout the journey. Highly recommended!"
              </p>
              <span className="text-xs text-gray-500">1 week ago</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => setCurrentScreen('match-request')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Request Match
          </button>
          <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
            Send Message
          </button>
        </div>
      </div>
    </div>
  );

  // Match Request Screen
  const MatchRequestScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentScreen('traveler-profile')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Match Request</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Match Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Match Summary</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Traveler:</span>
              <span className="font-medium">Adebayo K.</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Route:</span>
              <span className="font-medium">Lagos → Abuja</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Package Type:</span>
              <span className="font-medium">Documents</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Weight:</span>
              <span className="font-medium">2.5kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Estimated Cost:</span>
              <span className="font-medium text-blue-600">₦6,250</span>
            </div>
          </div>
        </div>

        {/* Personal Message */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Message</h3>
          <textarea
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
            placeholder="Hi Adebayo! I'd like you to help deliver my documents to Abuja. The package contains important business documents and needs careful handling. Thank you!"
          ></textarea>
        </div>

        {/* Offer Price */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Offer</h3>
          <div className="flex items-center space-x-3">
            <span className="text-gray-600">₦</span>
            <input
              type="number"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="6250"
              defaultValue="6250"
            />
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Base rate: ₦2,500/kg • You can negotiate
          </p>
        </div>

        {/* Terms */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 mb-1">Important Terms</p>
              <ul className="text-yellow-700 space-y-1">
                <li>• Payment held in escrow until delivery</li>
                <li>• Insurance coverage up to package value</li>
                <li>• 24-hour cancellation policy</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => setCurrentScreen('payment-setup')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Send Request
          </button>
          <button 
            onClick={() => setCurrentScreen('traveler-profile')}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );

  // Messages Screen
  const MessagesScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="space-y-3">
          {[
            {
              name: "Adebayo K.",
              message: "Your package is ready for pickup",
              time: "2m ago",
              unread: true,
              avatar: "AK"
            },
            {
              name: "Fatima M.",
              message: "I'll be in Lagos by 6 PM today",
              time: "1h ago",
              unread: false,
              avatar: "FM"
            },
            {
              name: "Support Team",
              message: "Your verification is complete!",
              time: "2h ago",
              unread: false,
              avatar: "ST"
            }
          ].map((chat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{chat.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 truncate">{chat.name}</h3>
                    <span className="text-sm text-gray-500">{chat.time}</span>
                  </div>
                  <p className={`text-sm truncate ${chat.unread ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                    {chat.message}
                  </p>
                </div>
                {chat.unread && (
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );

  // Profile Screen
  const ProfileScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-800">Profile</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">John Doe</h2>
              <p className="text-gray-600">john.doe@email.com</p>
              <div className="flex items-center space-x-2 mt-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Verified Account</span>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Packages Sent</div>
            <div className="flex items-center space-x-1 mt-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-gray-500">4.9 avg rating</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-2xl font-bold text-green-600">₦125K</div>
            <div className="text-sm text-gray-600">Total Savings</div>
            <div className="text-xs text-gray-500 mt-1">vs traditional shipping</div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-xl shadow-sm">
          {[
            { icon: Wallet, label: "Wallet & Payments", value: "₦25,000" },
            { icon: Package, label: "My Packages", value: "3 active" },
            { icon: Star, label: "Reviews & Ratings", value: "4.9" },
            { icon: Shield, label: "Verification Center", value: "Level 2" },
            { icon: Bell, label: "Notifications", value: "On" },
            { icon: HelpCircle, label: "Help & Support", value: "" },
            { icon: Settings, label: "Settings", value: "" }
          ].map((item, index) => (
            <div key={index} className={`flex items-center justify-between p-4 ${index !== 6 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex items-center space-x-3">
                <item.icon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-800">{item.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                {item.value && (
                  <span className="text-sm text-gray-600">{item.value}</span>
                )}
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button 
          onClick={() => {
            setIsAuthenticated(false);
            setCurrentScreen('landing');
          }}
          className="w-full mt-6 bg-red-50 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
      
      <BottomNav />
    </div>
  );

  // Bottom Navigation Component
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {[
          { icon: Home, label: "Home", screen: "dashboard" },
          { icon: Package, label: "Packages", screen: "packages" },
          { icon: Search, label: "Browse", screen: "browse-travelers" },
          { icon: MessageCircle, label: "Messages", screen: "messages" },
          { icon: User, label: "Profile", screen: "profile" }
        ].map((item) => (
          <button
            key={item.screen}
            onClick={() => setCurrentScreen(item.screen)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              currentScreen === item.screen 
                ? "text-blue-600 bg-blue-50" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Sign In Screen
  const SignInScreen = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-md">
        <div className="mb-8">
          <button 
            onClick={() => setCurrentScreen('landing')}
            className="flex items-center text-gray-600 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone or Email
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter phone or email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => {
              setIsAuthenticated(true);
              setCurrentScreen('dashboard');
            }}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
          
          <div className="text-center mt-4">
            <button className="text-blue-600 hover:underline text-sm">
              Forgot Password?
            </button>
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{' '}
            <button 
              onClick={() => setCurrentScreen('landing')}
              className="text-blue-600 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  // Main Render Logic
  const renderScreen = () => {
    if (!isAuthenticated) {
      switch (currentScreen) {
        case 'landing': return <LandingScreen />;
        case 'signup': return <SignUpScreen />;
        case 'signin': return <SignInScreen />;
        case 'verification': return <VerificationScreen />;
        default: return <LandingScreen />;
      }
    }

    switch (currentScreen) {
      case 'dashboard': return <DashboardScreen />;
      case 'send-package': return <SendPackageScreen />;
      case 'browse-travelers': return <BrowseTravelersScreen />;
      case 'traveler-profile': return <TravelerProfileScreen />;
      case 'match-request': return <MatchRequestScreen />;
      case 'messages': return <MessagesScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderScreen()}
    </div>
  );
};

export default Sendr;