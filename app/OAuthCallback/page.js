'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/Authcontext';
import { account, tablesDB, Query } from '@/lib/config/Appwriteconfig';

export default function OAuthCallback() {
  const { checkSession } = useAuth();
  const router = useRouter();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const handleCallback = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        let sessionVerified = false;
        let retries = 0;
        while (!sessionVerified && retries < 5) {
          try {
            const session = await account.getSession({ sessionId: 'current' });
            if (session) sessionVerified = true;
          } catch {
            retries++;
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }

        if (!sessionVerified) {
          throw new Error('Session could not be verified after multiple attempts');
        }

        await checkSession();

        let alreadyOnboarded = false;
        let userRole = null;

        try {
          const userData = await account.get();
          const response = await tablesDB.listRows({
            databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            tableId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
            queries: [Query.equal('userId', userData.$id)],
          });
          if (response.rows.length > 0 && response.rows[0].onboardingCompleted) {
            alreadyOnboarded = true;
            userRole = response.rows[0].role;
          }
        } catch (profileErr) {
          console.warn('Could not check profile, falling through to onboarding:', profileErr);
        }

        await new Promise((resolve) => setTimeout(resolve, 500));

        if (alreadyOnboarded) {
          const pendingRedirect = localStorage.getItem('postAuthRedirect');
          if (pendingRedirect) {
            router.push(pendingRedirect);
          } else if (userRole === 'sender') {
            router.push('/send');
          } else {
            router.push('/track');
          }
        } else {
          router.push('/onboarding');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setTimeout(() => router.push('/login?error=oauth_failed'), 2000);
      }
    };

    handleCallback();
  }, [checkSession, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C896] mx-auto mb-4" />
        <p className="text-sm text-black dark:text-white font-medium">Completing sign in...</p>
      </div>
    </div>
  );
}