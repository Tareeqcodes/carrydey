import { useState, useEffect } from "react";
import { databases } from "@/lib/config/Appwriteconfig";

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const collection = process.env.NEXT_PUBLIC_APPWRITE_PACKAGE_COLLECTION_ID;

export const usePackages = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(db, collection);
      setData(response.documents);
      setError(null);
    } catch (error) {
      console.error("Error fetching packages:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};