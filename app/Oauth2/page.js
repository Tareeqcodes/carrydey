'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/Authcontext';
import { account } from '@/lib/config/Appwriteconfig';

export default function OAuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { checkSession } = useAuth();
    const [status, setStatus] = useState('Processing OAuth callback...');
    const [processed, setProcessed] = useState(false);

    useEffect(() => {
        if (processed) return;

        const handleOAuthCallback = async () => {
            try {
                setProcessed(true);
                
                // Check if we have any error from OAuth provider
                const error = searchParams.get('error');
                const state = searchParams.get('state');
                
                if (error) {
                    setStatus(`OAuth error: ${error}`);
                    setTimeout(() => router.push('/login'), 2000);
                    return;
                }

                setStatus('Verifying OAuth session...');
                
                // Check if we already have a session
                try {
                    const user = await account.get();
                    
                    if (user) {
                        setStatus('User already logged in, refreshing session...');
                    } else {
                        // Try to get current session
                        const sessions = await account.listSessions();
                        if (sessions.sessions.length === 0) {
                            throw new Error('No active session found');
                        }
                        setStatus('Session found, getting user details...');
                    }
                } catch (sessionError) {
                    // This is normal - we'll get user data after OAuth callback
                    console.log('Getting fresh user data from OAuth callback...');
                }

                // Force refresh the session/user data
                await checkSession();
                
                // Check if user needs onboarding
                try {
                    const user = await account.get();
                    
                    // Check if user has completed onboarding (you can check a custom user pref)
                    // Example: Check if user has a name set
                    if (!user.name || user.name === '') {
                        setStatus('Redirecting to onboarding...');
                        setTimeout(() => router.push('/onboarding'), 1000);
                    } else {
                        setStatus('Redirecting to dashboard...');
                        setTimeout(() => router.push('/dashboard'), 1000);
                    }
                } catch (userError) {
                    console.error('Failed to get user after OAuth:', userError);
                    setStatus('Failed to get user information');
                    setTimeout(() => router.push('/login'), 2000);
                }
                
            } catch (error) {
                console.error('OAuth callback failed:', error);
                setStatus('OAuth authentication failed. Please try again.');
                setProcessed(false);
                setTimeout(() => router.push('/login'), 2000);
            }
        };

        handleOAuthCallback();
    }, [router, searchParams, checkSession, processed]);

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A0A21] mx-auto mb-4"></div>
                <p className="text-sm text-[#3A0A21]">{status}</p>
            </div>
        </div>
    );
}