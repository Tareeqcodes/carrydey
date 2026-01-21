'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/Authcontext';
import { account } from '@/lib/config/Appwriteconfig';

export default function OAuthCallback() {
  const { checkSession } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState('Completing sign in...');
  const processed = useRef(false);

  useEffect(() => {
    // Prevent double execution
    if (processed.current) return;
    processed.current = true;

    const handleCallback = async () => {
      try {
        setStatus('Verifying your session...');
        
        // Wait for Appwrite to finalize the OAuth session
        // This is critical - OAuth redirects need time to establish the session
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verify the session exists by directly calling Appwrite
        let sessionVerified = false;
        let retries = 0;
        const maxRetries = 5;
        
        while (!sessionVerified && retries < maxRetries) {
          try {
            const session = await account.getSession({
              sessionId:'current'
            });
            if (session) {
              sessionVerified = true;
              console.log('Session verified:', session);
            }
          } catch (error) {
            console.log(`Session check attempt ${retries + 1} failed, retrying...`);
            retries++;
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        if (!sessionVerified) {
          throw new Error('Session could not be verified after multiple attempts');
        }
        
        // Update the auth context with the new session
        await checkSession();
        
        setStatus('Success! Redirecting...');
        
        // Small delay before redirect
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
  }, [checkSession, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A0A21] mx-auto mb-4"></div>
        <p className="text-sm text-[#3A0A21] font-medium">{status}</p>
      </div>
    </div>
  );
}