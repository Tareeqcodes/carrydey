'use client';
import React from 'react';
import { RefreshCw, Package, Inbox } from 'lucide-react';
import { motion } from 'framer-motion';
import DeliveryRequestCard from './DeliveryRequestCard';

const RequestsPage = ({
  deliveryRequests,
  loading,
  error,
  onRefresh,
  onAccept,
  onDecline,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-900 tracking-tight">
              Manage incoming delivery requests
            </h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50"
            title="Refresh requests"
          >
            <RefreshCw
              className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`}
            />
            <span className="text-sm font-medium text-gray-700">Refresh</span>
          </motion.button>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3"
          >
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-900">
                Error Loading Requests
              </p>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Content */}
        {loading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-gray-100" />
              <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-gray-900 animate-spin" />
            </div>
            <p className="text-sm text-gray-500 mt-4 font-medium">
              Loading requests...
            </p>
          </div>
        ) : deliveryRequests.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-gray-100 p-12 sm:p-16 text-center shadow-sm"
          >
            <div className="max-w-sm mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Inbox className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Pending Requests
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                New delivery requests will appear here. Check back later or
                refresh to see updates.
              </p>
            </div>
          </motion.div>
        ) : (
          // Requests Grid
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
          >
            {deliveryRequests.map((request, index) => (
              <motion.div
                key={request.id || request.$id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <DeliveryRequestCard
                  request={request}
                  onAccept={onAccept}
                  onDecline={onDecline}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RequestsPage;
