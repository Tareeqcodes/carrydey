'use client';
import React from 'react';
import { Navigation, Truck } from 'lucide-react';
import DashboardSummary from './DashboardSummary';

const DashboardPage = ({ activeDeliveries, drivers, onNavigateToTracking }) => {
  

  return (
    <div className="space-y-6">
      <DashboardSummary activeDeliveries={activeDeliveries} drivers={drivers} />

      <div className="grid grid-cols-1 lg:grid-cols-1">
        {/* Map Preview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Active Delivery Routes</h3>
            <button
              onClick={onNavigateToTracking}
              className="px-4 py-2 bg-[#3A0A21] text-white rounded-xl text-sm hover:bg-[#4A0A31] transition-colors flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              View Full Map
            </button>
          </div>
          <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center relative">
            {drivers
              .filter((d) => d.status === 'on_delivery')
              .map((driver, index) => (
                <div
                  key={driver.id}
                  className="absolute"
                  style={{
                    left: `${20 + index * 25}%`,
                    top: `${30 + index * 15}%`,
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
              <p className="font-medium">
                {
                  activeDeliveries.filter(
                    (d) => !['delivered', 'pending_assignment'].includes(d.status)
                  ).length
                }{' '}
                deliveries in progress
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Click "View Full Map" for live tracking
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;