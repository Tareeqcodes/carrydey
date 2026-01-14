'use client';
import React from 'react';
import { Phone, Truck, Wifi, WifiOff, DollarSign, Package, MoreVertical, QrCode, User } from 'lucide-react';

const DriverCard = ({ driver, onToggleStatus, onGenerateQR, onAssignDelivery }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'on_delivery': return 'bg-blue-100 text-blue-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'on_delivery': return 'On Delivery';
      case 'offline': return 'Offline';
      case 'inactive': return 'Inactive';
      default: return status;
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <Wifi className="w-3 h-3" />;
      case 'on_delivery': return <Truck className="w-3 h-3" />;
      default: return <WifiOff className="w-3 h-3" />;
    }
  };
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#3A0A21] bg-opacity-10 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-[#3A0A21]" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{driver.name}</h3>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {driver.phone}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={onGenerateQR}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Generate Login QR"
          >
            <QrCode className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Driver Info */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Status</span>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
            {getStatusIcon(driver.status)}
            {getStatusText(driver.status)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Vehicle</span>
          <span className="font-medium flex items-center gap-1">
            <Truck className="w-4 h-4" />
            {driver.vehicle}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Assigned Delivery</span>
          <span className={`font-medium ${driver.assignedDeliveryId ? 'text-[#3A0A21]' : 'text-gray-400'}`}>
            {driver.assignedDeliveryId ? `#${driver.assignedDeliveryId.slice(-4)}` : 'None'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Today's Earnings</span>
          <span className="font-bold text-green-600 flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {driver.earningsToday?.toFixed(2) || '0.00'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Deliveries Today</span>
          <span className="font-medium flex items-center gap-1">
            <Package className="w-4 h-4" />
            {driver.deliveriesToday || 0}
          </span>
        </div>
        
        {driver.lastUpdate && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Last Update</span>
            <span className="text-sm text-gray-600">{driver.lastUpdate}</span>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        <button 
          onClick={onToggleStatus}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
            driver.status === 'available'
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-green-50 text-green-600 hover:bg-green-100'
          }`}
        >
          {driver.status === 'available' ? 'Set Offline' : 'Set Available'}
        </button>
        
        {driver.status === 'available' && (
          <button 
            onClick={onAssignDelivery}
            className="flex-1 btn-primary text-sm"
          >
            Assign Delivery
          </button>
        )}
      </div>
    </div>
  );
};

export default DriverCard;