'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/Authcontext';
import { account, tablesDB, Query } from '@/lib/config/Appwriteconfig';

export default function OAuthCallback() {
  const { checkSession } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState('Completing sign in...');
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const handleCallback = async () => {
      try {
        setStatus('Verifying your session...');

        // ── 1. Wait for Appwrite to finalise the OAuth session ─────────────
        await new Promise((resolve) => setTimeout(resolve, 1000));

        let sessionVerified = false;
        let retries = 0;
        const maxRetries = 5;

        while (!sessionVerified && retries < maxRetries) {
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

        // ── 2. Sync auth context ───────────────────────────────────────────
        await checkSession();

        // ── 3. Check if user already completed onboarding ─────────────────
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

        // ── 4. Redirect ────────────────────────────────────────────────────
        setStatus('Success! Redirecting...');
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (alreadyOnboarded) {
          // Respect postAuthRedirect if a pending delivery was saved
          // Don't clear it here — ChooseTraveler will clean up both keys
          const pendingRedirect = localStorage.getItem('postAuthRedirect');
          router.push(pendingRedirect || '/send');
        } else {
          // New user — send to onboarding (onboarding will handle postAuthRedirect)
          router.push('/onboarding');
        }

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('Sign in failed. Redirecting to login...');
        setTimeout(() => router.push('/login?error=oauth_failed'), 2000);
      }
    };

    handleCallback();
  }, [checkSession, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A0A21] mx-auto mb-4" />
        <p className="text-sm text-[#3A0A21] font-medium">{status}</p>
      </div>
    </div>
  );
}