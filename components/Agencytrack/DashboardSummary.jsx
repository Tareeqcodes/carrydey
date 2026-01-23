'use client';
import React from 'react';
import { Truck, Users } from 'lucide-react';

const DashboardSummary = ({ activeDeliveries, drivers }) => {
  const summaryCards = [
  
    {
      title: 'Active Deliveries',
      value: activeDeliveries.filter((d) => d.status !== 'delivered').length.toString(),
      icon: Truck,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Available Drivers',
      value: drivers.filter((d) => d.status === 'available').length.toString(),
      icon: Users,
      color: 'bg-green-100 text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {summaryCards.map((card, index) => (
        <div 
          key={index}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">{card.title}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardSummary;