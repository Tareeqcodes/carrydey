'use client';
import { useState, useEffect } from 'react';
import { tablesDB, Query } from '@/lib/config/Appwriteconfig';

export default function useChooseTraveler() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setLoading(true);
        const response = await tablesDB.listRows({
          databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          tableId: process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID,
          queries: [
            // Query.equal('status', 'available'),
            Query.equal('verified', true), 
            Query.orderDesc('$createdAt'),
          ]
        });
        setAgencies(response.rows);
      } catch (error) {
        console.error('Error fetching agencies:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  return {
    agencies,
    loading,
    error,
  };
}