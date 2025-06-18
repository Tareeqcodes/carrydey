'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account, databases } from '@/config/Appwriteconfig';
import { useAuth } from '@/context/Authcontext';

export default function Confirm() {
  const router = useRouter();
  const { checkSession } = useAuth();

  useEffect(() => {
    const verifySession = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('userId');
      const secret = urlParams.get('secret');
      const role = urlParams.get('role');

      console.log('Params:', { userId, secret, role });

      if (!userId || !secret) {
        console.warn('Missing credentials from URL');
        router.push('/login');
        return;
      }

      try {
        // Create session
        const session = await account.createSession(userId, secret);    
        console.log('Session created:', session);
        
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
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID, // Your database ID
        process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID, // Your users collection ID
        userId, // Use userId as document ID
        {
          userId: userId,
          role: userRole,
          createdAt: new Date().toISOString(),
          // Add other default fields as needed
        }
      );
      
      console.log('User role stored successfully');
    } catch (error) {
      // If document already exists, update it instead
      if (error.code === 409) {
        try {
          await databases.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
            userId,
            {
              role: userRole,
              updatedAt: new Date().toISOString(),
            }
          );
          console.log('User role updated successfully');
        } catch (updateError) {
          console.error('Error updating user role:', updateError);
        }
      } else {
        console.error('Error storing user role:', error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2>Verifying your account...</h2>
        <p>Please wait while we set up your account.</p>
      </div>
    </div>
  );
}