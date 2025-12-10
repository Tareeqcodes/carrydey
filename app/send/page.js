'use client';
import { useState } from 'react';
import InputLocation from '@/components/InputLocation';
import DeliveryPreview from '@/components/DeliveryPreview';
import DeliveryReview from '@/components/DeliveryReview';
import { tablesDB, ID } from '@/lib/config/Appwriteconfig';

export default function CreateDelivery() {
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [deliveryCreated, setDeliveryCreated] = useState(false);
  const [savedDelivery, setSavedDelivery] = useState(null);

  const handleLocationSelect = (type, location) => {
    if (type === 'pickup') {
      setPickup(location);
    } else {
      setDropoff(location);
    }
  };

  const handleRouteCalculated = (data) => {
    setRouteData(data);
  };

  const handleShowPreview = () => {
    if (pickup && dropoff && routeData) {
      setShowPreview(true);
    }
  };

  const handleEditPreview = () => {
    setShowPreview(false);
  };

  const saveDeliveryToAppwrite = async () => {
    if (!pickup || !dropoff || !routeData) return;

    setLoading(true);
    try {
      // Prepare optimized data structure without routePolyline
      const deliveryData = {
        // Pickup location
        pickupAddress: pickup.place_name?.substring(0, 500) || 'Pickup location',
        pickupLat: pickup.geometry.coordinates[1],
        pickupLng: pickup.geometry.coordinates[0],
        
        // Dropoff location
        dropoffAddress: dropoff.place_name?.substring(0, 500) || 'Dropoff location',
        dropoffLat: dropoff.geometry.coordinates[1],
        dropoffLng: dropoff.geometry.coordinates[0],
        
        // Route information (essential data only)
        distance: parseFloat(routeData.distance),
        duration: parseInt(routeData.duration),
        estimatedFare: parseInt(routeData.estimatedFare),
        
        // Status
        status: 'pending',
      };

      console.log('Attempting to save delivery:', deliveryData);

      // Save to Appwrite
      const result = await tablesDB.createRow(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        ID.unique(),
        deliveryData
      );

      console.log('Delivery saved successfully:', result);
      
      // Transform result to match expected format for DeliveryReview
      const formattedDelivery = {
        ...result,
        pickup: {
          address: result.pickupAddress,
          coordinates: {
            lat: result.pickupLat,
            lng: result.pickupLng,
          },
        },
        dropoff: {
          address: result.dropoffAddress,
          coordinates: {
            lat: result.dropoffLat,
            lng: result.dropoffLng,
          },
        },
        route: {
          distance: result.distance,
          duration: result.duration,
          estimatedFare: result.estimatedFare,
        },
      };

      setSavedDelivery(formattedDelivery);
      setDeliveryCreated(true);
      setShowPreview(false);
    } catch (error) {
      console.error('Error saving delivery:', error);
      alert(`Error creating delivery: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDelivery = () => {
    setDeliveryCreated(false);
    setSavedDelivery(null);
    setShowPreview(false);
  };

  if (deliveryCreated && savedDelivery) {
    return (
      <DeliveryReview delivery={savedDelivery} onEdit={handleEditDelivery} />
    );
  }

  if (showPreview && pickup && dropoff && routeData) {
    return (
      <DeliveryPreview
        pickup={pickup}
        dropoff={dropoff}
        routeData={routeData}
        onEdit={handleEditPreview}
        onConfirm={saveDeliveryToAppwrite}
        loading={loading}
      />
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-[#3A0A21] to-black text-white">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center pt-10 mb-6">
          Book Your Delivery
        </h1>
        <div>
          <InputLocation
            onLocationSelect={handleLocationSelect}
            onRouteCalculated={handleRouteCalculated}
            pickup={pickup}
            dropoff={dropoff}
            routeData={routeData}
            onCalculate={handleShowPreview}
          />
        </div>
      </div>
    </div>
  );
}