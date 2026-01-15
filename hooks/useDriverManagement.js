'use client';
import { useState } from 'react';

export const useDriverManagement = () => {
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: 'Michael Chen',
      phone: '+1 (555) 123-4567',
      status: 'on_delivery',
      assignedDelivery: '#101 - Downtown',
      vehicle: 'Van #A-101',
      earningsToday: 245.5,
      deliveriesToday: 8,
      latitude: 40.7128,
      longitude: -74.006,
      lastUpdate: '2 min ago',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      phone: '+1 (555) 987-6543',
      status: 'on_delivery',
      assignedDelivery: '#102 - Uptown',
      vehicle: 'Van #A-102',
      earningsToday: 189.75,
      deliveriesToday: 6,
      latitude: 40.7589,
      longitude: -73.9851,
      lastUpdate: '5 min ago',
    },
    {
      id: 3,
      name: 'David Wilson',
      phone: '+1 (555) 456-7890',
      status: 'available',
      assignedDelivery: null,
      vehicle: 'Van #A-103',
      earningsToday: 156.25,
      deliveriesToday: 5,
      lastUpdate: '10 min ago',
    },
    {
      id: 4,
      name: 'Lisa Brown',
      phone: '+1 (555) 789-0123',
      status: 'available',
      assignedDelivery: null,
      vehicle: 'Van #A-104',
      earningsToday: 0,
      deliveriesToday: 0,
      lastUpdate: 'Just now',
    },
  ]);

  const addDriver = () => {
    const newDriver = {
      id: drivers.length + 1,
      name: `Driver ${drivers.length + 1}`,
      phone: '+1 (555) 000-0000',
      status: 'available',
      assignedDelivery: null,
      vehicle: 'Van #NEW',
      earningsToday: 0,
      deliveriesToday: 0,
      lastUpdate: 'Just now',
    };
    setDrivers((prev) => [...prev, newDriver]);
  };

  const toggleDriverStatus = (id) => {
    setDrivers((prev) =>
      prev.map((driver) =>
        driver.id === id
          ? {
              ...driver,
              status: driver.status === 'available' ? 'offline' : 'available',
              assignedDelivery:
                driver.status === 'available' ? driver.assignedDelivery : null,
            }
          : driver
      )
    );
  };

  const assignDriverToDelivery = (driverId, deliveryId) => {
    setDrivers((prev) =>
      prev.map((driver) =>
        driver.id === driverId
          ? {
              ...driver,
              status: 'on_delivery',
              assignedDelivery: `#${deliveryId}`,
              latitude: 40.7489 + Math.random() * 0.02,
              longitude: -73.968 + Math.random() * 0.02,
              lastUpdate: 'Just now',
            }
          : driver
      )
    );
  };

  const updateDriverEarnings = (driverId, amount) => {
    setDrivers((prev) =>
      prev.map((driver) =>
        driver.id === driverId
          ? {
              ...driver,
              status: 'available',
              assignedDelivery: null,
              earningsToday: driver.earningsToday + amount,
              deliveriesToday: driver.deliveriesToday + 1,
              lastUpdate: 'Just now',
            }
          : driver
      )
    );
  };

  return {
    drivers,
    addDriver,
    toggleDriverStatus,
    assignDriverToDelivery,
    updateDriverEarnings,
  };
};