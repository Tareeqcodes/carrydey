'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/Authcontext';
import { account, tablesDB, Query } from '@/lib/config/Appwriteconfig';

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
          const currentSession = await account.getSession({ sessionId: 'current' });
          if (currentSession) {
            sessionExists = true;
            setStatus('Session already active, redirecting...');
          }
        } catch (e) {
          setStatus('Creating your session...');
        }

        if (!sessionExists) {
          await account.createSession({ userId, secret });
          setStatus('Session created successfully!');
        }
        await checkSession();
        setStatus('Checking your profile...');
        let alreadyOnboarded = false;

        try {
          const userData = await account.get();
          const response = await tablesDB.listRows({
            databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            tableId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
            queries: [Query.equal('userId', userData.$id)],
          });

          if (response.rows.length > 0 && response.rows[0].onboardingCompleted) {
            alreadyOnboarded = true;
          }
        } catch (profileErr) {
          console.warn('Could not check profile, falling through to onboarding:', profileErr);
        }
        setStatus('Redirecting...');

        if (alreadyOnboarded) {
          const pendingRedirect = localStorage.getItem('postAuthRedirect');
          setTimeout(() => router.push(pendingRedirect || '/send'), 500);
        } else {
          setTimeout(() => router.push('/onboarding'), 500);
        }

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A0A21] mx-auto mb-4" />
        <p className="text-sm text-[#3A0A21]">{status}</p>
      </div>
    </div>
  );
}