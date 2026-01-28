import { useState, useEffect } from 'react';
import { tablesDB, Query } from '@/lib/config/Appwriteconfig';

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const agenciesCollectionId = process.env.NEXT_PUBLIC_APPWRITE_AGENCIES_COLLECTION_ID;
const usersCollectionId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;

const useAvailableTravelers = () => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAgenciesAndCouriers();
  }, []);

  const fetchAgenciesAndCouriers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all agencies
      const agenciesResponse = await tablesDB.listRows({
        databaseId: db,
        tableId: agenciesCollectionId,
        queries: [],
      });

      // Fetch only available couriers (users with isAvailable = true)
      const couriersResponse = await tablesDB.listRows({
        databaseId: db,
        tableId: usersCollectionId,
        queries: [
          Query.equal('isAvailable', true), // Only fetch available couriers
        ],
      });

      // Transform agencies data
      const agenciesData =
        agenciesResponse?.rows?.map((agency) => ({
          ...agency,
          entityType: 'agency',
        })) || [];

      // Transform couriers data
      const couriersData =
        couriersResponse?.rows?.map((courier) => ({
          ...courier,
          entityType: 'courier',
        })) || [];

      // Combine both agencies and available couriers
      const combinedData = [...agenciesData, ...couriersData];

      setAgencies(combinedData);
    } catch (err) {
      console.error('Error fetching agencies and couriers:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Function to manually refresh the list (useful after availability changes)
  const refresh = () => {
    fetchAgenciesAndCouriers();
  };

  return { agencies, loading, error, refresh };
};

export default useAvailableTravelers;