import { useState, useEffect } from 'react';
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
        [Query.equal('userId', user.$id), Query.orderDesc('$createdAt')]
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

      // Step 3: Fetch traveler details for each application and combine with package info
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
              // Application info
              id: application.$id,
              applicationId: application.$id,
              travelerId: application.travelerId,
              message:
                application.message ||
                "I'm interested in delivering this package.",
              status: application.status || 'pending',
              appliedAt: getTimeAgo(application.$createdAt),
              createdAt: application.$createdAt,

              // Traveler info
              traveler:
                travelerData?.userName ||
                travelerData?.name ||
                'Unknown Traveler',
              rating: travelerData?.rating || 4.5,
              completedTrips: travelerData?.completedTrips || 0,
              verified: travelerData?.verified || false,
              phoneNumber: travelerData?.phoneNumber || null,
              profileImage: travelerData?.profileImage || null,

              // Package info
              packageId: application.packageId,
              packageTitle:
                packageData?.title ||
                packageData?.itemName ||
                'Package Delivery',
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
                ? new Date(packageData.deadline).toLocaleDateString()
                : 'TBD',
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
                application.message ||
                "I'm interested in delivering this package.",
              status: application.status || 'pending',
              appliedAt: getTimeAgo(application.$createdAt),
              createdAt: application.$createdAt,

              traveler: 'Unknown Traveler',
              rating: 4.5,
              completedTrips: 0,
              verified: false,
              phoneNumber: null,
              profileImage: null,

              packageId: application.packageId,
              packageTitle:
                packageData?.title ||
                packageData?.itemName ||
                'Package Delivery',
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
      console.log('All requests fetched:', requestsWithDetails.length);
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

  const getTimeAgo = (dateString) => {
    try {
      const now = new Date();
      const created = new Date(dateString);
      const diffInMinutes = Math.floor((now - created) / (1000 * 60));

      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60)
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24)
        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7)
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;

      return created.toLocaleDateString();
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Unknown time';
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

    pendingCount: requests.filter((r) => r.status === 'pending').length,
    acceptedCount: requests.filter((r) => r.status === 'accepted').length,
    declinedCount: requests.filter((r) => r.status === 'declined').length,
    packagesWithRequests: Object.keys(groupedRequests).length,
  };
}
