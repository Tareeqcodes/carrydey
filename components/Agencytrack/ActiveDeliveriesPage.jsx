'use client';
import React, { useState } from 'react';
import { Package, Search } from 'lucide-react';
import ActiveDeliveryCard from './ActiveDeliveryCard';
import PickupCodeModal from './PickupCodeModal'; 
import DropoffOTPModal from './DropoffOTPModal';

const ActiveDeliveriesPage = ({ 
  activeDeliveries, 
  onAssign,
  onConfirmPickup,
  onConfirmDelivery,
  onUpdateStatus,
}) => {
  const [selectedDeliveryForPickup, setSelectedDeliveryForPickup] = useState(null);
  const [selectedDeliveryForDropoff, setSelectedDeliveryForDropoff] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const pendingDeliveries = activeDeliveries.filter((d) => d.status === 'pending_assignment' || d.status === 'accepted');
  const assignedDeliveries = activeDeliveries.filter((d) => d.status === 'assigned');
  const pickedUpDeliveries = activeDeliveries.filter((d) => d.status === 'picked_up');
  const inTransitDeliveries = activeDeliveries.filter((d) => d.status === 'in_transit');

  const handleConfirmPickup = async (deliveryId, pickupCode) => {
    if (onConfirmPickup) {
      const result = await onConfirmPickup(deliveryId, pickupCode);
      
      if (result?.success) {
        alert('Pickup confirmed successfully!');
      } else {
        alert(result?.error || 'Invalid pickup code');
      }
    }
  };

  const handleConfirmDelivery = async (deliveryId, otp) => {
    if (onConfirmDelivery) {
      const result = await onConfirmDelivery(deliveryId, otp);
      
      if (result?.success) {
        alert('Delivery completed successfully!');
      } else {
        alert(result?.error || 'Invalid OTP code');
      }
    }
  };

  const handleStartDelivery = async (deliveryId) => {
    if (onUpdateStatus) {
      await onUpdateStatus(deliveryId, 'in_transit');
    }
  };

  const DeliverySection = ({ title, count, deliveries, showAssignButton = false, bgColor = 'bg-gray-50' }) => {
    if (deliveries.length === 0) return null;

    return (
      <div className="mb-3">
        {/* Section Header */}
        <div className={`sticky top-[57px] ${bgColor} z-10 px-3 py-2 border-b border-gray-200`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
            <span className="text-xs font-bold text-gray-900 bg-white px-2 py-0.5 rounded-full">{count}</span>
          </div>
        </div>
        
        {/* Deliveries List */}
        <div className="space-y-1.5 p-2">
          {deliveries.map((delivery) => (
            <ActiveDeliveryCard 
              key={delivery.id || delivery.$id} 
              delivery={delivery}
              showAssignButton={showAssignButton}
              onAssign={onAssign}
              onConfirmPickup={() => setSelectedDeliveryForPickup(delivery.id || delivery.$id)}
              onConfirmDelivery={() => setSelectedDeliveryForDropoff(delivery.id || delivery.$id)}
              onStartDelivery={handleStartDelivery}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-3 py-3">
          <h1 className="text-base font-bold text-gray-900">Active Deliveries</h1>
          
        </div>
        
        {/* Search Bar */}
        {activeDeliveries.length > 5 && (
          <div className="px-3 pb-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by driver, package..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {activeDeliveries.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-16">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <Package className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">No Active Deliveries</h3>
          <p className="text-xs text-gray-500">Accepted deliveries will appear here</p>
        </div>
      ) : (
        /* Delivery Sections */
        <div className="pb-20">
          <DeliverySection 
            title="Awaiting Assignment" 
            count={pendingDeliveries.length}
            deliveries={pendingDeliveries}
            showAssignButton={true}
            bgColor="bg-amber-50"
          />
          
          <DeliverySection 
            title="Assigned to Driver" 
            count={assignedDeliveries.length}
            deliveries={assignedDeliveries}
            bgColor="bg-blue-50"
          />
          
          <DeliverySection 
            title="Picked Up" 
            count={pickedUpDeliveries.length}
            deliveries={pickedUpDeliveries}
            bgColor="bg-purple-50"
          />
          
          <DeliverySection 
            title="In Transit" 
            count={inTransitDeliveries.length}
            deliveries={inTransitDeliveries}
            bgColor="bg-indigo-50"
          />
        </div>
      )}

      {/* Modals */}
      <PickupCodeModal
        isOpen={selectedDeliveryForPickup !== null}
        onClose={() => setSelectedDeliveryForPickup(null)}
        onConfirm={handleConfirmPickup}
        deliveryId={selectedDeliveryForPickup}
      />

      <DropoffOTPModal
        isOpen={selectedDeliveryForDropoff !== null}
        onClose={() => setSelectedDeliveryForDropoff(null)}
        onConfirm={handleConfirmDelivery}
        deliveryId={selectedDeliveryForDropoff}
      />
    </div>
  );
};

export default ActiveDeliveriesPage;