import { useState, useEffect } from "react";
// import { formatDistanceToNow } from "date-fns";
import { databases, Query } from "@/lib/config/Appwriteconfig";
import { useAuth } from "@/hooks/Authcontext";

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const applicationsCollection = process.env.NEXT_PUBLIC_APPWRITE_APPLICATIONS;
const usersCollection = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;

export default function useRequest(packageId) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchRequests = async () => {
    if (!user || !packageId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch applications for this package
      const applicationsResponse = await databases.listDocuments(
        db,
        applicationsCollection,
        [
          Query.equal('packageId', packageId),
          Query.orderDesc('$createdAt')
        ]
      );

      // Fetch traveler details for each application
      const requestsWithDetails = await Promise.all(
        applicationsResponse.documents.map(async (application) => {
          try {
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
              traveler: travelerData?.userName || "Unknown Traveler",
              rating: travelerData?.rating || 4.5,
              completedTrips: travelerData?.completedTrips || 0,
              verified: travelerData?.verified || false,
              appliedAt: getTimeAgo(application.$createdAt),
              message: application.message || "I'm interested in delivering this package.",
              status: application.status || "pending",
              createdAt: application.$createdAt
            };
          } catch (err) {
            console.error('Error fetching traveler details:', err);
            return {
              id: application.$id,
              applicationId: application.$id,
              travelerId: application.travelerId,
              traveler: "Unknown Traveler",
              rating: 4.5,
              completedTrips: 0,
              verified: false,
              appliedAt: getTimeAgo(application.$createdAt),
              message: application.message || "I'm interested in delivering this package.",
              status: application.status || "pending",
              createdAt: application.$createdAt
            };
          }
        })
      );

      setRequests(requestsWithDetails);
      setError(null);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err.message || 'Failed to fetch delivery requests');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (applicationId, newStatus) => {
    try {
      await databases.updateDocument(
        db,
        applicationsCollection,
        applicationId,
        { status: newStatus }
      );

      // Update local state
      setRequests(prev => 
        prev.map(req => 
          req.applicationId === applicationId 
            ? { ...req, status: newStatus } 
            : req
        )
      );

      return true;
    } catch (err) {
      console.error('Error updating request status:', err);
      setError(err.message || 'Failed to update request status');
      return false;
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffInMinutes = Math.floor((now - created) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return created.toLocaleDateString();
  };

  useEffect(() => {
    fetchRequests();
  }, [user, packageId]);

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests,
    updateStatus: updateRequestStatus
  };
}