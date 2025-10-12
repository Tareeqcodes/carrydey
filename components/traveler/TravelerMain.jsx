"use client";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Package, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { usePackages } from "@/hooks/usePackages";

export default function TravelerMain() {
  const { data } = usePackages();

  // Sort packages by creation date (most recent first) and take first 4
  const recentPackages = useMemo(() => {
    if (!data || data.length === 0) return [];

    return [...data]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);
  }, [data]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityColor = (status) => {
    switch (status?.toLowerCase()) {
      case "urgent":
        return "text-red-500 bg-red-50 border-red-200";
      case "standard":
        return "text-gray-600 bg-gray-50 border-gray-200";
      case "express":
        return "text-orange-500 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const cardHoverVariants = {
    hover: {
      y: -4,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 mb-8 border border-blue-100'>
        <div className='flex flex-col items-center justify-between gap-4'>
          <div className='flex items-center gap-6'>
            
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {recentPackages.length}
              </div>
              <div className='text-sm text-gray-600'>Latest Available</div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className='flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors'>
            View All Packages
            <ArrowRight className='w-4 h-4' />
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        variants={headerVariants}
        initial='hidden'
        animate='visible'
        className='mb-5'>
        <h1 className='text-xl md:text-2xl font-bold text-gray-900 mb-2'>
          Packages Near You
        </h1>
      </motion.div>

      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='space-y-6'>
          {recentPackages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className='text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100'>
              <Package className='mx-auto h-16 w-16 text-gray-400 mb-6' />
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                No packages available
              </h3>
              <p className='text-gray-500 text-lg'>
                Check back soon for new delivery opportunities in your area
              </p>
            </motion.div>
          ) : (
            recentPackages.map((item, index) => (
              <motion.div
                key={item.$id}
                variants={itemVariants}
                whileHover='hover'
                className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer relative'
                style={{
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                }}>
                {/* New Badge for very recent packages */}
                {new Date() - new Date(item.createdAt) <
                  24 * 60 * 60 * 1000 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className='absolute top-4 right-5 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10'>
                    New
                  </motion.div>
                )}

                <motion.div variants={cardHoverVariants} className='p-6'>
                  <div className='flex justify-between items-start mb-4'>
                    <div className='flex-1 pr-4'>
                      <motion.h3
                        className='text-xl font-semibold text-gray-900 mb-2'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}>
                        {item.title}
                      </motion.h3>

                      <motion.div
                        className='flex items-center text-gray-600 mb-1'
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}>
                        <Package className='w-4 h-4 mr-2 text-gray-500' />
                        <span className='text-sm font-medium'>
                          {item.size}
                        </span>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      className='text-right'>
                      <div className='bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-2 rounded-xl font-bold text-sm shadow-lg'>
                        {formatCurrency(item.reward)}
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    className='space-y-3 mb-4'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}>
                    <div className='flex items-center text-gray-700'>
                      <div className='w-3 h-3 bg-blue-500 rounded-full mr-3 flex-shrink-0 shadow-sm'></div>
                      <MapPin className='w-4 h-4 mr-2 text-blue-500 flex-shrink-0' />
                      <span className='text-sm font-medium'>
                        From: {item.pickupLocation}
                      </span>
                    </div>

                    <div className='flex items-center text-gray-700'>
                      <div className='w-3 h-3 bg-green-500 rounded-full mr-3 flex-shrink-0 shadow-sm'></div>
                      <MapPin className='w-4 h-4 mr-2 text-green-500 flex-shrink-0' />
                      <span className='text-sm font-medium'>
                        To: {item.deliveryLocation}
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    className='flex items-center justify-between pt-4 border-t border-gray-100'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.6 }}>
                    <div className='flex items-center text-gray-500 text-sm'>
                      <Clock className='w-4 h-4 mr-1' />
                      <span>
                        Posted {formatDistanceToNow(new Date(item.createdAt))}{" "}
                        ago
                      </span>
                    </div>

                    <motion.span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
                        item.status
                      )}`}
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}>
                      {item.status || "Standard"}
                    </motion.span>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
      <div className='h-20'></div>
    </div>
  );
}
