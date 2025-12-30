'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/Authcontext';

export default function OAuthCallback() {
  const { checkSession } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState('Completing sign in...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('Verifying your session...');
        
        // Wait a brief moment for Appwrite to finalize the session
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update the auth context with the new session
        await checkSession();
        
        setStatus('Success! Redirecting...');
        
        // Small delay before redirect for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        router.push('/onboarding');
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('Sign in failed. Redirecting to login...');
        
        setTimeout(() => {
          router.push('/login?error=oauth_failed');
        }, 2000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A0A21] mx-auto mb-4"></div>
        <p className="text-sm text-[#3A0A21] font-medium">{status}</p>
      </div>
    </div>
  );
}