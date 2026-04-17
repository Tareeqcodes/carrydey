'use client';
import React from 'react';
import { RefreshCw, Inbox } from 'lucide-react';
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
    <div className="min-h-screen bg-white dark:bg-black p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <h1 className="text-lg md:text-xl font-semibold text-black dark:text-white tracking-tight">
            Manage incoming delivery requests
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 text-black/60 dark:text-white/60 ${loading ? 'animate-spin' : ''}`}
            />
            <span className="text-sm font-medium text-black dark:text-white">
              Refresh
            </span>
          </motion.button>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl p-4 flex items-start gap-3"
          >
            <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-900 dark:text-red-300">
                Error Loading Requests
              </p>
              <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">
                {error}
              </p>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-black/10 dark:border-white/10" />
              <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-black dark:border-t-white animate-spin" />
            </div>
            <p className="text-sm text-black/50 dark:text-white/50 mt-4 font-medium">
              Loading requests...
            </p>
          </div>
        ) : deliveryRequests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-black rounded-3xl border border-black/10 dark:border-white/10 p-12 sm:p-16 text-center shadow-sm"
          >
            <div className="max-w-sm mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
                <Inbox className="w-10 h-10 text-black/30 dark:text-white/30" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                No Pending Requests
              </h3>
              <p className="text-sm text-black/50 dark:text-white/50 leading-relaxed">
                New delivery requests will appear here. Check back later or
                refresh to see updates.
              </p>
            </div>
          </motion.div>
        ) : (
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
