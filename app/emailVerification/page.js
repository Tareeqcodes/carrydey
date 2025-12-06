'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/Authcontext';
import { account } from '@/lib/config/Appwriteconfig';

export default function Confirm() {
  const router = useRouter();
  const { checkSession } = useAuth();
  const Processed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (Processed.current) return;

    const verifySession = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('userId');
      const secret = urlParams.get('secret');

      console.log('Params:', { userId, secret });

      if (!userId || !secret) {
        // console.warn('Missing credentials from URL'); 
        router.push('/login');
        return;
      }

      try {
        Processed.current = true;
        let sessionExists = false;

        try {
          const currentSession = await account.getSession('current');
          if (currentSession) {
            sessionExists = true;
            // console.log('Session already exists');
          }
        } catch (e) {
          console.log('No active session found');  
        }

        if (!sessionExists) {
          const session = await account.updateMagicURLSession({ userId, secret });
          // console.log('Session created:', session);
        }

        await checkSession();
        router.push('/onboarding');
      } catch (error) {
        console.error('Verification failed:', error.message);
        Processed.current = false;
        router.push('/login');
      }
    };

    verifySession();
  }, []);

  return (
    <div className="h-screen text-sm text-green-400 p-20 text-center items-center justify-center">
      Verifying please wait...
    </div>
  );
}
