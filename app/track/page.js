'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TrackAgencyDelivery from '@/components/Agencytrack/TrackAgencyDelivery';
import TrackCourierDelivery from '@/components/CourierTracking/TrackCourierDelivery';
import TrackSenderDelivery from '@/components/SenderTracking/TrackSenderDelivery';
import TrackPageLoading from '@/components/CourierTracking/TrackPageLoading';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/hooks/Authcontext';

export default function TrackPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { loading, error, role, userData } = useUserRole();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Show loading state
  if (authLoading || loading) {
    return <TrackPageLoading />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#3A0A21] text-white rounded-xl hover:bg-[#4A0A31] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show error if no user data found
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find your profile. Please complete your onboarding first.
          </p>
          <button
            onClick={() => router.push('/onboarding')}
            className="px-6 py-3 bg-[#3A0A21] text-white rounded-xl hover:bg-[#4A0A31] transition-colors"
          >
            Complete Onboarding
          </button>
        </div>
      </div>
    );
  }

  // Render component based on user role
  switch (role) {
    case 'agency':
      return <TrackAgencyDelivery />;
    
    case 'courier':
      // This renders the courier's view of their assigned deliveries
      return <TrackCourierDelivery />;
    
    case 'sender':
      // This renders the sender's view of their delivery tracking
      return <TrackSenderDelivery />;
    
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unknown Role</h2>
            <p className="text-gray-600 mb-6">
              Your account role ({role}) is not recognized. Please contact support.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-[#3A0A21] text-white rounded-xl hover:bg-[#4A0A31] transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
  }
}