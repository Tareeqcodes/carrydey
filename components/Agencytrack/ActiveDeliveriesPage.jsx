'use client';
import React, { useState } from 'react';
import { Package, Search } from 'lucide-react';
import ActiveDeliveryCard from './ActiveDeliveryCard';
import PickupCodeModal from './PickupCodeModal';
import DropoffOTPModal from './DropoffOTPModal';

const SECTIONS = [
  {
    key: 'pending',
    title: 'Awaiting Assignment',
    statuses: ['pending_assignment', 'accepted'],
    showAssignButton: true,
    accent: '#F59E0B',
    bg: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  {
    key: 'assigned',
    title: 'Assigned to Driver',
    statuses: ['assigned'],
    showAssignButton: false,
    accent: '#2563EB',
    bg: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  {
    key: 'picked_up',
    title: 'Picked Up',
    statuses: ['picked_up'],
    showAssignButton: false,
    accent: '#7C3AED',
    bg: '#F5F3FF',
    borderColor: '#DDD6FE',
  },
  {
    key: 'in_transit',
    title: 'In Transit',
    statuses: ['in_transit'],
    showAssignButton: false,
    accent: '#4F46E5',
    bg: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
];

const ActiveDeliveriesPage = ({
  activeDeliveries,
  onAssign,
  onConfirmPickup,
  onConfirmDelivery,
  onUpdateStatus,
}) => {
  const [selectedDeliveryForPickup, setSelectedDeliveryForPickup] =
    useState(null);
  const [selectedDeliveryForDropoff, setSelectedDeliveryForDropoff] =
    useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = searchQuery.trim()
    ? activeDeliveries.filter((d) => {
        const q = searchQuery.toLowerCase();
        return (
          (d.driverName || '').toLowerCase().includes(q) ||
          (d.pickup || '').toLowerCase().includes(q) ||
          (d.dropoff || '').toLowerCase().includes(q) ||
          (d.packageSize || '').toLowerCase().includes(q)
        );
      })
    : activeDeliveries;

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

  const DeliverySection = ({ section, deliveries }) => {
    if (deliveries.length === 0) return null;

    return (
      <div className="mb-4 mx-auto ">
        <div
          className="sticky top-[57px] z-10 flex items-center justify-between px-4 py-2"
          style={{
            background: section.bg,
            borderBottom: `2px solid ${section.accent}20`,
            borderTop: `1px solid ${section.borderColor}`,
          }}
        >
          <div className="flex items-center gap-2">
            <h3
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: section.accent }}
            >
              {section.title}
            </h3>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-2 px-4 pt-2">
          {deliveries.map((delivery) => (
            <ActiveDeliveryCard
              key={delivery.id || delivery.$id}
              delivery={delivery}
              showAssignButton={section.showAssignButton}
              onAssign={onAssign}
              onConfirmPickup={() =>
                setSelectedDeliveryForPickup(delivery.id || delivery.$id)
              }
              onConfirmDelivery={() =>
                setSelectedDeliveryForDropoff(delivery.id || delivery.$id)
              }
              onStartDelivery={handleStartDelivery}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Page Header */}
      <div className="sticky top-0 z-20">
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-lg font-black text-gray-900"
                style={{ letterSpacing: '-0.5px' }}
              >
                Active Deliveries
              </h1>
            </div>
          </div>
        </div>

        {activeDeliveries.length > 5 && (
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search driver, pickup, dropoff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Empty state */}
      {activeDeliveries.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <Package className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">
            No Active Deliveries
          </h3>
          <p className="text-xs text-gray-500">
            Accepted deliveries will appear here
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">
            No results found
          </h3>
          <p className="text-xs text-gray-500">Try a different search term</p>
        </div>
      ) : (
        <div className="pb-24 pt-3">
          {SECTIONS.map((section) => {
            const deliveries = filtered.filter((d) =>
              section.statuses.includes(d.status)
            );
            return (
              <DeliverySection
                key={section.key}
                section={section}
                deliveries={deliveries}
              />
            );
          })}
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
