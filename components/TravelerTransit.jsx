'use client';
import { useEffect, useState } from 'react';
import { databases, Query } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';
import { useEscrow } from '@/hooks/useEscrow';

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const applicationsCollection = process.env.NEXT_PUBLIC_APPWRITE_APPLICATIONS;
const packagesCollection =
  process.env.NEXT_PUBLIC_APPWRITE_PACKAGE_COLLECTION_ID;
const escrowCollection = process.env.NEXT_PUBLIC_APPWRITE_ESCROW_COLLECTION_ID;

export default function TravelerTransit() {
  const [transitPackages, setTransitPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const escrowHooks = useEscrow();
  const [processingId, setProcessingId] = useState(null);

  const fetchTransitApplications = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const packagesResponse = await databases.listDocuments(
        db,
        packagesCollection,
        [
          Query.equal('senderId', user.$id), // Get sender's packages
          Query.orderDesc('$createdAt'),
        ]
      );

      if (packagesResponse.documents.length === 0) {
        setTransitPackages([]);
        setLoading(false);
        return;
      }

      const packagesWithApplications = await Promise.all(
        packagesResponse.documents.map(async (pkg) => {
          try {
            // Get accepted application for this package
            const applicationsResponse = await databases.listDocuments(
              db,
              applicationsCollection,
              [
                Query.equal('packageId', pkg.$id),
                Query.equal('status', [
                  'Awaiting pickup',
                  'collected',
                  'delivered',
                ]), // In-transit statuses
                Query.limit(1),
              ]
            );

            if (applicationsResponse.documents.length === 0) {
              return null;
            }

            const application = applicationsResponse.documents[0];

            return {
              applicationId: application.$id,
              packageId: pkg.$id,
              title: pkg.title || 'Package',
              pickupLocation: pkg.pickupLocation || 'Pickup Location',
              deliveryLocation: pkg.deliveryLocation || 'Delivery Location',
              reward: pkg.reward || 0,
              deadline: pkg.deadline
                ? new Date(pkg.deadline).toLocaleDateString()
                : 'TBD',
              packageStatus: pkg.status || 'active',
              applicationStatus: application.status, // The current delivery status
              travelerId: application.travelerId,
              travelerMessage: application.travelerMessage || '',
              createdAt: application.$createdAt,
            };
          } catch (err) {
            console.error(
              'Error fetching application for package:',
              pkg.$id,
              err
            );
            return null;
          }
        })
      );

      const validPackages = packagesWithApplications.filter(
        (pkg) => pkg !== null
      );
      setTransitPackages(validPackages);
    } catch (err) {
      console.error('Error fetching accepted applications:', err);
      setError(err.message || 'Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransitApplications();
  }, [user]);

  if (loading) {
    return (
      <div className="p-5 pb-24">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 pb-24">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (transitPackages.length === 0) {
    return (
      <div className="p-5 pb-24">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Active Deliveries
          </h3>
          <p className="text-gray-600">
            You don't have any accepted delivery requests yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 pb-24">
      <div className="space-y-4">
        {transitPackages.map((pkg) => (
          <div
            key={pkg.applicationId}
            className="bg-white rounded-2xl p-5 shadow-md"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {pkg.title}
                </h3>
              </div>
              <div className="text-4xl">🚗</div>
            </div>

            {/* Route */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600 font-bold">●</span>
                <span className="text-sm text-gray-700">
                  {pkg.pickupLocation}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-600 font-bold">●</span>
                <span className="text-sm text-gray-700">
                  {pkg.deliveryLocation}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Deadline</p>
                <p className="font-semibold text-gray-900">{pkg.deadline}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Status</p>
                <p className="font-semibold text-blue-600 capitalize">
                  {pkg.packageStatus}
                </p>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-gradient-to-r from-teal-500 to-green-400 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">In Transit</h4>
                <span className="text-2xl">✓</span>
              </div>
              <p className="text-sm text-white/90">
                Your package is on its way
              </p>
              <p className="text-sm font-semibold mt-2">
                Estimated Arrival: Today, 6:30 PM
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
