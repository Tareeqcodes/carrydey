'use client';
import React from 'react';
import { Truck, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardSummary = ({ activeDeliveries, drivers }) => {
  const summaryCards = [
    {
      title: 'Active Deliveries',
      value: activeDeliveries.filter((d) => d.status !== 'delivered').length.toString(),
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
      // change: '+5%',
      changePositive: true,
    },
    // {
    //   title: 'Total Drivers',
    //   value: drivers.length.toString(),
    //   icon: Package,
    //   gradient: 'from-purple-500 to-pink-600',
    //   bgGradient: 'from-purple-50 to-pink-50',
    //   iconBg: 'bg-purple-500',
    //   change: 'Stable',
    //   changePositive: true,
    // },
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
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
          
          {/* Card Content */}
          <div className="relative bg-white rounded-3xl p-6 shadow-sm border border-gray-100 group-hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {card.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-gray-900">{card.value}</p>
                  {/* <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    card.changePositive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {card.change}
                  </span> */}
                </div>
              </div>
              
              {/* Icon with Gradient */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}
                style={{ 
                  boxShadow: `0 10px 25px -5px ${card.iconBg}33, 0 8px 10px -6px ${card.iconBg}33` 
                }}
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