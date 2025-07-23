"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { databases } from "@/config/Appwriteconfig";

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const collection = process.env.NEXT_PUBLIC_APPWRITE_PACKAGE_COLLECTION_ID;

export default function PackagesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await databases.listDocuments(db, collection);
        setData(response.documents);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);



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

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='flex items-center justify-center py-12'>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className='w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full'
            />
            <span className='ml-3 text-gray-600 font-medium'>
              Loading packages...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6'>
      <div className='max-w-4xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Packages Near You
          </h1>
          <p className='text-gray-600 text-lg'>
            Discover delivery opportunities in your area
          </p>
        </motion.div>

        <AnimatePresence>
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='space-y-4'>
            {data.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className='text-center py-12 bg-white rounded-2xl shadow-sm'>
                <Package className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                <p className='text-gray-500 text-lg'>
                  No packages available at the moment
                </p>
              </motion.div>
            ) : (
              data.map((item, index) => (
                <motion.div
                  key={item.$id}
                  variants={itemVariants}
                  whileHover='hover'
                  className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer'
                  style={{
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                  }}>
                  <motion.div variants={cardHoverVariants} className='p-6'>
                    <div className='flex justify-between items-start mb-4'>
                      <div className='flex-1'>
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
                          <span className='text-sm font-medium'>
                            {item.size} • {item.weight}kg
                          </span>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                        className='text-right'>
                        <div className='bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg mb-2'>
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
                        <div className='w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0'></div>
                        <MapPin className='w-4 h-4 mr-2 text-blue-500 flex-shrink-0' />
                        <span className='text-sm font-medium'>
                          {item.pickupLocation}
                        </span>
                      </div>

                      <div className='flex items-center text-gray-700'>
                        <div className='w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0'></div>
                        <MapPin className='w-4 h-4 mr-2 text-green-500 flex-shrink-0' />
                        <span className='text-sm font-medium'>
                          {item.deliveryLocation}
                        </span>
                      </div>
                    </motion.div>

                    <motion.div
                      className='flex items-center justify-between'
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.6 }}>
                      <div className='flex items-center text-gray-500 text-sm'>
                        <Clock className='w-4 h-4 mr-1' />
                        <span>Posted {formatDistanceToNow(item.createdAt)}</span>
                      </div>

                      <motion.span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
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
      </div>
    </div>
  );
}
