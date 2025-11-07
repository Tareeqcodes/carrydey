'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { account, databases, ID, Query } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';

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
      const role = urlParams.get('role');
      const name = urlParams.get('name');
      
      console.log('Params:', { userId, secret, role, name });
      
      if (!userId || !secret) {
        console.warn('Missing credentials from URL');
        router.push('/login');
        return;
      }

      try {
        Processed.current = true;
        let sessionExists = false;
        let userName = name;

        try {
          const currentSession = await account.getSession('current');
          if (currentSession) {
            sessionExists = true;
            console.log('Session already exists');
          }
        } catch (e) {
          console.log('No active session found');
        }

        if (!sessionExists) {
          const session = await account.createSession({userId, secret});
          console.log('Session created:', session);
        }

        await checkSession();
           
        if (!userName) {
          try {
            const user = await account.get();
            // fallback to email username
            userName = user.name || user.email.split('@')[0];
            console.log('Using name from account:', userName);
          } catch (error) {
            console.log('Could not get user name from account:', error.message);
            // default name
            userName = `User_${userId.slice(0, 6)}`;
          }
        }
       
        // Store user role with duplicate check
        if (role) {
          await storeUserRole(userId, role, userName);
        }

        // Role-based routing after successful verification
        redirectBasedOnRole(role);
        
      } catch (error) {
        console.error('Verification failed:', error.message);
        Processed.current = false;
        router.push('/login');
      }
    };

    verifySession();
  }, []);

  const redirectBasedOnRole = (userRole) => {
    switch (userRole) {
      case 'sender':
        router.push('/dashboard');
        break;
      case 'traveler':
        router.push('/travelerdashboard'); 
        break;
      default:
        // Fallback to general dashboard
        router.push('/');
    }
  };

  const storeUserRole = async (userId, userRole, userName) => {
    try {
      console.log('Storing user role:', { userId, userRole, userName });
      const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
      const collectionId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;
      
      if (!databaseId || !collectionId) {
        console.error('Database configuration missing. Please set your environment variables.');
        return;
      }

      try {
        const existingUser = await databases.listDocuments(
          databaseId,
          collectionId,
          [Query.equal('userId', userId)]
        );
        
        if (existingUser.documents.length > 0) {
          console.log('User role already exists, skipping creation');
          return;
        }
      } catch (error) {
        console.log('Error checking existing user, proceeding with creation:', error.message);
      }

      const userData = {
        userId: userId,
        userName: userName || 'User',
        role: userRole,
        createdAt: new Date().toISOString(),
        phone: '',
        status: userRole === 'traveler' ? 'pending' : 'verified',
      };

      await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        userData
      );
     
      console.log('User role stored successfully');
    } catch (error) {
      console.error('Error storing user role:', error);
    }
  };

  return (
    <div className='h-screen text-sm text-green-400 p-20 text-center items-center justify-center'>
      Verifying please wait...
    </div>
  );
}