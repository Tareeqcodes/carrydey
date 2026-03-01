'use client';
import { useState, useEffect } from 'react';
import { tablesDB, Query } from '@/lib/config/Appwriteconfig';

export default function useChooseAvailable() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgenciesAndCouriers = async () => {
      try { 
        setLoading(true);
        
        // Fetch agencies
        const agenciesResponse = await tablesDB.listRows({
          databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          tableId: process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID,
          queries: [
            Query.equal('verified', true), 
            Query.orderDesc('$createdAt'),
          ]
        });

        // Fetch courier users
        const couriersResponse = await tablesDB.listRows({
          databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          tableId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
          queries: [
            Query.equal('role', 'courier'),
            Query.equal('verified', true), 
            Query.orderDesc('$createdAt'),
          ]
        });

        // Combine both arrays
        const combined = [
          ...agenciesResponse.rows.map(agency => ({
            ...agency,
            entityType: 'agency'
          })),
          ...couriersResponse.rows.map(courier => ({
            ...courier,
            entityType: 'courier'
          }))
        ];

        setAgencies(combined);
      } catch (error) {
        console.error('Error fetching agencies and couriers:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgenciesAndCouriers();
  }, []);

  return {
    agencies,
    loading,
    error,
  };
}