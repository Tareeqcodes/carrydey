'use client'
import { useState, useEffect } from 'react';
import { databases, Query } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';
import useEsrow from './useEsrow';

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const applicationsCollection = process.env.NEXT_PUBLIC_APPWRITE_APPLICATIONS;
const usersCollection = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;
const packagesCollection = process.env.NEXT_PUBLIC_APPWRITE_PACKAGE_COLLECTION_ID; 
const escrowCollection = process.env.NEXT_PUBLIC_APPWRITE_CONTRACTS_COLLECTION_ID;

export default function useSenderRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const escrow = useEsrow();

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

      // Step 3: Get escrow data for applications
      const applicationIds = applicationsResponse.documents.map(app => app.$id);
      const escrowResponse = await databases.listDocuments(
        db,
        escrowCollection,
        [Query.equal('applicationId', applicationIds)]
      );

      const escrowMap = {};
      escrowResponse.documents.forEach(escrow => {
        escrowMap[escrow.applicationId] = escrow;
      });

      // Step 4: Fetch traveler details and combine data
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
            const escrowData = escrowMap[application.$id];

            return {
              // Application info
              id: application.$id,
              applicationId: application.$id,
              travelerId: application.travelerId,
              message: application.message || "I'm interested in delivering this package.",
              status: application.status || 'pending',
              appliedAt: getTimeAgo(application.$createdAt),
              createdAt: application.$createdAt,

              // Traveler info
              traveler: travelerData?.userName || travelerData?.name || 'Unknown Traveler',
              rating: travelerData?.rating || 4.5,
              completedTrips: travelerData?.completedTrips || 0,
              verified: travelerData?.verified || false,
              phoneNumber: travelerData?.phoneNumber || null,
              profileImage: travelerData?.profileImage || null,

              // Package info
              packageId: application.packageId,
              packageTitle: packageData?.title || packageData?.itemName || 'Package Delivery',
              packageDescription: packageData?.description || '',
              pickupLocation: packageData?.pickupLocation || packageData?.from || 'Pickup Location',
              deliveryLocation: packageData?.deliveryLocation || packageData?.to || 'Delivery Location',
              reward: packageData?.reward || packageData?.price || 0,
              weight: packageData?.weight || '3.5',
              size: packageData?.size || 'Medium',
              deadline: packageData?.deadline ? new Date(packageData.deadline).toLocaleDateString() : 'TBD',
              packageStatus: packageData?.status || 'active',

              // Escrow info
              escrow: escrowData ? {
                id: escrowData.$id,
                status: escrowData.status,
                amount: escrowData.amount,
                paystackReference: escrowData.paystackReference,
                paidAt: escrowData.paidAt,
                releasedAt: escrowData.releasedAt
              } : null
            };
          } catch (err) {
            console.error('Error fetching details for application:', application.$id, err);
            // Return minimal data if fetching details fails
            const packageData = packagesResponse.documents.find(
              (pkg) => (pkg.packageId || pkg.$id) === application.packageId
            );

            return {
              id: application.$id,
              applicationId: application.$id,
              travelerId: application.travelerId,
              message: application.message || "I'm interested in delivering this package.",
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
              packageTitle: packageData?.title || packageData?.itemName || 'Package Delivery',
              packageDescription: packageData?.description || '',
              pickupLocation: packageData?.pickupLocation || packageData?.from || 'Pickup Location',
              deliveryLocation: packageData?.deliveryLocation || packageData?.to || 'Delivery Location',
              reward: packageData?.reward || packageData?.price || 0,
              weight: packageData?.weight || '3.5',
              size: packageData?.size || 'Medium',
              deadline: packageData?.deadline ? new Date(packageData.deadline).toLocaleDateString() : 'TBD',
              packageStatus: packageData?.status || 'active',
              escrow: null
            };
          }
        })
      );

      setRequests(requestsWithDetails);
    } catch (err) {
      console.error('Error fetching sender requests:', err);
      setError(err.message || 'Failed to fetch delivery requests');
    } finally {
      setLoading(false);
    }
  };

  // Add escrow payment method
  const acceptAndPay = async (request) => {
    try {
      // First update the application status to accepted
      const updateResult = await updateRequestStatus(request.applicationId, 'accepted');
      
      if (!updateResult.success) {
        throw new Error('Failed to accept application');
      }

      // Initialize escrow payment
      const escrowData = {
        applicationId: request.applicationId,
        amount: request.reward,
        senderId: user.$id,
        travelerId: request.travelerId,
        packageId: request.packageId
      };

      const escrowResult = await escrow.initializeEscrow(escrowData);
      
      if (!escrowResult.success) {
        // Revert application status if payment fails
        await updateRequestStatus(request.applicationId, 'pending');
        throw new Error(escrowResult.error);
      }

      return escrowResult;
    } catch (err) {
      console.error('Error in accept and pay:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const releasePayment = async (request) => {
    if (!request.escrow) {
      throw new Error('No escrow record found');
    }

    const result = await escrow.releaseEscrow(request.escrow.id, request.travelerId);
    
    if (result.success) {
      // Update local state
      setRequests(prev => prev.map(req => 
        req.applicationId === request.applicationId
          ? {
              ...req,
              escrow: { ...req.escrow, status: 'released' },
              status: 'completed'
            }
          : req
      ));
    }

    return result;
  };

  // Keep your existing helper functions...
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
            weight: request.weight,
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
        { status: newStatus }
      );

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
    // ... keep your existing implementation
  };

  useEffect(() => {
    fetchAllRequests();
  }, [user]);

  const groupedRequests = groupRequestsByPackage(requests);

  return {
    requests,
    groupedRequests,
    loading: loading || escrow.loading,
    error: error || escrow.error,
    refetch: fetchAllRequests,
    updateStatus: updateRequestStatus,
    acceptAndPay,
    releasePayment,
    confirmPayment: escrow.confirmPayment,

    pendingCount: requests.filter((r) => r.status === 'pending').length,
    acceptedCount: requests.filter((r) => r.status === 'accepted').length,
    paidCount: requests.filter((r) => r.escrow?.status === 'held').length,
    completedCount: requests.filter((r) => r.escrow?.status === 'released').length,
    packagesWithRequests: Object.keys(groupedRequests).length,
  };
}