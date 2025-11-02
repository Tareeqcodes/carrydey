import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { databases, Query } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const applicationsCollection = process.env.NEXT_PUBLIC_APPWRITE_APPLICATIONS;
const usersCollection = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;
const packagesCollection =
  process.env.NEXT_PUBLIC_APPWRITE_PACKAGE_COLLECTION_ID;

export default function useSenderRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchAllRequests = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Step 1: Get all packages belonging to the sender
      const packagesResponse = await databases.listDocuments(
        db,
        packagesCollection,
        [Query.equal('senderId', user.$id), Query.orderDesc('$createdAt')]
      );

      if (packagesResponse.documents.length === 0) {
        setRequests([]);
        return;
      }

      // Step 2: Get all applications for these packages
      const packageIds = packagesResponse.documents.map(
        (pkg) => pkg.packageId || pkg.$id
      );

      const applicationsResponse = await databases.listDocuments(
        db,
        applicationsCollection,
        [Query.equal('packageId', packageIds), Query.orderDesc('$createdAt')]
      );

      if (applicationsResponse.documents.length === 0) {
        setRequests([]);
        return;
      }

      const requestsWithDetails = await Promise.all(
        applicationsResponse.documents.map(async (application) => {
          try {
            // Get the package details
            const packageData = packagesResponse.documents.find(
              (pkg) => (pkg.packageId || pkg.$id) === application.packageId
            );

            // Get traveler user data
            const travelerResponse = await databases.listDocuments(
              db,
              usersCollection,
              [Query.equal('userId', application.travelerId)]
            );

            const travelerData = travelerResponse.documents[0];

            return {
              id: application.$id,
              applicationId: application.$id,
              travelerId: application.travelerId,
              message:
                application.travelerMessage ||
                "I'm interested in delivering this package.",
              status: application.status || 'pending',
              appliedAt: formatDistanceToNow(new Date(application.$createdAt), {
                addSuffix: true,
              }),
              createdAt: application.$createdAt,

              traveler:
                travelerData?.userName ||
                travelerData?.name ||
                'Unknown Traveler',
              rating: travelerData?.rating || 4.5,
              completedTrips: travelerData?.completedTrips || 0,
              verified: travelerData?.verified || false,
              phoneNumber: travelerData?.phoneNumber || null,

              // Package info
              packageId: application.packageId,
              packageTitle: packageData?.title,
              packageDescription: packageData?.description || '',
              pickupLocation:
                packageData?.pickupLocation ||
                packageData?.from ||
                'Pickup Location',
              deliveryLocation:
                packageData?.deliveryLocation ||
                packageData?.to ||
                'Delivery Location',
              reward: packageData?.reward || packageData?.price || 0,
              size: packageData?.size || 'Medium',
              deadline: packageData?.deadline
                ? formatDistanceToNow(new Date(packageData.deadline), {
                    addSuffix: true,
                  })
                : 'No deadline',
              packageStatus: packageData?.status || 'active',
            };
          } catch (err) {
            console.error(
              'Error fetching details for application:',
              application.$id,
              err
            );
            // Return minimal data if fetching details fails
            const packageData = packagesResponse.documents.find(
              (pkg) => (pkg.packageId || pkg.$id) === application.packageId
            );

            return {
              id: application.$id,
              applicationId: application.$id,
              travelerId: application.travelerId,
              message:
                application.travelerMessage ||
                "I'm interested in delivering this package.",
              status: application.status || 'pending',
              appliedAt: application.$createdAt,
              createdAt: application.$createdAt,
              traveler: 'Unknown Traveler',
              rating: 4.5,
              completedTrips: 0,
              verified: false,
              phoneNumber: null,

              packageId: application.packageId,
              packageTitle: packageData?.title,
              packageDescription: packageData?.description || '',
              pickupLocation:
                packageData?.pickupLocation ||
                packageData?.from ||
                'Pickup Location',
              deliveryLocation:
                packageData?.deliveryLocation || 'Delivery Location',
              reward: packageData?.reward || packageData?.price || 0,
              size: packageData?.size || 'Medium',
              deadline: packageData?.deadline
                ? new Date(packageData.deadline).toLocaleDateString()
                : 'TBD',
              packageStatus: packageData?.status || 'active',
            };
          }
        })
      );

      // Group requests by package for better organization
      const groupedRequests = groupRequestsByPackage(requestsWithDetails);

      setRequests(requestsWithDetails);
      console.log('Grouped by packages:', groupedRequests);
    } catch (err) {
      console.error('Error fetching sender requests:', err);
      setError(err.message || 'Failed to fetch delivery requests');
    } finally {
      setLoading(false);
    }
  };

  const groupRequestsByPackage = (requests) => {
    const grouped = {};

    requests.forEach((request) => {
      const packageId = request.packageId;
      if (!grouped[packageId]) {
        grouped[packageId] = {
          packageInfo: {
            id: packageId,
            title: request.packageTitle,
            description: request.packageDescription,
            pickupLocation: request.pickupLocation,
            deliveryLocation: request.deliveryLocation,
            reward: request.reward,
            size: request.size,
            deadline: request.deadline,
            status: request.packageStatus,
          },
          requests: [],
        };
      }
      grouped[packageId].requests.push(request);
    });

    return grouped;
  };

  const updateRequestStatus = async (applicationId, newStatus) => {
    try {
      const updatedDoc = await databases.updateDocument(
        db,
        applicationsCollection,
        applicationId,
        {
          status: newStatus,
        }
      );

      // Update local state
      setRequests((prev) =>
        prev.map((req) =>
          req.applicationId === applicationId
            ? { ...req, status: newStatus }
            : req
        )
      );

      return { success: true, data: updatedDoc };
    } catch (err) {
      console.error('Error updating request status:', err);
      const errorMessage = err.message || 'Failed to update request status';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, [user]);

  const groupedRequests = groupRequestsByPackage(requests);

  return {
    requests,
    groupedRequests,
    loading,
    error,
    refetch: fetchAllRequests,
    updateStatus: updateRequestStatus,
    totalRequests: requests.length,
  };
}
