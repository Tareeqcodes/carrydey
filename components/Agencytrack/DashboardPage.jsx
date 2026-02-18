'use client';
import React from 'react';
import { Navigation, Truck, MapPin, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardSummary from './DashboardSummary';

const DashboardPage = ({ activeDeliveries, drivers, onNavigateToTracking }) => {
  const activeDrivers = drivers.filter((d) => d.status === 'on_delivery');
  // const deliveriesInProgress = activeDeliveries.filter(
  //   (d) => !['delivered', 'pending_assignment'].includes(d.status)
  // ).length;

  return ( 
    <div className="space-y-8 px-3 pb-16">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl pt-5 pl-4 font-semibold text-gray-900 mb-2 tracking-tight">
          Dashboard Overview
        </h1>
      </motion.div>

      {/* Summary Cards */}
      <DashboardSummary activeDeliveries={activeDeliveries} drivers={drivers} />

      {/* Map Section - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Real-time delivery routes</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNavigateToTracking}
              className="px-3 py-3 bg-gradient-to-r from-[#3A0A21] to-[#5A0A31] text-white rounded-2xl text-sm font-semibold hover:shadow-xl hover:shadow-[#3A0A21]/30 transition-all flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span className="text-xs">View Full Map</span>
            </motion.button>
          </div>
        </div>

        {/* Map Content */}
        <div className="p-6">
          <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl h-80 overflow-hidden border-2 border-gray-100">
            {/* Decorative Grid Pattern */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `
                linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }} />

            {/* Driver Markers */}
            {activeDrivers.length > 0 ? (
              activeDrivers.map((driver, index) => (
                <motion.div
                  key={driver.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${20 + index * 25}%`,
                    top: `${30 + index * 15}%`,
                  }}
                  whileHover={{ scale: 1.2 }}
                >

                  {/* Driver Icon */}
                  <div className="relative flex flex-col items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full border-4 border-white flex items-center justify-center shadow-xl">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white px-3 py-1.5 rounded-xl text-xs font-bold mt-2 shadow-lg border border-gray-200 whitespace-nowrap">
                      {driver.name.split(' ')[0]}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : null}

            {/* Center Info */}
            {/* <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200 max-w-sm"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {deliveriesInProgress}
                </p>
                <p className="font-semibold text-gray-700 mb-1">
                  Deliveries in Progress
                </p>
                <p className="text-sm text-gray-500">
                  Click "View Full Map" for live tracking
                </p>
              </motion.div>
            </div> */}
          </div>

          {/* Quick Stats Row */}
          {/* <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
              <p className="text-2xl font-bold text-blue-900">{activeDrivers.length}</p>
              <p className="text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wide">Active Drivers</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
              <p className="text-2xl font-bold text-green-900">{deliveriesInProgress}</p>
              <p className="text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wide">In Transit</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
              <p className="text-2xl font-bold text-purple-900">
                {drivers.filter((d) => d.status === 'available').length}
              </p>
              <p className="text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wide">Available</p>
            </div>
          </div> */}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;