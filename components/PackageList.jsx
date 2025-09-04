"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Package, Filter, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function PackagesList({ data, loading }) {
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState({
    status: "all",
    timePosted: "all",
    rewardRange: "all",
    size: "all"
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Handle package click navigation
  const handlePackageClick = (packageId) => {
    router.push(`/singlepackage/${packageId}`);
  };

  // Filter options
  const filterOptions = {
    status: [
      { value: "all", label: "All Status", count: data.length },
      { value: "express", label: "Express", count: data.filter(item => item.status?.toLowerCase() === "express").length },
      { value: "standard", label: "Standard", count: data.filter(item => item.status?.toLowerCase() === "standard" || !item.status).length }
    ],
    timePosted: [
      { value: "all", label: "All Time" },
      { value: "today", label: "Today" },
      { value: "week", label: "This Week" },
    ],
    rewardRange: [
      { value: "all", label: "All Rewards" },
      { value: "low", label: "₦0 - ₦5,000" },
      { value: "medium", label: "₦5,001 - ₦15,000" },
      { value: "high", label: "₦15,000+" }
    ],
    size: [
      { value: "all", label: "All Sizes" },
      { value: "small", label: "Small" },
      { value: "medium", label: "Medium" },
      { value: "large", label: "Large" }
    ]
  };

  // Filter the data based on active filters
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Status filter
      if (activeFilters.status !== "all") {
        const itemStatus = item.status?.toLowerCase() || "standard";
        if (itemStatus !== activeFilters.status) return false;
      }

      // Time posted filter
      if (activeFilters.timePosted !== "all") {
        const createdDate = new Date(item.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - createdDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (activeFilters.timePosted) {
          case "today":
            if (diffDays > 1) return false;
            break;
          case "week":
            if (diffDays > 7) return false;
            break;
        }
      }

      // Reward range filter
      if (activeFilters.rewardRange !== "all") {
        const reward = item.reward;
        switch (activeFilters.rewardRange) {
          case "low":
            if (reward > 5000) return false;
            break;
          case "medium":
            if (reward <= 5000 || reward > 15000) return false;
            break;
          case "high":
            if (reward <= 15000) return false;
            break;
        }
      }

      // Size filter
      if (activeFilters.size !== "all") {
        const itemSize = item.size?.toLowerCase();
        if (itemSize !== activeFilters.size) return false;
      }

      return true;
    });
  }, [data, activeFilters]);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({
      status: "all",
      timePosted: "all",
      rewardRange: "all",
      size: "all"
    });
  };

  const hasActiveFilters = Object.values(activeFilters).some(filter => filter !== "all");

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
    );
  }

  return (
    <div>
      {/* Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='mb-6'>
        
        {/* Main Filter Pills */}
        <div className='flex flex-wrap gap-3 mb-4'>
          {filterOptions.status.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => handleFilterChange('status', option.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilters.status === option.value
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}>
              {option.label}
              {option.count !== undefined && (
                <span className={`ml-2 text-xs ${
                  activeFilters.status === option.value ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  ({option.count})
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Advanced Filters Toggle */}
        <div className='flex items-center justify-between'>
          <motion.button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors'>
            <Filter className='w-4 h-4' />
            <span className='text-sm font-medium'>
              {showAdvancedFilters ? 'Hide' : 'Show'} Filters
            </span>
          </motion.button>

          {hasActiveFilters && (
            <motion.button
              onClick={clearAllFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors'>
              <X className='w-4 h-4' />
              Clear All
            </motion.button>
          )}
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className='mt-4 overflow-hidden'>
              <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  
                  {/* Time Posted Filter */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-3'>
                      Time Posted
                    </label>
                    <div className='space-y-2'>
                      {filterOptions.timePosted.map((option) => (
                        <motion.button
                          key={option.value}
                          onClick={() => handleFilterChange('timePosted', option.value)}
                          whileHover={{ x: 4 }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                            activeFilters.timePosted === option.value
                              ? 'bg-blue-100 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}>
                          {option.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Reward Range Filter */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-3'>
                      Reward Range
                    </label>
                    <div className='space-y-2'>
                      {filterOptions.rewardRange.map((option) => (
                        <motion.button
                          key={option.value}
                          onClick={() => handleFilterChange('rewardRange', option.value)}
                          whileHover={{ x: 4 }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                            activeFilters.rewardRange === option.value
                              ? 'bg-green-100 text-green-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}>
                          {option.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Size Filter */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-3'>
                      Package Size
                    </label>
                    <div className='space-y-2'>
                      {filterOptions.size.map((option) => (
                        <motion.button
                          key={option.value}
                          onClick={() => handleFilterChange('size', option.value)}
                          whileHover={{ x: 4 }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                            activeFilters.size === option.value
                              ? 'bg-purple-100 text-purple-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}>
                          {option.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Packages List */}
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='space-y-4'>
          {filteredData.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className='text-center py-12 bg-white rounded-2xl shadow-sm'>
              <Package className='mx-auto h-12 w-12 text-gray-400 mb-4' />
              <p className='text-gray-500 text-lg mb-2'>
                {hasActiveFilters ? 'No packages match your filters' : 'No packages available at the moment'}
              </p>
              {hasActiveFilters && (
                <motion.button
                  onClick={clearAllFilters}
                  whileHover={{ scale: 1.05 }}
                  className='text-blue-600 hover:text-blue-700 font-medium'>
                  Clear filters to see all packages
                </motion.button>
              )}
            </motion.div>
          ) : (
            filteredData.map((item, index) => (
              <motion.div
                key={item.$id}
                variants={itemVariants}
                whileHover='hover'
                onClick={() => handlePackageClick(item.$id)}
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
                          {item.size}
                        </span>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      className='text-right'>
                      <div className='bg-green-500 text-white p-1 rounded font-semibold text-sm mb-2'>
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
  );
}