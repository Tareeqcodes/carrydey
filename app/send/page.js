'use client';
import { useState, useEffect } from 'react';
import InputLocation from '@/components/InputLocation';
import DeliveryPreview from '@/components/DeliveryPreview';
import DeliveryReview from '@/components/DeliveryReview';
import { tablesDB, ID } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';
import NotUser from '@/hooks/NotUser';

export default function CreateDelivery() {
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [deliveryCreated, setDeliveryCreated] = useState(false);
  const [savedDelivery, setSavedDelivery] = useState(null);
  const { user } = useAuth();

  // Check for location data passed from homepage
  useEffect(() => {
    const storedData = sessionStorage.getItem('deliveryData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setPickup(data.pickup);
        setDropoff(data.dropoff);
        setRouteData(data.routeData);
        
        if (data.pickup && data.dropoff && data.routeData) {
          setShowPreview(true);
        }
        
        sessionStorage.removeItem('deliveryData');
      } catch (error) {
        console.error('Error parsing stored delivery data:', error);
      }
    }
  }, []);

  if (!user) {
    return <NotUser />;
  }

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
      const deliveryData = {
        pickupAddress: pickup.place_name?.substring(0, 500) || 'Pickup location',
        pickupLat: pickup.geometry.coordinates[1],
        pickupLng: pickup.geometry.coordinates[0],
        dropoffAddress: dropoff.place_name?.substring(0, 500) || 'Dropoff location',
        dropoffLat: dropoff.geometry.coordinates[1],
        dropoffLng: dropoff.geometry.coordinates[0],
        distance: parseFloat(routeData.distance),
        duration: parseInt(routeData.duration),
        estimatedFare: parseInt(routeData.estimatedFare),
        status: 'pending',
      };

      const result = await tablesDB.createRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: ID.unique(),
        data: deliveryData,
      });

      const formattedDelivery = {
        ...result,
        pickup: {
          address: result.pickupAddress,
          coordinates: { lat: result.pickupLat, lng: result.pickupLng },
        },
        dropoff: {
          address: result.dropoffAddress,
          coordinates: { lat: result.dropoffLat, lng: result.dropoffLng },
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mt-20 mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#3A0A21] mb-4">
            Send Your Delivery
          </h1>
          <p className="text-sm md:text-lg text-gray-600">
            Enter your pickup and dropoff locations to get started
          </p>
        </div>

        <div>
          <InputLocation
            onLocationSelect={handleLocationSelect}
            onRouteCalculated={handleRouteCalculated}
            pickup={pickup}
            dropoff={dropoff}
            onCalculate={handleShowPreview}
            showNextButton={true}
          />
        </div>
      </div>
    </div>
  );
}