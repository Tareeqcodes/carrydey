'use client';
import React, { useState } from 'react';
import { 
  MapPin, Package, Users, DollarSign, Clock, CheckCircle, 
  XCircle, Truck, Navigation, Plus, MoreVertical, Activity,
  Calendar, TrendingUp, Shield, Home, CreditCard, Bell,
  Menu, Search, Filter, ChevronRight, Phone, Wifi, WifiOff,
  User, LogOut, AlertCircle, Settings
} from 'lucide-react';

const TrackAgencyDelivery = () => {
  // State for navigation
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Assignment modal state
  const [assignmentModal, setAssignmentModal] = useState({
    isOpen: false,
    deliveryId: null,
    selectedDriver: null,
    pickup: '',
    dropoff: '',
    packageDetails: null
  });

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
      status: "pending",
      customerName: "John Smith",
      customerPhone: "+1 (555) 123-4567",
      instructions: "Ring bell twice, leave at front door"
    },
    {
      id: 2,
      pickup: "789 Market St",
      dropoff: "101 Business Park",
      distance: "12.8 km",
      payout: "$68.50",
      packageSize: "Large",
      sender: "Tech Supplies Co",
      status: "pending",
      customerName: "Sarah Johnson",
      customerPhone: "+1 (555) 987-6543",
      instructions: "Call upon arrival"
    }
  ]);
  
  const [activeDeliveries, setActiveDeliveries] = useState([
    {
      id: 101,
      driver: "Michael Chen",
      driverId: 1,
      status: "in_transit",
      progress: 65,
      pickup: "Warehouse A",
      dropoff: "Customer Office",
      estimatedTime: "30 min",
      packageSize: "Medium",
      payout: "$45.00",
      pickupCode: "A1B2C3",
      customerName: "John Smith",
      customerPhone: "+1 (555) 123-4567",
      latitude: 40.7128,
      longitude: -74.0060
    },
    {
      id: 102,
      driver: "Sarah Johnson",
      driverId: 2,
      status: "picked_up",
      progress: 30,
      pickup: "Retail Store",
      dropoff: "Residential",
      estimatedTime: "45 min",
      packageSize: "Large",
      payout: "$68.50",
      pickupCode: "X7Y8Z9",
      customerName: "Mike Wilson",
      customerPhone: "+1 (555) 456-7890",
      latitude: 40.7589,
      longitude: -73.9851
    },
    {
      id: 103,
      driver: "Unassigned",
      driverId: null,
      status: "pending_assignment",
      progress: 0,
      pickup: "Central Warehouse",
      dropoff: "Business Center",
      estimatedTime: "Not assigned",
      packageSize: "Small",
      payout: "$32.00",
      pickupCode: "M3N4P5",
      customerName: "Emma Davis",
      customerPhone: "+1 (555) 234-5678"
    }
  ]);
  
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "Michael Chen",
      phone: "+1 (555) 123-4567",
      status: "on_delivery",
      assignedDelivery: "#101 - Downtown",
      vehicle: "Van #A-101",
      earningsToday: 245.50,
      deliveriesToday: 8,
      latitude: 40.7128,
      longitude: -74.0060,
      lastUpdate: "2 min ago"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      phone: "+1 (555) 987-6543",
      status: "on_delivery",
      assignedDelivery: "#102 - Uptown",
      vehicle: "Van #A-102",
      earningsToday: 189.75,
      deliveriesToday: 6,
      latitude: 40.7589,
      longitude: -73.9851,
      lastUpdate: "5 min ago"
    },
    {
      id: 3,
      name: "David Wilson",
      phone: "+1 (555) 456-7890",
      status: "available",
      assignedDelivery: null,
      vehicle: "Van #A-103",
      earningsToday: 156.25,
      deliveriesToday: 5,
      lastUpdate: "10 min ago"
    },
    {
      id: 4,
      name: "Lisa Brown",
      phone: "+1 (555) 789-0123",
      status: "available",
      assignedDelivery: null,
      vehicle: "Van #A-104",
      earningsToday: 0,
      deliveriesToday: 0,
      lastUpdate: "Just now"
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
    { title: "Active Deliveries", value: activeDeliveries.filter(d => d.status !== "delivered").length.toString(), icon: Truck, color: "bg-blue-100 text-blue-600" },
    { title: "Available Drivers", value: drivers.filter(d => d.status === "available").length.toString(), icon: Users, color: "bg-green-100 text-green-600" },
    { title: "Today's Earnings", value: `$${earnings.today.toLocaleString()}`, icon: DollarSign, color: "bg-[#3A0A21] bg-opacity-10 text-[#3A0A21]" }
  ];

  // Recent activities
  const recentActivities = [
    { id: 1, action: "Delivery #101 completed", time: "10 min ago", driver: "Michael Chen" },
    { id: 2, action: "New delivery request received", time: "25 min ago", location: "Downtown" },
    { id: 3, action: "Driver Sarah started delivery", time: "45 min ago", delivery: "#102" },
    { id: 4, action: "Driver David assigned to new delivery", time: "1 hour ago", delivery: "#103" }
  ];

  // Handle delivery request actions
  const handleAcceptRequest = (id) => {
    const request = deliveryRequests.find(r => r.id === id);
    setDeliveryRequests(prev => prev.filter(r => r.id !== id));
    
    // Add to active deliveries as pending assignment
    const newDeliveryId = Date.now();
    setActiveDeliveries(prev => [...prev, {
      id: newDeliveryId,
      driver: "Unassigned",
      driverId: null,
      status: "pending_assignment",
      progress: 0,
      pickup: request.pickup,
      dropoff: request.dropoff,
      estimatedTime: "Not assigned",
      packageSize: request.packageSize,
      payout: request.payout,
      customerName: request.customerName,
      customerPhone: request.customerPhone,
      instructions: request.instructions,
      pickupCode: Math.random().toString(36).substr(2, 6).toUpperCase()
    }]);

    // Auto-open assignment modal
    setTimeout(() => {
      setAssignmentModal({
        isOpen: true,
        deliveryId: newDeliveryId,
        selectedDriver: null,
        pickup: request.pickup,
        dropoff: request.dropoff,
        packageDetails: request
      });
    }, 300);
  };

  const handleDeclineRequest = (id) => {
    setDeliveryRequests(prev => prev.filter(r => r.id !== id));
  };

  // Handle driver assignment
  const completeAssignment = () => {
    if (!assignmentModal.selectedDriver) return;

    // Find the pending delivery
    const pendingDeliveryIndex = activeDeliveries.findIndex(
      d => d.id === assignmentModal.deliveryId && d.status === "pending_assignment"
    );

    if (pendingDeliveryIndex !== -1) {
      const selectedDriver = drivers.find(d => d.id === assignmentModal.selectedDriver);
      const updatedDeliveries = [...activeDeliveries];
      
      // Update the delivery with assigned driver
      updatedDeliveries[pendingDeliveryIndex] = {
        ...updatedDeliveries[pendingDeliveryIndex],
        driver: selectedDriver.name,
        driverId: selectedDriver.id,
        status: "assigned",
        progress: 10,
        estimatedTime: "45 min",
        latitude: 40.7489 + Math.random() * 0.02,
        longitude: -73.9680 + Math.random() * 0.02
      };

      setActiveDeliveries(updatedDeliveries);

      // Update driver status
      setDrivers(prev => prev.map(driver => 
        driver.id === assignmentModal.selectedDriver 
          ? { 
              ...driver, 
              status: "on_delivery",
              assignedDelivery: `#${assignmentModal.deliveryId}`,
              latitude: 40.7489 + Math.random() * 0.02,
              longitude: -73.9680 + Math.random() * 0.02,
              lastUpdate: "Just now"
            }
          : driver
      ));
    }

    setAssignmentModal({ isOpen: false, deliveryId: null, selectedDriver: null, pickup: '', dropoff: '' });
  };

  // Handle delivery status updates (simulating driver actions)
  const updateDeliveryStatus = (deliveryId, newStatus) => {
    setActiveDeliveries(prev => prev.map(delivery => {
      if (delivery.id === deliveryId) {
        const progressMap = {
          'assigned': 10,
          'pickup': 30,
          'in_transit': 65,
          'delivered': 100
        };
        
        const newProgress = progressMap[newStatus] || delivery.progress;
        
        // If delivered, update driver status and earnings
        if (newStatus === 'delivered') {
          setDrivers(prevDrivers => prevDrivers.map(driver => {
            if (driver.id === delivery.driverId) {
              const payout = parseFloat(delivery.payout.replace('$', ''));
              return {
                ...driver,
                status: 'available',
                assignedDelivery: null,
                earningsToday: driver.earningsToday + payout,
                deliveriesToday: driver.deliveriesToday + 1,
                lastUpdate: 'Just now'
              };
            }
            return driver;
          }));
          
          // Update total earnings
          const payout = parseFloat(delivery.payout.replace('$', ''));
          setEarnings(prev => ({
            ...prev,
            today: prev.today + payout,
            walletBalance: prev.walletBalance + payout
          }));
        }
        
        return {
          ...delivery,
          status: newStatus,
          progress: newProgress,
          estimatedTime: newStatus === 'delivered' ? 'Completed' : delivery.estimatedTime
        };
      }
      return delivery;
    }));
  };

  // Handle driver actions
  const handleAddDriver = () => {
    const newDriver = {
      id: drivers.length + 1,
      name: `Driver ${drivers.length + 1}`,
      phone: "+1 (555) 000-0000",
      status: "available",
      assignedDelivery: null,
      vehicle: "Van #NEW",
      earningsToday: 0,
      deliveriesToday: 0,
      lastUpdate: "Just now"
    };
    setDrivers(prev => [...prev, newDriver]);
  };

  const handleToggleDriverStatus = (id) => {
    setDrivers(prev => prev.map(driver => 
      driver.id === id 
        ? { 
            ...driver, 
            status: driver.status === "available" ? "offline" : "available",
            assignedDelivery: driver.status === "available" ? driver.assignedDelivery : null
          }
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
                  <button 
                    onClick={() => setActivePage('tracking')}
                    className="btn-primary text-sm flex items-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    View Full Map
                  </button>
                </div>
                <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center relative">
                  {/* Mini map with driver positions */}
                  {drivers.filter(d => d.status === 'on_delivery').map((driver, index) => (
                    <div 
                      key={driver.id}
                      className="absolute"
                      style={{
                        left: `${20 + index * 25}%`,
                        top: `${30 + index * 15}%`
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Truck className="w-3 h-3 text-white" />
                        </div>
                        <div className="bg-white px-2 py-1 rounded text-xs mt-1 shadow text-nowrap">
                          {driver.name.split(' ')[0]}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center">
                    <p className="font-medium">{activeDeliveries.filter(d => !['delivered', 'pending_assignment'].includes(d.status)).length} deliveries in progress</p>
                    <p className="text-sm text-gray-500 mt-1">Click "View Full Map" for live tracking</p>
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
                      <p className="text-sm text-gray-500">Customer: {request.customerName}</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Pickup:</p>
                        <p className="text-sm text-gray-600">{request.pickup}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <div>
                        <p className="text-sm font-medium">Dropoff:</p>
                        <p className="text-sm text-gray-600">{request.dropoff}</p>
                      </div>
                    </div>
                    {request.instructions && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <p className="text-sm text-gray-600">{request.instructions}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500">Distance</p>
                      <p className="font-semibold">{request.distance}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500">Package</p>
                      <p className="font-semibold">{request.packageSize}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-semibold text-xs">{request.customerPhone}</p>
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
                        Accept & Assign
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
                <p className="text-gray-500">Track and manage ongoing deliveries</p>
              </div>
              <button 
                onClick={() => setActivePage('tracking')}
                className="btn-primary flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                Live Tracking Map
              </button>
            </div>

            {/* Pending Assignments */}
            {activeDeliveries.filter(d => d.status === 'pending_assignment').length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <h3 className="font-semibold text-lg mb-4 text-yellow-800">Pending Assignments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeDeliveries
                    .filter(d => d.status === 'pending_assignment')
                    .map((delivery) => (
                      <div key={delivery.id} className="bg-white rounded-xl p-4 border border-yellow-300">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">Delivery #{delivery.id}</h4>
                            <p className="text-sm text-gray-500">Waiting for driver assignment</p>
                          </div>
                          <button 
                            onClick={() => setAssignmentModal({
                              isOpen: true,
                              deliveryId: delivery.id,
                              selectedDriver: null,
                              pickup: delivery.pickup,
                              dropoff: delivery.dropoff,
                              packageDetails: delivery
                            })}
                            className="btn-primary text-sm flex items-center gap-2"
                          >
                            <Users className="w-4 h-4" />
                            Assign Now
                          </button>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p><span className="font-medium">Pickup:</span> {delivery.pickup}</p>
                          <p><span className="font-medium">Dropoff:</span> {delivery.dropoff}</p>
                          <p><span className="font-medium">Payout:</span> {delivery.payout}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Active Deliveries List */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-6">All Active Deliveries</h3>
              <div className="space-y-4">
                {activeDeliveries
                  .filter(d => d.status !== 'pending_assignment')
                  .map((delivery) => (
                    <div key={delivery.id} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-lg">Delivery #{delivery.id}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              delivery.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                              delivery.status === 'pickup' ? 'bg-blue-100 text-blue-800' :
                              delivery.status === 'in_transit' ? 'bg-purple-100 text-purple-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {delivery.status === 'assigned' ? 'Assigned' :
                               delivery.status === 'pickup' ? 'Pickup in Progress' :
                               delivery.status === 'in_transit' ? 'In Transit' :
                               'Delivered'}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">
                            <Truck className="w-4 h-4 inline mr-1" />
                            {delivery.driver}
                          </p>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Delivery Progress</span>
                          <span>{delivery.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#3A0A21] rounded-full transition-all duration-300"
                            style={{ width: `${delivery.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-green-600" />
                            <div>
                              <p className="text-gray-500">Pickup</p>
                              <p>{delivery.pickup}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-red-600" />
                            <div>
                              <p className="text-gray-500">Dropoff</p>
                              <p>{delivery.dropoff}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Package Size</span>
                            <span className="font-medium">{delivery.packageSize}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Payout</span>
                            <span className="font-bold text-[#3A0A21]">{delivery.payout}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Pickup Code</span>
                            <span className="font-mono font-bold">{delivery.pickupCode}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <p className="text-gray-600">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {delivery.estimatedTime}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {delivery.status === 'assigned' && (
                            <button 
                              onClick={() => updateDeliveryStatus(delivery.id, 'pickup')}
                              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors"
                            >
                              Mark as Pickup Started
                            </button>
                          )}
                          {delivery.status === 'pickup' && (
                            <button 
                              onClick={() => updateDeliveryStatus(delivery.id, 'in_transit')}
                              className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm hover:bg-purple-700 transition-colors"
                            >
                              Mark as In Transit
                            </button>
                          )}
                          {delivery.status === 'in_transit' && (
                            <button 
                              onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                              className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition-colors"
                            >
                              Mark as Delivered
                            </button>
                          )}
                          <button className="px-4 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                            <Phone className="w-4 h-4 inline mr-1" />
                            Call Driver
                          </button>
                        </div>
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
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Today's Earnings</span>
                      <span className="font-bold text-green-600">${driver.earningsToday.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Deliveries Today</span>
                      <span className="font-medium">{driver.deliveriesToday}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Last Update</span>
                      <span className="text-sm text-gray-600">{driver.lastUpdate}</span>
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
                    {driver.status === 'available' && (
                      <button 
                        onClick={() => {
                          const pendingDelivery = activeDeliveries.find(d => d.status === 'pending_assignment');
                          if (pendingDelivery) {
                            setAssignmentModal({
                              isOpen: true,
                              deliveryId: pendingDelivery.id,
                              selectedDriver: driver.id,
                              pickup: pendingDelivery.pickup,
                              dropoff: pendingDelivery.dropoff,
                              packageDetails: pendingDelivery
                            });
                          }
                        }}
                        className="flex-1 btn-primary text-sm"
                      >
                        Assign Delivery
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'tracking':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Live Tracking</h2>
                <p className="text-gray-500">Monitor all deliveries in real-time</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Refresh
                </button>
                <button className="btn-primary flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Full Screen
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map View */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Live Delivery Map</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        Available Drivers
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        Active Deliveries
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        Dropoff Points
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 rounded-xl h-[500px] flex items-center justify-center relative">
                    {/* Map Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100 rounded-xl"></div>
                    
                    {/* Dropoff Points */}
                    {activeDeliveries
                      .filter(d => d.status !== 'delivered' && d.status !== 'pending_assignment')
                      .map((delivery, index) => (
                        <div 
                          key={`dropoff-${delivery.id}`}
                          className="absolute"
                          style={{
                            left: `${60 + index * 10}%`,
                            top: `${40 + index * 15}%`
                          }}
                        >
                          <div className="flex flex-col items-center">
                            <MapPin className="w-6 h-6 text-red-600 drop-shadow-lg" />
                            <div className="bg-white px-2 py-1 rounded text-xs mt-1 shadow whitespace-nowrap">
                              Drop #{delivery.id}
                            </div>
                          </div>
                        </div>
                      ))}
                    
                    {/* Pickup Points */}
                    {activeDeliveries
                      .filter(d => d.status !== 'delivered' && d.status !== 'pending_assignment')
                      .map((delivery, index) => (
                        <div 
                          key={`pickup-${delivery.id}`}
                          className="absolute"
                          style={{
                            left: `${20 + index * 15}%`,
                            top: `${30 + index * 20}%`
                          }}
                        >
                          <div className="flex flex-col items-center">
                            <MapPin className="w-6 h-6 text-green-600 drop-shadow-lg" />
                            <div className="bg-white px-2 py-1 rounded text-xs mt-1 shadow whitespace-nowrap">
                              Pickup #{delivery.id}
                            </div>
                          </div>
                        </div>
                      ))}
                    
                    {/* Active Drivers */}
                    {drivers
                      .filter(d => d.status === 'on_delivery')
                      .map((driver, index) => {
                        const assignedDelivery = activeDeliveries.find(d => d.driverId === driver.id);
                        return (
                          <div 
                            key={`driver-${driver.id}`}
                            className="absolute animate-pulse"
                            style={{
                              left: `${30 + index * 20}%`,
                              top: `${50 + index * 10}%`
                            }}
                          >
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                                <Truck className="w-5 h-5 text-white" />
                              </div>
                              <div className="bg-white px-3 py-2 rounded-lg text-sm mt-2 shadow-lg min-w-[120px]">
                                <p className="font-medium truncate">{driver.name}</p>
                                <p className="text-xs text-gray-500 truncate">{driver.vehicle}</p>
                                <p className="text-xs text-blue-600 font-medium">
                                  Delivery #{assignedDelivery?.id || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    
                    {/* Available Drivers */}
                    {drivers
                      .filter(d => d.status === 'available')
                      .map((driver, index) => (
                        <div 
                          key={`available-${driver.id}`}
                          className="absolute"
                          style={{
                            left: `${70 + index * 5}%`,
                            top: `${20 + index * 10}%`
                          }}
                        >
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                              <Truck className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-white px-2 py-1 rounded text-xs mt-1 shadow whitespace-nowrap">
                              {driver.name.split(' ')[0]}
                            </div>
                          </div>
                        </div>
                      ))}
                    
                    {/* Map Legend */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <h4 className="font-medium mb-2">Live Tracking</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>On Delivery: {drivers.filter(d => d.status === 'on_delivery').length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Available: {drivers.filter(d => d.status === 'available').length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span>Active Deliveries: {activeDeliveries.filter(d => !['delivered', 'pending_assignment'].includes(d.status)).length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Delivery List */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg mb-4">Active Deliveries</h3>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {activeDeliveries
                      .filter(d => !['delivered', 'pending_assignment'].includes(d.status))
                      .map((delivery) => (
                        <div key={delivery.id} className="border border-gray-200 rounded-xl p-4 hover:border-[#3A0A21] transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">#{delivery.id}</h4>
                              <p className="text-sm text-gray-500">{delivery.driver}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                delivery.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                                delivery.status === 'pickup' ? 'bg-blue-100 text-blue-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {delivery.status === 'assigned' ? 'Assigned' :
                                 delivery.status === 'pickup' ? 'Pickup' : 'In Transit'}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2 mb-3">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-green-600" />
                              <span className="truncate">{delivery.pickup}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-red-600" />
                              <span className="truncate">{delivery.dropoff}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <p className="text-gray-600">
                                <Clock className="w-4 h-4 inline mr-1" />
                                {delivery.estimatedTime}
                              </p>
                            </div>
                            <button 
                              onClick={() => {
                                const driverPhone = drivers.find(d => d.id === delivery.driverId)?.phone;
                                if (driverPhone) {
                                  window.location.href = `tel:${driverPhone}`;
                                }
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                              title="Call Driver"
                            >
                              <Phone className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    
                    {activeDeliveries.filter(d => !['delivered', 'pending_assignment'].includes(d.status)).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No active deliveries</p>
                        <p className="text-sm">All deliveries are completed or pending assignment</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Driver Status Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg mb-4">Driver Status</h3>
                  <div className="space-y-3">
                    {drivers.map((driver) => (
                      <div key={driver.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            driver.status === 'available' ? 'bg-green-500' :
                            driver.status === 'on_delivery' ? 'bg-blue-500' :
                            'bg-gray-400'
                          }`}></div>
                          <div>
                            <p className="font-medium">{driver.name}</p>
                            <p className="text-xs text-gray-500">{driver.vehicle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-[#3A0A21]">
                            {driver.earningsToday > 0 ? `$${driver.earningsToday.toFixed(2)}` : '-'}
                          </p>
                          <p className="text-xs text-gray-500">{driver.lastUpdate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Driver Earnings */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-6">Driver Earnings Today</h3>
                <div className="space-y-4">
                  {drivers.map((driver) => (
                    <div key={driver.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          driver.status === 'available' ? 'bg-green-500' :
                          driver.status === 'on_delivery' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`}></div>
                        <div>
                          <p className="font-medium">{driver.name}</p>
                          <p className="text-sm text-gray-500">{driver.vehicle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#3A0A21]">${driver.earningsToday.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{driver.deliveriesToday} deliveries</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Completed Deliveries */}
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
          <div className="p-6 mt-16 md:mt-0">
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
                <p className="text-xs text-gray-500 mt-1">Active • {drivers.length} Drivers</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>

      {/* Assignment Modal */}
      {assignmentModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Assign to Driver</h3>
                <button 
                  onClick={() => setAssignmentModal({ isOpen: false, deliveryId: null, selectedDriver: null, pickup: '', dropoff: '' })}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-xl mb-4">
                  <p className="font-medium mb-2">Delivery Details</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span>Pickup: {assignmentModal.pickup}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span>Dropoff: {assignmentModal.dropoff}</span>
                    </div>
                    {assignmentModal.packageDetails && (
                      <>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-600" />
                          <span>Payout: {assignmentModal.packageDetails.payout}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-600" />
                          <span>Customer: {assignmentModal.packageDetails.customerName}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <p className="font-medium mb-3">Select Available Driver:</p>
                <div className="space-y-3">
                  {drivers
                    .filter(driver => driver.status === 'available')
                    .map(driver => (
                      <button
                        key={driver.id}
                        onClick={() => setAssignmentModal(prev => ({
                          ...prev,
                          selectedDriver: driver.id
                        }))}
                        className={`w-full p-4 border rounded-xl text-left transition-colors ${
                          assignmentModal.selectedDriver === driver.id
                            ? 'border-[#3A0A21] bg-[#3A0A21] bg-opacity-5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{driver.name}</p>
                            <p className="text-sm text-gray-500">{driver.vehicle}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Earnings today: ${driver.earningsToday.toFixed(2)}
                            </p>
                          </div>
                          {assignmentModal.selectedDriver === driver.id && (
                            <CheckCircle className="w-5 h-5 text-[#3A0A21]" />
                          )}
                        </div>
                      </button>
                    ))}
                  
                  {drivers.filter(driver => driver.status === 'available').length === 0 && (
                    <div className="text-center py-6 border border-gray-200 rounded-xl">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No available drivers</p>
                      <p className="text-sm text-gray-400 mt-1">All drivers are currently busy</p>
                      <button 
                        onClick={handleAddDriver}
                        className="mt-4 px-4 py-2 border border-[#3A0A21] text-[#3A0A21] rounded-xl hover:bg-[#3A0A21] hover:text-white transition-colors"
                      >
                        <Plus className="w-4 h-4 inline mr-1" />
                        Add New Driver
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setAssignmentModal({ isOpen: false, deliveryId: null, selectedDriver: null, pickup: '', dropoff: '' })}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={completeAssignment}
                  disabled={!assignmentModal.selectedDriver}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    assignmentModal.selectedDriver
                      ? 'btn-primary'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Assign Delivery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default TrackAgencyDelivery;