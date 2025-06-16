'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/config/Appwriteconfig';
import  { useAuth } from '@/context/Authcontext';

export default function Confirm() {
  const router = useRouter();
  const { checkSession } = useAuth();

  useEffect(() => {
    const verifySession = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('userId');
      const secret = urlParams.get('secret');

      console.log('Params:', { userId, secret });

      if (!userId || !secret) {
        console.warn('Missing credentials from URL');
        router.push('/login');
        return;
      }

      try {
       const session = await account.createSession(
        userId, 
        secret
      );    
      console.log('Session created:', session);
       await  checkSession(); 
        router.push('/dashboard');
      } catch (error) {
        console.error('Verification failed:', error.message);
        router.push('/login');
      }
    };

    verifySession();
  }, [router]);

  return <div className='h-screen text-sm text-green-400 p-20 text-center items-center justify-center'>
    Verifying please wait...</div>;
}
