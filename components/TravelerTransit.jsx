'use client';
import { useEffect, useState } from 'react';
import { MapPin, DollarSign, Calendar } from 'lucide-react';
import { databases, Query } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';
import { useEscrow } from '@/hooks/useEscrow';
import { getStatusLabel, getStatusColor, EscrowBadge } from './StatusBadge';

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
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {pkg.title}
                </h3>
                <div className='flex gap-2 mt-2'>
                  {/* Delivery Status Badge */}
                  <span className={`text-xs font-semibold ${getStatusColor(pkg.applicationStatus)}`}>
                    {getStatusLabel(pkg.applicationStatus)}
                  </span>
                </div>
              </div>
              <div className="text-4xl">
                {pkg.applicationStatus === 'Awaiting pickup' ? '📦' : 
                 pkg.applicationStatus === 'collected' ? '🚗' : '📍'}
              </div>
            </div>

            <div className="p-5 bg-gray-50">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Pickup</p>
                    <p className="text-sm font-medium text-gray-900">
                      {pkg.pickupLocation}
                    </p>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-dashed border-gray-300 h-4"></div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Delivery</p>
                    <p className="text-sm font-medium text-gray-900">
                      {pkg.deliveryLocation}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Deadline</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(pkg.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Payment</p>
                  <p className="text-sm font-medium text-gray-900">
                    ₦{pkg.reward.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 pb-5">
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-xs text-blue-600 font-medium mb-1">
                  Estimated Arrival
                </p>
                <p className="text-sm text-blue-900">Tomorrow, 2:00 PM</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
