'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LocationAndPreviewScreen from '@/components/LocationAndPreviewScreen';
import PackageAndFareScreen from '@/components/PackageAndFareScreen';
import { tablesDB, ID } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';
import NotUser from '@/hooks/NotUser';

export default function CreateDelivery() {
  const router = useRouter();
  
  const [currentScreen, setCurrentScreen] = useState('location');
  const [deliveryData, setDeliveryData] = useState({
    pickup: null,
    dropoff: null,
    routeData: null,
    packageDetails: null,
    fareDetails: null,
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const storedData = sessionStorage.getItem('deliveryData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setDeliveryData((prev) => ({
          ...prev,
          pickup: data.pickup,
          dropoff: data.dropoff,
          routeData: data.routeData,
        }));

        if (
          data.skipLocationScreen &&
          data.pickup &&
          data.dropoff &&
          data.routeData
        ) {
          setCurrentScreen('package');
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

  const handleLocationsConfirmed = (pickup, dropoff, routeData) => {
    setDeliveryData((prev) => ({
      ...prev,
      pickup,
      dropoff,
      routeData,
    }));
    setCurrentScreen('package');
  };

  const handlePackageConfirmed = (packageDetails, fareDetails) => {
    setDeliveryData((prev) => ({
      ...prev,
      packageDetails,
      fareDetails,
    }));
    saveDeliveryToAppwrite(packageDetails, fareDetails);
  };

  const handleBackToLocations = () => {
    setCurrentScreen('location');
  };

  const saveDeliveryToAppwrite = async (packageDetails, fareDetails) => {
    const { pickup, dropoff, routeData } = deliveryData;
    if (!pickup || !dropoff || !routeData) return;

    setLoading(true);
    try {
      const deliveryId = ID.unique();

      const deliveryDataToSave = {
        pickupAddress:
          pickup.place_name?.substring(0, 500) || 'Pickup location',
        pickupLat: pickup.geometry.coordinates[1],
        pickupLng: pickup.geometry.coordinates[0],
        dropoffAddress:
          dropoff.place_name?.substring(0, 500) || 'Dropoff location',
        dropoffLat: dropoff.geometry.coordinates[1],
        dropoffLng: dropoff.geometry.coordinates[0],
        distance: parseFloat(routeData.distance),
        duration: parseInt(routeData.duration),
        status: 'pending',

        pickupContactName: packageDetails?.pickupContact?.pickupContactName,
        pickupPhone: packageDetails?.pickupContact?.pickupPhone,

        pickupInstructions: packageDetails?.pickupContact?.pickupInstructions,

        dropoffContactName: packageDetails?.dropoffContact?.dropoffContactName,
        dropoffPhone: packageDetails?.dropoffContact?.dropoffPhone,

        dropoffInstructions:
          packageDetails?.dropoffContact?.dropoffInstructions,
        recipientPermission:
          packageDetails?.dropoffContact?.recipientPermission,
        suggestedFare: parseInt(
          fareDetails.suggestedFare || routeData.estimatedFare
        ),
        offeredFare: parseInt(
          fareDetails.offeredFare || routeData.estimatedFare
        ),
        packageSize: packageDetails?.size,
        packageDescription: packageDetails?.description,
        isFragile: packageDetails?.isFragile || false,
        pickupTime: packageDetails?.pickupTime || 'courier',
        userId: user.$id,
        assignedAgencyId: null,
        // trackingToken: trackingToken,
      };

      const result = await tablesDB.createRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: deliveryDataToSave,
      });

      console.log('Delivery created successfully:', result);
      sessionStorage.setItem('latestDeliveryId', deliveryId);
      router.push('/check');
    } catch (error) {
      console.error('Error saving delivery:', error);
      alert(`Error creating delivery: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === 'location' ? (
        <LocationAndPreviewScreen
          pickup={deliveryData.pickup}
          dropoff={deliveryData.dropoff}
          routeData={deliveryData.routeData}
          onLocationsConfirmed={handleLocationsConfirmed}
        />
      ) : (
        <PackageAndFareScreen
          delivery={deliveryData}
          onBack={handleBackToLocations}
          onPackageConfirmed={handlePackageConfirmed}
          loading={loading}
        />
      )}
    </div>
  );
}
