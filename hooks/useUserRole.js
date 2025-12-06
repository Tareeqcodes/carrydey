'use client'
import { useEffect, useState } from 'react';
import { Query, tablesDB } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';

export const useUserRole = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserRole = async () => {
  if (!user) {
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    setError(null);
    const response = await tablesDB.listRows({
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      tableId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
      queries: [Query.equal('userId', user.$id)]
    });

    if (response && response.rows && response.rows.length > 0) {
      setUserData(response.rows[0]); 
    } else {
      console.log('No user data found in collection');
      setUserData(null);
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
    setError(error.message || 'Failed to fetch user role');
  } finally {
    setLoading(false);
  }
};

    fetchUserRole();
  }, [user]);

  const status = userData?.status || 'pending';
  const role = userData?.role || 'user';
  const isVerified = status === 'verified';

  return {
    loading,
    error,
    role,
    name: userData?.userName || user?.name || null,
    status,
    userData,
    isVerified,
  };
}