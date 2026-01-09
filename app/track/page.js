'use client';
import React, { useState } from 'react';
import { 
  MapPin, Package, Users, DollarSign, Clock, CheckCircle, 
  XCircle, Truck, Navigation, Plus, MoreVertical, Activity,
  Calendar, TrendingUp, Shield, Home, CreditCard, Bell,
  Menu, Search, Filter, ChevronRight, Phone, Wifi, WifiOff
} from 'lucide-react';

const DeliveryDashboard = () => {
  // State for navigation
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Mock data state
  const [deliveryRequests, setDeliveryRequests] = useState([
    {
      id: 1,
      pickup: "123 Main St, Downtown",
      dropoff: "456 Oak Ave, Uptown",
      distance: "5.2 km",
      payout: "$45.00",
      packageSize: "Medium",
      sender: "John's Electronics",
      status: "pending"
    },
    {
      id: 2,
      pickup: "789 Market St",
      dropoff: "101 Business Park",
      distance: "12.8 km",
      payout: "$68.50",
      packageSize: "Large",
      sender: "Tech Supplies Co",
      status: "pending"
    }
  ]);
  
  const [activeDeliveries, setActiveDeliveries] = useState([
    {
      id: 101,
      driver: "Michael Chen",
      status: "in_transit",
      progress: 65,
      pickup: "Warehouse A",
      dropoff: "Customer Office",
      estimatedTime: "30 min"
    },
    {
      id: 102,
      driver: "Sarah Johnson",
      status: "picked_up",
      progress: 30,
      pickup: "Retail Store",
      dropoff: "Residential",
      estimatedTime: "45 min"
    }
  ]);
  
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "Michael Chen",
      phone: "+1 (555) 123-4567",
      status: "on_delivery",
      assignedDelivery: "#101 - Downtown",
      vehicle: "Van #A-101"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      phone: "+1 (555) 987-6543",
      status: "on_delivery",
      assignedDelivery: "#102 - Uptown",
      vehicle: "Van #A-102"
    },
    {
      id: 3,
      name: "David Wilson",
      phone: "+1 (555) 456-7890",
      status: "available",
      assignedDelivery: null,
      vehicle: "Van #A-103"
    }
  ]);
  
  const [earnings, setEarnings] = useState({
    today: 1250.50,
    weekly: 8450.25,
    monthly: 32450.75,
    walletBalance: 15420.50
  });

  // Summary cards data
  const summaryCards = [
    { title: "Total Deliveries Today", value: "24", icon: Package, color: "bg-purple-100 text-purple-600" },
    { title: "Active Deliveries", value: "8", icon: Truck, color: "bg-blue-100 text-blue-600" },
    { title: "Completed Deliveries", value: "16", icon: CheckCircle, color: "bg-green-100 text-green-600" },
    { title: "Today's Earnings", value: `$${earnings.today.toLocaleString()}`, icon: DollarSign, color: "bg-[#3A0A21] bg-opacity-10 text-[#3A0A21]" }
  ];

  // Recent activities
  const recentActivities = [
    { id: 1, action: "Delivery #101 completed", time: "10 min ago", driver: "Michael Chen" },
    { id: 2, action: "New delivery request received", time: "25 min ago", location: "Downtown" },
    { id: 3, action: "Driver Sarah started delivery", time: "45 min ago", delivery: "#102" },
    { id: 4, action: "Weekly payout processed", time: "2 hours ago", amount: "$8,450.25" }
  ];

  // Handle delivery request actions
  const handleAcceptRequest = (id) => {
    const request = deliveryRequests.find(r => r.id === id);
    setDeliveryRequests(prev => prev.filter(r => r.id !== id));
    
    // Add to active deliveries
    setActiveDeliveries(prev => [...prev, {
      id: Date.now(),
      driver: "Unassigned",
      status: "pending_assignment",
      progress: 0,
      pickup: request.pickup,
      dropoff: request.dropoff,
      estimatedTime: "Not assigned"
    }]);
  };

  const handleDeclineRequest = (id) => {
    setDeliveryRequests(prev => prev.filter(r => r.id !== id));
  };

  // Handle driver actions
  const handleAddDriver = () => {
    const newDriver = {
      id: drivers.length + 1,
      name: `Driver ${drivers.length + 1}`,
      phone: "+1 (555) 000-0000",
      status: "available",
      assignedDelivery: null,
      vehicle: "Van #NEW"
    };
    setDrivers(prev => [...prev, newDriver]);
  };

  const handleToggleDriverStatus = (id) => {
    setDrivers(prev => prev.map(driver => 
      driver.id === id 
        ? { ...driver, status: driver.status === "available" ? "offline" : "available" }
        : driver
    ));
  };

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'requests', label: 'Delivery Requests', icon: Package },
    { id: 'active', label: 'Active Deliveries', icon: Truck },
    { id: 'drivers', label: 'Drivers', icon: Users },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'tracking', label: 'Live Tracking', icon: Navigation }
  ];

  // Render current page
  const renderPage = () => {
    switch(activePage) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {summaryCards.map((card, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">{card.title}</p>
                      <p className="text-2xl font-bold">{card.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${card.color}`}>
                      <card.icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Map Preview */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Active Delivery Routes</h3>
                  <button className="btn-primary text-sm flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    View Full Map
                  </button>
                </div>
                <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Live map showing active routes</p>
                    <p className="text-sm text-gray-400">2 deliveries in progress</p>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-4">Recent Activities</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                      <div className="p-2 bg-[#3A0A21] bg-opacity-10 rounded-lg">
                        <Activity className="w-4 h-4 text-[#3A0A21]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'requests':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Delivery Requests</h2>
                <p className="text-gray-500">Manage incoming delivery requests</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search requests..." 
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent"
                  />
                </div>
                <button className="p-2 border border-gray-300 rounded-xl">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliveryRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Pending
                      </span>
                      <p className="text-sm text-gray-500 mt-1">From: {request.sender}</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Pickup: {request.pickup}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className="text-sm">Dropoff: {request.dropoff}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500">Distance</p>
                      <p className="font-semibold">{request.distance}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500">Package Size</p>
                      <p className="font-semibold">{request.packageSize}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Estimated Payout</p>
                      <p className="text-xl font-bold text-[#3A0A21]">{request.payout}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDeclineRequest(request.id)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                      >
                        <XCircle className="w-4 h-4 inline mr-1" />
                        Decline
                      </button>
                      <button 
                        onClick={() => handleAcceptRequest(request.id)}
                        className="btn-primary flex items-center"
                      >
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'active':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Active Deliveries</h2>
                <p className="text-gray-500">Track ongoing deliveries in real-time</p>
              </div>
              <button className="btn-primary flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Full Map View
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-4">Live Tracking Map</h3>
                <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Navigation className="w-16 h-16 text-[#3A0A21] mx-auto mb-4" />
                    <p className="font-medium">Live tracking active</p>
                    <p className="text-sm text-gray-500">2 deliveries being tracked</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {activeDeliveries.map((delivery) => (
                  <div key={delivery.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">Delivery #{delivery.id}</h4>
                        <p className="text-sm text-gray-500">Assigned to: {delivery.driver}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        delivery.status === 'in_transit' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {delivery.status === 'in_transit' ? 'In Transit' : 'Picked Up'}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{delivery.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#3A0A21] rounded-full transition-all duration-300"
                          style={{ width: `${delivery.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <p className="text-gray-600">
                          <Clock className="w-4 h-4 inline mr-1" />
                          ETA: {delivery.estimatedTime}
                        </p>
                      </div>
                      <button className="btn-primary text-sm flex items-center gap-2">
                        <Navigation className="w-4 h-4" />
                        View on Map
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'drivers':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Drivers Management</h2>
                <p className="text-gray-500">Manage your delivery fleet</p>
              </div>
              <button 
                onClick={handleAddDriver}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Driver
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drivers.map((driver) => (
                <div key={driver.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{driver.name}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {driver.phone}
                      </p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        driver.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : driver.status === 'on_delivery'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {driver.status === 'available' ? (
                          <>
                            <Wifi className="w-3 h-3" />
                            Available
                          </>
                        ) : driver.status === 'on_delivery' ? (
                          <>
                            <Truck className="w-3 h-3" />
                            On Delivery
                          </>
                        ) : (
                          <>
                            <WifiOff className="w-3 h-3" />
                            Offline
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Vehicle</span>
                      <span className="font-medium">{driver.vehicle}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Assigned Delivery</span>
                      <span className={`font-medium ${
                        driver.assignedDelivery ? 'text-[#3A0A21]' : 'text-gray-400'
                      }`}>
                        {driver.assignedDelivery || 'None'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleToggleDriverStatus(driver.id)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                        driver.status === 'available'
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {driver.status === 'available' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="flex-1 btn-primary text-sm">
                      Assign Delivery
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'earnings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Earnings & Analytics</h2>
              <p className="text-gray-500">Track your revenue and delivery history</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Today's Earnings</p>
                    <p className="text-2xl font-bold">${earnings.today.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">This Week</p>
                    <p className="text-2xl font-bold">${earnings.weekly.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">This Month</p>
                    <p className="text-2xl font-bold">${earnings.monthly.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#3A0A21] bg-opacity-10 rounded-lg">
                    <CreditCard className="w-6 h-6 text-[#3A0A21]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Wallet Balance</p>
                    <p className="text-2xl font-bold">${earnings.walletBalance.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-6">Recent Completed Deliveries</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium">Delivery #{100 + i}</p>
                      <p className="text-sm text-gray-500">Completed 2 hours ago</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#3A0A21]">$48.50</p>
                      <p className="text-sm text-gray-500">5.2 km • Medium Package</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
            <p className="text-gray-500">Select a page from the navigation</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pb-14 bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-xl relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 bg-[#3A0A21] rounded-full flex items-center justify-center text-white font-bold">
                  AC
                </div>
                <div>
                  <p className="font-medium">Agency Control</p>
                  <p className="text-sm text-gray-500">Logistics Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Mobile Overlay */}
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
             onClick={() => setSidebarOpen(false)}>
        </div>

        {/* Sidebar */}
        <aside className={`fixed lg:static left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-6">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activePage === item.id
                      ? 'bg-[#3A0A21] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-[#3A0A21]" />
                  <span className="font-medium">Account Status</span>
                </div>
                <p className="text-sm text-gray-600">Professional Plan</p>
                <p className="text-xs text-gray-500 mt-1">Active • 12 Drivers</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4">
        <div className="flex justify-around">
          {navItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg ${
                activePage === item.id ? 'text-[#3A0A21]' : 'text-gray-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="lg:hidden pb-16"></div>
    </div>
  );
};

export default DeliveryDashboard;