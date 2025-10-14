'use client'
import React, { useState } from 'react';
import { ArrowLeft,  Phone, MessageCircle, Plus, Home, Search, User } from 'lucide-react';

const SenderTransit = () => {
  const [currentScreen, setCurrentScreen] = useState('sender-dashboard');
  const [userType, setUserType] = useState('sender');

  const showScreen = (screenId) => {
    setCurrentScreen(screenId);
  };

  // Header Component
  const Header = ({ title, subtitle, showBackBtn = false, showUserToggle = false }) => (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 pt-12 pb-5 relative">
      {showBackBtn && (
        <button 
          onClick={() => showScreen('sender-dashboard')}
          className="absolute top-12 left-5 bg-white bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
      )}
      <h1 className="text-2xl font-bold mb-1">{title}</h1>
      <p className="text-sm opacity-90">{subtitle}</p>
      
      {showUserToggle && (
        <div className="flex bg-white bg-opacity-20 rounded-full mt-4">
          <button 
            onClick={() => {
              setUserType('sender');
              showScreen('sender-dashboard');
            }}
            className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
              userType === 'sender' ? 'bg-white text-indigo-600' : 'text-white'
            }`}
          >
            Sender
          </button>
          <button 
            onClick={() => {
              setUserType('traveler');
              showScreen('traveler-browse');
            }}
            className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
              userType === 'traveler' ? 'bg-white text-indigo-600' : 'text-white'
            }`}
          >
            Traveler
          </button>
        </div>
      )}
    </div>
  );

  // Navigation Component
  const Navigation = ({ activeTab = 'home' }) => (
    <div className="flex justify-around py-4 bg-white border-t border-gray-100 sticky bottom-0">
      <button 
        onClick={() => showScreen('sender-dashboard')}
        className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
          activeTab === 'home' ? 'bg-indigo-600 text-white' : 'text-gray-400'
        }`}
      >
        Home
      </button>
      <button 
        onClick={() => showScreen('traveler-browse')}
        className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
          activeTab === 'browse' ? 'bg-indigo-600 text-white' : 'text-gray-400'
        }`}
      >
        Browse
      </button>
      <button className="px-4 py-2 rounded-lg font-semibold text-xs text-gray-400">
        Messages
      </button>
      <button className="px-4 py-2 rounded-lg font-semibold text-xs text-gray-400">
        Profile
      </button>
    </div>
  );

  // Package Card Component
  const PackageCard = ({ 
    title, 
    weight, 
    priority, 
    price, 
    pickup, 
    dropoff, 
    status, 
    timeAgo, 
    distance,
    onClick 
  }) => (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 mb-4"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-xs text-gray-500">{weight} • {priority}</p>
          {distance && <p className="text-xs text-gray-500">{distance}</p>}
        </div>
        <div className="bg-gradient-to-r from-teal-500 to-green-400 text-white px-4 py-2 rounded-full font-semibold text-sm">
          ₦{price.toLocaleString()}
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
          <span className="text-sm text-gray-600">{pickup}</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
          <span className="text-sm text-gray-600">{dropoff}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{status}</span>
        <span className={priority === 'High Priority' || priority === 'Urgent' ? 'text-red-500 font-semibold' : ''}>
          {timeAgo}
        </span>
      </div>
    </div>
  );

  // Sender Dashboard Screen
  const SenderDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header 
        title="Welcome back, Alex" 
        subtitle="Ready to send something?"
        showUserToggle={true}
      />
      
      <div className="p-5 pb-24">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-1">12</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Packages Sent</div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-1">4.8</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Rating</div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => alert('Create new package posting')}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-5 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            📦 Send Package
          </button>
          <button 
            onClick={() => showScreen('delivery-status')}
            className="bg-white text-indigo-600 border-2 border-indigo-600 p-5 rounded-2xl font-semibold shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            📍 Track Delivery
          </button>
        </div>
        
        {/* Recent Packages */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Packages</h3>
        <PackageCard
          title="iPhone Charger"
          weight="2.5 kg"
          priority="High Priority"
          price={2500}
          pickup="Kano"
          dropoff="Abuja"
          status="In Transit"
          timeAgo="Arrives Today"
          onClick={() => showScreen('delivery-status')}
        />
        <PackageCard
          title="Documents"
          weight="0.5 kg"
          priority="Standard"
          price={1200}
          pickup="Kano"
          dropoff="Lagos"
          status="Delivered"
          timeAgo="Yesterday"
        />
      </div>
      
      <Navigation activeTab="home" />
    </div>
  );

  // Traveler Browse Screen
  const TravelerBrowse = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header 
        title="Available Packages" 
        subtitle="Earn money on your route"
        showBackBtn={true}
        showUserToggle={true}
      />
      
      <div className="p-5 pb-24">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-1">8</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Deliveries Made</div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-1">₦15,400</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Earned</div>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Packages Near You</h3>
        <PackageCard
          title="Electronics Package"
          weight="3.5 kg"
          priority="Urgent"
          price={3200}
          pickup="Sabon Gari, Kano"
          dropoff="Maitama, Abuja"
          status="Posted 2h ago"
          timeAgo="Urgent"
          distance="1.2 km away"
          onClick={() => showScreen('match-route')}
        />
        <PackageCard
          title="Fashion Items"
          weight="1.2 kg"
          priority="Standard"
          price={1800}
          pickup="Fagge, Kano"
          dropoff="Victoria Island, Lagos"
          status="Posted 4h ago"
          timeAgo="Standard"
          distance="0.8 km away"
        />
        <PackageCard
          title="Medical Supplies"
          weight="0.8 kg"
          priority="High Priority"
          price={2800}
          pickup="Nasarawa, Kano"
          dropoff="Garki, Abuja"
          status="Posted 1h ago"
          timeAgo="High Priority"
          distance="2.1 km away"
        />
      </div>
      
      <Navigation activeTab="browse" />
    </div>
  );

  // Match Route Screen
  const MatchRoute = () => (
    <div className="min-h-screen bg-gradient-to-r from-teal-500 to-green-400">
      <div className="relative p-5 pt-12">
        <button 
          onClick={() => showScreen('traveler-browse')}
          className="absolute top-12 left-5 bg-white bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
      </div>
      
      <div className="text-center text-white px-5 py-10">
        <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full mx-auto mb-5 flex items-center justify-center text-4xl">
          🎯
        </div>
        <h2 className="text-2xl font-bold mb-3">Perfect Match!</h2>
        <p className="text-base opacity-90 mb-8">This package aligns perfectly with your route to Abuja</p>
        
        <div className="bg-white bg-opacity-20 rounded-2xl p-5 mx-5 mb-8 text-left">
          <h4 className="text-base font-semibold mb-4">Route Details</h4>
          <div className="flex items-center mb-3">
            <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
            <span>Pickup: Sabon Gari, Kano</span>
          </div>
          <div className="flex items-center mb-4">
            <div className="w-2 h-2 bg-green-300 rounded-full mr-3"></div>
            <span>Drop-off: Maitama, Abuja</span>
          </div>
          <div className="border-t border-white border-opacity-30 pt-4 flex justify-between">
            <span>Distance: 350 km</span>
            <span>Earnings: ₦3,200</span>
          </div>
        </div>
      </div>
      
      {/* User Profile */}
      <div className="bg-white rounded-2xl p-5 mx-5 text-center">
        <div className="w-15 h-15 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-semibold text-xl">
          MK
        </div>
        <h3 className="font-semibold mb-1 text-gray-900">Mohammed Kabir</h3>
        <div className="text-yellow-500 mb-4">⭐ 4.9 (127 reviews)</div>
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-gray-100 text-indigo-600 py-3 px-4 rounded-xl font-semibold flex items-center justify-center">
            <MessageCircle size={16} className="mr-2" />
            Message
          </button>
          <button 
            onClick={() => showScreen('delivery-status')}
            className="bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold"
          >
            Accept Delivery
          </button>
        </div>
      </div>
    </div>
  );

  // Timeline Item Component
  const TimelineItem = ({ icon, title, time, completed = false, active = false, isLast = false }) => (
    <div className="flex items-center mb-5 relative">
      {!isLast && (
        <div className="absolute left-4 top-8 w-0.5 h-8 bg-gray-200"></div>
      )}
      <div className={`w-8 h-8 rounded-full mr-4 flex items-center justify-center text-xs text-white ${
        completed ? 'bg-teal-500' : active ? 'bg-indigo-600' : 'bg-gray-200'
      }`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 mb-0.5">{title}</h4>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );

  // Delivery Status Screen
  const DeliveryStatus = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header 
        title="Delivery Status" 
        subtitle="iPhone Charger to Abuja"
        showBackBtn={true}
      />
      
      <div className="p-5 pb-24">
        {/* Status Card */}
        <div className="bg-white rounded-2xl p-5 mb-5 text-center">
          <div className="w-25 h-25 bg-gradient-to-r from-teal-500 to-green-400 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl">
            🚗
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">In Transit</h3>
          <p className="text-gray-600 mb-4">Your package is on its way to Abuja</p>
          <div className="bg-gray-100 rounded-xl p-4">
            <strong className="text-gray-900">Estimated Arrival: Today, 6:30 PM</strong>
          </div>
        </div>
        
        {/* Driver Profile */}
        <div className="bg-white rounded-2xl p-5 mb-5 text-center">
          <div className="w-15 h-15 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-semibold text-xl">
            AM
          </div>
          <h3 className="font-semibold mb-1 text-gray-900">Aisha Musa</h3>
          <div className="text-yellow-500 mb-4">⭐ 4.7 (89 reviews)</div>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gray-100 text-indigo-600 py-3 px-4 rounded-xl font-semibold flex items-center justify-center">
              <Phone size={16} className="mr-2" />
              Call
            </button>
            <button className="bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center">
              <MessageCircle size={16} className="mr-2" />
              Message
            </button>
          </div>
        </div>
        
        {/* Timeline */}
        <div className="bg-white rounded-2xl p-5">
          <TimelineItem
            icon="✓"
            title="Package Picked Up"
            time="Today, 2:15 PM"
            completed={true}
          />
          <TimelineItem
            icon="🚗"
            title="In Transit to Abuja"
            time="Started 2:30 PM"
            active={true}
          />
          <TimelineItem
            icon="📍"
            title="Out for Delivery"
            time="Expected 6:00 PM"
          />
          <TimelineItem
            icon="✅"
            title="Delivered"
            time="Expected 6:30 PM"
            isLast={true}
          />
        </div>
      </div>
      
      <Navigation />
    </div>
  );

  // Floating Action Button
  const FloatingActionButton = () => (
    <button 
      onClick={() => alert('Quick actions menu')}
      className="fixed bottom-24 right-8 w-15 h-15 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-white shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-1 flex items-center justify-center text-2xl z-50"
    >
      <Plus size={24} />
    </button>
  );

  // Main App Container
  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen relative overflow-hidden rounded-3xl shadow-2xl">
      {currentScreen === 'sender-dashboard' && <SenderDashboard />}
      {currentScreen === 'traveler-browse' && <TravelerBrowse />}
      {currentScreen === 'match-route' && <MatchRoute />}
      {currentScreen === 'delivery-status' && <DeliveryStatus />}
      
      <FloatingActionButton />
    </div>
  );
};

export default SenderTransit;