'use client'
import { useEffect, useState } from 'react';
import { databases, Query } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';

export const useUserRole = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const { user } = useAuth(); 

  useEffect(() => {
    const fetchUserRole = async () => {
       if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
          [Query.equal('userId', user.$id)]
        );

        if (response.documents.length > 0) {
          setUserData(response.documents[0]);
        } else {
          console.log('No role found for user');
          setUserData(null);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  if (loading) {
    return {
      loading: true,
      role: null,
      name: null
    };
  }

  return {
    loading: false,
    role: userData?.role || null,
    name: userData?.userName || null
  };
}