"use client";
import { motion } from "framer-motion";
import { usePackages } from "@/hooks/usePackages";
import PackageList from "@/components/PackageList";

export default function AllPackages() {
  const { data, loading, error, refetch } = usePackages();

  if (error) { 
    return (
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='flex items-center justify-center py-12'>
            <div className='text-center'>
              <button 
                onClick={refetch}
                className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-5'>
      <div className='max-w-4xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='mb-8'>
          <p className='text-gray-500 text-lg'>
            Discover delivery opportunities in your area
          </p>
        </motion.div>

        <PackageList data={data} loading={loading} />
      <div className="h-20"></div>
      </div>
    </div>
  );
}