'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { databases } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';
import { useUserRole } from '@/hooks/useUserRole';
import DeliveryRequest from '@/components/DeliveryRequest';

export default function DeliveryRequestPage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params?.packageId;
  
  const [packageDetails, setPackageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  const { loading: userLoading, role } = useUserRole();

  useEffect(() => {
    const fetchPackageDetails = async () => {
      if (!packageId || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const response = await databases.getDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_PACKAGES_COLLECTION_ID,
          packageId
        );

        // // Verify that the current user is the owner of this package
        // if (response.senderId !== user.$id) {
        //   setError('You are not authorized to view requests for this package.');
        //   return;
        // }

        setPackageDetails(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching package details:', err);
        setError(err.message || 'Failed to fetch package details');
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [packageId, user]);

  // Show loading state while checking user role
  if (userLoading || loading) {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen">
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen">
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to view delivery requests.</p>
            <button 
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has sender role
  if (role !== 'sender') {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen">
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              Only senders can view delivery requests. Your role is: {role || 'Not set'}
            </p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if packageId is provided
  if (!packageId) {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen">
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Package Not Found</h2>
            <p className="text-gray-600 mb-4">No package ID provided in the URL.</p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle errors
  if (error) {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen">
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <button 
                onClick={() => window.location.reload()}
                className="block w-full px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
              <button 
                onClick={() => router.push('/dashboard')}
                className="block w-full px-6 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the main component
  return (
    <DeliveryRequest 
      packageId={packageId} 
      packageDetails={packageDetails} 
    />
  );
}