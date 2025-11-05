"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import Main from "@/components/Main";
import VerificationPage from "../travelerVerification/page";
import AllPackages from "@/components/AllPackages";

export default function Dashtraveler() {
  const { role, name, isVerified, loading } = useUserRole();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsInitialLoad(false);
    }
  }, [loading]);

  // Show loading only on first render when data hasn't arrived yet
  if (isInitialLoad && loading) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex items-center justify-center py-12'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className='w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full'
          />
          <span className='ml-3 text-gray-600 font-medium'>
            Loading dashboard...
          </span>
        </div>
      </div>
    );
  }

  // Show verification page if not verified
  if (!isVerified) {
    return (
      <div>
        <VerificationPage />
      </div>
    );
  }


  return (
    <>
      <div>
        <Main role={role} name={name} /> 
         <AllPackages />
      </div>
    </>
  );
}