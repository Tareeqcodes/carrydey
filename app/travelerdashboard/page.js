"use client";
import { motion } from "framer-motion";
import TravelerMain from "@/components/traveler/TravelerMain";
import Pending from "@/components/verification/Pending";
import { useUserRole } from "@/hooks/useUserRole";
import Main from "@/components/Main";
import Navbar from "@/components/Navbar";

export default function PendingVerification() {
  const { role, name, loading } = useUserRole();

  if (loading) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex items-center justify-center py-12'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className='w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full'
          />
          <span className='ml-3 text-gray-600 font-medium'>
            Loading latest packages...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {role === "traveler" ? (
        <>
          <Main role={role} name={name} />
          <TravelerMain />
        </>
      ) : (
        <Pending />
      )}
    </>
  );
}
