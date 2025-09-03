"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GetSinglePackage from "@/hooks/GetSinglePackage";
import CombinedPackageDetails from "@/components/CombinedPackageDetails";

export default function PackageDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await GetSinglePackage(id);
        setData(result);
      } catch (error) {
        console.error("Error fetching package data:", error);
        setError("Failed to load package details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen">
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading package details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen">
        <div className="flex items-center justify-center pt-20">
          <div className="text-center p-6">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops!</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.back()}
                className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-full font-semibold hover:bg-gray-200 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen">
        <div className="flex items-center justify-center pt-20">
          <div className="text-center p-6">
            <div className="text-gray-400 text-5xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Package Not Found</h2>
            <p className="text-gray-600 mb-4">The package you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.back()}
              className="bg-gray-900 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <CombinedPackageDetails packageData={data} />;
}