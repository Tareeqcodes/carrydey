'use client';
import { useState, useEffect } from 'react';
import {
  CheckCircle,
  MapPin,
  ArrowLeft,
  Clock,
  Truck,
  Package,
} from 'lucide-react';
import { databases, Query } from '@/lib/config/Appwriteconfig';
import { getStatusLabel, getStatusColor } from '@/components/StatusBadge';
import Header from '@/hooks/Header';
import { useAuth } from '@/hooks/Authcontext';

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const applicationsCollection = process.env.NEXT_PUBLIC_APPWRITE_APPLICATIONS;
const packagesCollection =
  process.env.NEXT_PUBLIC_APPWRITE_PACKAGE_COLLECTION_ID;

export default function TravelerDeliveries() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchTravelerDeliveries();
  }, [user]);

  const fetchTravelerDeliveries = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const applicationsResponse = await databases.listDocuments(
        db,
        applicationsCollection,
        [Query.equal('travelerId', user.$id), Query.orderDesc('$createdAt')]
      );

      if (applicationsResponse.documents.length === 0) {
        setDeliveries([]);
        return;
      }

      // Step 2: Fetch package details for each application
      const deliveriesWithPackages = await Promise.all(
        applicationsResponse.documents.map(async (app) => {
          try {
            const packageResponse = await databases.listDocuments(
              db,
              packagesCollection,
              [Query.equal('$id', app.packageId)]
            );

            const packageData = packageResponse.documents[0];

            return {
              applicationId: app.$id,
              packageId: app.packageId,
              status: app.status || 'pending',
              createdAt: app.$createdAt,
              title: packageData?.title || 'Package Delivery',
              pickup: packageData?.pickupLocation || 'Pickup Location',
              dropoff: packageData?.deliveryLocation || 'Delivery Location',
              reward: packageData?.reward || 0,
              deadline: packageData?.deadline
                ? new Date(packageData.deadline).toLocaleDateString()
                : 'TBD',
              packageStatus: packageData?.status || 'active',
            };
          } catch (err) {
            console.error(
              'Error fetching package for application:',
              app.$id,
              err
            );
            return {
              applicationId: app.$id,
              packageId: app.packageId,
              status: app.status || 'pending',
              createdAt: app.$createdAt,
              title: 'Package Delivery',
              pickup: 'Pickup Location',
              dropoff: 'Delivery Location',
              reward: 0,
              deadline: 'TBD',
              packageStatus: 'active',
            };
          }
        })
      );

      setDeliveries(deliveriesWithPackages);
    } catch (err) {
      console.error('Error fetching traveler deliveries:', err);
      setError(err.message || 'Failed to fetch deliveries');
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (applicationId, newStatus) => {
    try {
      setUpdating(applicationId);

      // Update delivery application status
      await databases.updateDocument(
        db,
        applicationsCollection,
        applicationId,
        { status: newStatus }
      );

      // Also update package status
      const delivery = deliveries.find(
        (d) => d.applicationId === applicationId
      );
      if (delivery) {
        const packageUpdateStatus =
          newStatus === 'collected'
            ? 'in_transit'
            : newStatus === 'delivered'
            ? 'delivered'
            : newStatus;

        await databases.updateDocument(
          db,
          packagesCollection,
          delivery.packageId,
          { status: packageUpdateStatus }
        );
      }

      // Update local state
      setDeliveries((prev) =>
        prev.map((d) =>
          d.applicationId === applicationId ? { ...d, status: newStatus } : d
        )
      );
    } catch (err) {
      console.error('Error updating delivery status:', err);
      setError(err.message || 'Failed to update delivery status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading deliveries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <Header title="My Deliveries" showBack />

      <div className="p-5 space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {deliveries.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600 font-medium">No deliveries yet</p>
            <p className="text-gray-500 text-sm mt-1">
              Accept packages to get started
            </p>
          </div>
        ) : (
          deliveries.map((delivery) => (
            <div
              key={delivery.applicationId}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              {/* Header with title and status badge */}
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {delivery.title}
                  </h2>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${getStatusColor(
                    delivery.status
                  )}`}
                >
                  {getStatusLabel(delivery.status)}
                </span>
              </div>

              {/* Location details */}
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Pickup</p>
                    <p className="text-gray-900 font-medium">
                      {delivery.pickup}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Delivery</p>
                    <p className="text-gray-900 font-medium">
                      {delivery.dropoff}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reward and deadline */}
              <div className="mt-4 flex justify-between items-center text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Payment</p>
                  <p className="text-green-600 font-semibold text-lg">
                    ₦{delivery.reward.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock size={14} />
                  <span className="text-xs">Due: {delivery.deadline}</span>
                </div>
              </div>

              {/* Action button */}
              <div className="mt-5">
                {delivery.status === 'Awaiting pickup' ? (
                  <button
                    onClick={() =>
                      updateDeliveryStatus(delivery.applicationId, 'collected')
                    }
                    disabled={updating === delivery.applicationId}
                    className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Package size={18} />
                    {updating === delivery.applicationId
                      ? 'Processing...'
                      : 'Confirm Pickup'}
                  </button>
                ) : delivery.status === 'collected' ? (
                  <button
                    onClick={() =>
                      updateDeliveryStatus(delivery.applicationId, 'delivered')
                    }
                    disabled={updating === delivery.applicationId}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Truck size={18} />
                    {updating === delivery.applicationId
                      ? 'Processing...'
                      : 'Mark as Delivered'}
                  </button>
                ) : delivery.status === 'delivered' ? (
                  <div className="flex items-center justify-center gap-2 text-purple-600 font-medium bg-purple-50 py-3 rounded-xl">
                    <Clock size={18} />
                    <span>Awaiting Sender Confirmation</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-green-600 font-medium bg-green-50 py-3 rounded-xl">
                    <CheckCircle size={18} />
                    <span>Delivery Completed </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
