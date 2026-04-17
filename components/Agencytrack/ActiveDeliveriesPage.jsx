'use client';
import React, { useState } from 'react';
import { Package, Search } from 'lucide-react';
import ActiveDeliveryCard from './ActiveDeliveryCard';

const SECTIONS = [
  {
    key: 'pending',
    title: 'Awaiting Assignment',
    statuses: ['pending_assignment', 'accepted'],
    showAssignButton: true,
    accent: '#F59E0B',
    bg: '#FFFBEB',
    darkBg: 'rgba(245,158,11,0.08)',
    borderColor: '#FDE68A',
  },
  {
    key: 'assigned',
    title: 'Assigned to Driver',
    statuses: ['assigned'],
    showAssignButton: false,
    accent: '#2563EB',
    bg: '#EFF6FF',
    darkBg: 'rgba(37,99,235,0.08)',
    borderColor: '#BFDBFE',
  },
  {
    key: 'picked_up',
    title: 'Picked Up',
    statuses: ['picked_up'],
    showAssignButton: false,
    accent: '#7C3AED',
    bg: '#F5F3FF',
    darkBg: 'rgba(124,58,237,0.08)',
    borderColor: '#DDD6FE',
  },
  {
    key: 'in_transit',
    title: 'In Transit',
    statuses: ['in_transit'],
    showAssignButton: false,
    accent: '#4F46E5',
    bg: '#EEF2FF',
    darkBg: 'rgba(79,70,229,0.08)',
    borderColor: '#C7D2FE',
  },
];

const ActiveDeliveriesPage = ({ activeDeliveries, onAssign }) => {
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

  const DeliverySection = ({ section, deliveries }) => {
    if (deliveries.length === 0) return null;
    return (
      <div className="mb-4 mx-auto">
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
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
              style={{
                background: section.accent + '20',
                color: section.accent,
              }}
            >
              {deliveries.length}
            </span>
          </div>
        </div>
        <div className="space-y-2 px-4 pt-2">
          {deliveries.map((delivery) => (
            <ActiveDeliveryCard
              key={delivery.id || delivery.$id}
              delivery={delivery}
              showAssignButton={section.showAssignButton}
              onAssign={onAssign}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="sticky top-0 z-20 bg-white dark:bg-black border-b border-black/10 dark:border-white/10">
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-lg font-black text-black dark:text-white"
                style={{ letterSpacing: '-0.5px' }}
              >
                Active Deliveries
              </h1>
              <p className="text-[10px] text-black/40 dark:text-white/40 mt-0.5">
                Drivers confirm pickup &amp; delivery via their portal link
              </p>
            </div>
          </div>
        </div>
        {activeDeliveries.length > 5 && (
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/40 dark:text-white/40" />
              <input
                type="text"
                placeholder="Search driver, pickup, dropoff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#00C896] text-black dark:text-white placeholder-black/30 dark:placeholder-white/30"
              />
            </div>
          </div>
        )}
      </div>

      {activeDeliveries.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="w-14 h-14 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
            <Package className="w-6 h-6 text-black/30 dark:text-white/30" />
          </div>
          <h3 className="text-sm font-bold text-black dark:text-white mb-1">
            No Active Deliveries
          </h3>
          <p className="text-xs text-black/50 dark:text-white/50">
            Accepted deliveries will appear here
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="w-14 h-14 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
            <Search className="w-6 h-6 text-black/30 dark:text-white/30" />
          </div>
          <h3 className="text-sm font-bold text-black dark:text-white mb-1">
            No results found
          </h3>
          <p className="text-xs text-black/50 dark:text-white/50">
            Try a different search term
          </p>
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
    </div>
  );
};

export default ActiveDeliveriesPage;
