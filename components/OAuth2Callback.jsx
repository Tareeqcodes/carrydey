'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/Authcontext';

export default function OAuthCallback() {
    const router = useRouter();
    const { checkSession, user } = useAuth();
    const [status, setStatus] = useState('Processing OAuth callback...');
    const [processed, setProcessed] = useState(false);

    useEffect(() => {
        if (processed) return;

        const handleOAuthCallback = async () => {
            try {
                setProcessed(true);
                
                // Wait for Appwrite to process the OAuth callback
                setStatus('Finalizing authentication...');
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Check if session was created
                const hasSession = await checkSession();
                
                if (hasSession) {
                    // Check if user needs onboarding
                    // This assumes you have access to user data in context
                    if (!user?.name || user.name.trim() === '') {
                        setStatus('Redirecting to onboarding...');
                        setTimeout(() => router.push('/onboarding'), 1000);
                    } else {
                        setStatus('Redirecting to dashboard...');
                        setTimeout(() => router.push('/dashboard'), 1000);
                    }
                } else {
                    setStatus('Authentication failed. Please try again.');
                    setTimeout(() => router.push('/login'), 2000);
                }
                
            } catch (error) {
                console.error('OAuth callback failed:', error);
                setStatus('OAuth authentication failed. Please try again.');
                setTimeout(() => router.push('/login'), 2000);
            }
        };

        handleOAuthCallback();
    }, [router, checkSession, processed, user]);

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A0A21] mx-auto mb-4"></div>
                <p className="text-sm text-[#3A0A21]">{status}</p>
            </div>
        </div>
    );
}