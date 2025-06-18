'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account, databases, ID } from '@/config/Appwriteconfig';
import { useAuth } from '@/context/Authcontext';

export default function Confirm() {
  const router = useRouter();
  const { checkSession } = useAuth();

  useEffect(() => {
    const verifySession = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('userId');
      const secret = urlParams.get('secret');
      const role = urlParams.get('role'); // Get role from URL

      console.log('Params:', { userId, secret, role });

      if (!userId || !secret) {
        console.warn('Missing credentials from URL');
        router.push('/login');
        return;
      }

      try {
        // Check if there's already an active session
        let sessionExists = false;
        try {
          const currentSession = await account.getSession('current');
          if (currentSession) {
            sessionExists = true;
            console.log('Session already exists');
          }
        } catch (e) {
          // No active session, which is fine
          console.log('No active session found');
        }

        // Only create session if one doesn't exist
        if (!sessionExists) {
          const session = await account.createSession(userId, secret);    
          console.log('Session created:', session);
        }
        
        // Update auth context
        await checkSession(); 
        
        // Store role in database if provided
        if (role) {
          await storeUserRole(userId, role);
        }
        
        router.push('/dashboard');
      } catch (error) {
        console.error('Verification failed:', error.message);
        router.push('/login');
      }
    };

    verifySession();
  }, [router, checkSession]);

  const storeUserRole = async (userId, userRole) => {
    try {
      console.log('Storing user role:', { userId, userRole });
      
      // Check if environment variables are set
      const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
      const collectionId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;
      
      if (!databaseId || !collectionId) {
        console.error('Database configuration missing. Please set NEXT_PUBLIC_APPWRITE_DATABASE_ID and NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID in your environment variables.');
        return;
      }
      
      // Try to create the document
      const userData = {
        userId: userId,
        role: userRole,
        createdAt: new Date().toISOString(),
      };
      
      await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(), // Use unique ID instead of userId to avoid conflicts
        userData
      );
      
      console.log('User role stored successfully');
    } catch (error) {
      console.error('Error storing user role:', error);
      
      // If it's a duplicate error, try to update existing document
      if (error.code === 409 || error.message.includes('already exists')) {
        try {
          // First, try to find the existing document
          const existingDocs = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
            [
              Query.equal('userId', userId)
            ]
          );
          
          if (existingDocs.documents.length > 0) {
            // Update the first matching document
            await databases.updateDocument(
              process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
              process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
              existingDocs.documents[0].$id,
              {
                role: userRole,
                updatedAt: new Date().toISOString(),
              }
            );
            console.log('User role updated successfully');
          }
        } catch (updateError) {
          console.error('Error updating user role:', updateError);
        }
      }
    }
  };

  return (
    <div className='h-screen text-sm text-green-400 p-20 text-center items-center justify-center'>
      Verifying please wait...
    </div>
  );
}