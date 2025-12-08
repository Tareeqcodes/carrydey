'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/Authcontext';
import { account } from '@/lib/config/Appwriteconfig';

export default function Confirm() {
  const router = useRouter();
  const { checkSession } = useAuth();
  const Processed = useRef(false);
  const [status, setStatus] = useState('Verifying your email...');

  useEffect(() => {
    if (Processed.current) return;

    const verifySession = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('userId');
      const secret = urlParams.get('secret');

      if (!userId || !secret) {
        setStatus('Invalid verification link');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      try {
        Processed.current = true;

        let sessionExists = false;
        try {
          const currentSession = await account.getSession({
            sessionId: 'current'
          });
          if (currentSession) {
            sessionExists = true;
            setStatus('Session already active, redirecting...');
          }
        } catch (e) {
          setStatus('Creating your session...');
        }

        if (!sessionExists) {
          await account.createSession({
            userId: userId,
            secret: secret
          });
          setStatus('Session created successfully!');
        } 

        await checkSession();
        
        setStatus('Redirecting to your account...');
        setTimeout(() => router.push('/onboarding'), 1000);
        
      } catch (error) {
        console.error('Verification failed:', error);
        setStatus('Verification failed. Please try again.');
        Processed.current = false;
        setTimeout(() => router.push('/login'), 2000);
      }
    };

    verifySession(); 
  }, [router, checkSession]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A0A21] mx-auto mb-4"></div>
        <p className="text-sm text-[#3A0A21]">{status}</p>
      </div>
    </div>
  );
}