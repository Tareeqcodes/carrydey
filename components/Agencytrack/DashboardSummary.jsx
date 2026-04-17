'use client';
import React from 'react';
import { Truck, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardSummary = ({ activeDeliveries, drivers }) => {
  const summaryCards = [
    {
      title: 'Active Deliveries',
      value: activeDeliveries
        .filter((d) => d.status !== 'delivered')
        .length.toString(),
      icon: Truck,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      iconBg: 'bg-blue-500',
      changePositive: true,
    },
    {
      title: 'Available Drivers',
      value: drivers.filter((d) => d.status === 'available').length.toString(),
      icon: Users,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      iconBg: 'bg-green-500',
      changePositive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {summaryCards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="group relative overflow-hidden"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-30 dark:opacity-10 group-hover:opacity-60 dark:group-hover:opacity-20 transition-opacity duration-300`}
          />
          <div className="relative bg-white dark:bg-black rounded-3xl p-6 shadow-sm border border-black/10 dark:border-white/10 group-hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider mb-2">
                  {card.title}
                </p>
                <p className="text-4xl font-bold text-black dark:text-white">
                  {card.value}
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}
              >
                <card.icon className="w-7 h-7 text-white" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardSummary;
