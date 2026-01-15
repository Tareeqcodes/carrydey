'use client';
import { useState, useEffect } from 'react';

export const useDeliveryManagement = (initialRequests = []) => {
  const [deliveryRequests, setDeliveryRequests] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([
    {
      id: 101,
      driver: 'Michael Chen',
      driverId: 1,
      status: 'in_transit',
      progress: 65,
      pickup: 'Warehouse A',
      dropoff: 'Customer Office',
      estimatedTime: '30 min',
      packageSize: 'Medium',
      payout: '$45.00',
      pickupCode: 'A1B2C3',
      customerName: 'John Smith',
      customerPhone: '+1 (555) 123-4567',
      latitude: 40.7128,
      longitude: -74.006,
    },
    {
      id: 102,
      driver: 'Sarah Johnson',
      driverId: 2,
      status: 'picked_up',
      progress: 30,
      pickup: 'Retail Store',
      dropoff: 'Residential',
      estimatedTime: '45 min',
      packageSize: 'Large',
      payout: '$68.50',
      pickupCode: 'X7Y8Z9',
      customerName: 'Mike Wilson',
      customerPhone: '+1 (555) 456-7890',
      latitude: 40.7589,
      longitude: -73.9851,
    },
  ]);

  useEffect(() => {
    if (initialRequests && initialRequests.length > 0) {
      setDeliveryRequests(initialRequests);
    }
  }, [initialRequests]);

  const acceptRequest = (requestId) => {
    const request = deliveryRequests.find((r) => r.id === requestId);
    if (!request) return null;

    setDeliveryRequests((prev) => prev.filter((r) => r.id !== requestId));

    const newDelivery = {
      id: Date.now(),
      driver: 'Unassigned',
      driverId: null,
      status: 'pending_assignment',
      progress: 0,
      pickup: request.pickup,
      dropoff: request.dropoff,
      estimatedTime: 'Not assigned',
      packageSize: request.packageSize,
      payout: request.payout,
      customerName: request.customerName,
      customerPhone: request.customerPhone,
      instructions: request.instructions,
      pickupCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
    };

    setActiveDeliveries((prev) => [...prev, newDelivery]);
    return newDelivery;
  };

  const declineRequest = (requestId) => {
    setDeliveryRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const assignDelivery = (deliveryId, driverId, driverName) => {
    setActiveDeliveries((prev) =>
      prev.map((delivery) =>
        delivery.id === deliveryId
          ? {
              ...delivery,
              driver: driverName,
              driverId: driverId,
              status: 'assigned',
              progress: 10,
              estimatedTime: '45 min',
              latitude: 40.7489 + Math.random() * 0.02,
              longitude: -73.968 + Math.random() * 0.02,
            }
          : delivery
      )
    );
  };

  const updateDeliveryStatus = (deliveryId, newStatus) => {
    const progressMap = {
      assigned: 10,
      pickup: 30,
      in_transit: 65,
      delivered: 100,
    };

    setActiveDeliveries((prev) =>
      prev.map((delivery) =>
        delivery.id === deliveryId
          ? {
              ...delivery,
              status: newStatus,
              progress: progressMap[newStatus] || delivery.progress,
              estimatedTime: newStatus === 'delivered' ? 'Completed' : delivery.estimatedTime,
            }
          : delivery
      )
    );

    // Return the delivery and driver info for earnings update
    const delivery = activeDeliveries.find((d) => d.id === deliveryId);
    return delivery;
  };

  return {
    deliveryRequests,
    activeDeliveries,
    acceptRequest,
    declineRequest,
    assignDelivery,
    updateDeliveryStatus,
  };
};