'use client';
import { useState } from 'react';
import { Truck, CheckCircle, X, Plus, Package, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BusinessDetailsStep = ({
  formData,
  errors,
  onInputChange,
  onServiceToggle,
}) => {
  const [newVehicleType, setNewVehicleType] = useState('');

  const serviceOptions = [
    'Express Delivery',
    'Same-day Delivery',
  ];

  const commonVehicleTypes = [
    'Car/Van',
    'Motorcycle',
    'Pickup Truck',
  ];

  const handleAddVehicleType = (vehicleType) => {
    if (!formData.vehicleTypes?.includes(vehicleType)) {
      const updatedVehicleTypes = [
        ...(formData.vehicleTypes || []),
        vehicleType,
      ];
      onInputChange('vehicleTypes', updatedVehicleTypes);
    }
  };

  const handleRemoveVehicleType = (vehicleType) => {
    const updatedVehicleTypes =
      formData.vehicleTypes?.filter((vt) => vt !== vehicleType) || [];
    onInputChange('vehicleTypes', updatedVehicleTypes);
  };

  const handleCustomVehicleType = () => {
    if (
      newVehicleType.trim() &&
      !formData.vehicleTypes?.includes(newVehicleType.trim())
    ) {
      const updatedVehicleTypes = [
        ...(formData.vehicleTypes || []),
        newVehicleType.trim(),
      ];
      onInputChange('vehicleTypes', updatedVehicleTypes);
      setNewVehicleType('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-4 shadow-xl shadow-orange-500/30"
        >
          <Package className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-sm font-semibold text-gray-800 mb-2 tracking-tight">
          Tell us about your fleet and services
        </h2>
        
      </div>

      <div className="space-y-8">
        {/* Vehicle Types Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Fleet Vehicles
            </label>
            <p className="text-xs text-gray-500">
              Select all vehicle types in your fleet
            </p>
          </div>

          {/* Vehicle Type Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {commonVehicleTypes.map((vehicleType, index) => {
              const isSelected = formData.vehicleTypes?.includes(vehicleType);
              return (
                <motion.button
                  key={vehicleType}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      handleRemoveVehicleType(vehicleType);
                    } else {
                      handleAddVehicleType(vehicleType);
                    }
                  }}
                  className={`relative p-4 border-2 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg shadow-emerald-500/20'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30'
                        : 'bg-gray-100'
                    }`}
                  >
                    <Truck className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <span className={`text-sm font-semibold ${isSelected ? 'text-emerald-700' : 'text-gray-700'}`}>
                    {vehicleType}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Custom Vehicle Type Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Add Custom Vehicle Type
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
                <input
                  type="text"
                  value={newVehicleType}
                  onChange={(e) => setNewVehicleType(e.target.value)}
                  placeholder="e.g., Electric Scooter, Bicycle, etc."
                  className="relative w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-blue-50/30 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCustomVehicleType();
                    }
                  }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleCustomVehicleType}
                disabled={!newVehicleType.trim()}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Selected Vehicle Types Display */}
          <AnimatePresence>
            {formData.vehicleTypes?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-5 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-gray-900">
                    Selected Vehicles
                  </label>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                    {formData.vehicleTypes.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.vehicleTypes.map((vehicleType, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.03 }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-emerald-200 rounded-xl text-sm font-medium text-gray-700 shadow-sm"
                    >
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      {vehicleType}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => handleRemoveVehicleType(vehicleType)}
                        className="ml-1 hover:bg-red-100 rounded-full p-1 transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-red-600" />
                      </motion.button>
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {errors.vehicleTypes && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs text-red-600 font-medium"
            >
              {errors.vehicleTypes}
            </motion.p>
          )}
        </motion.div>

        {/* Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="pt-6 border-t border-gray-200"
        >
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Services Offered
            </label>
            <p className="text-xs text-gray-500">
              Select the delivery services you provide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceOptions.map((service, index) => {
              const isSelected = formData.services.includes(service);
              return (
                <motion.button
                  key={service}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => onServiceToggle(service)}
                  className={`relative p-4 border-2 rounded-2xl flex items-center gap-4 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-500/20'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                      isSelected
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30'
                        : 'bg-gray-100'
                    }`}
                  >
                    <Zap className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <span className={`text-sm font-semibold text-left ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                    {service}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {errors.services && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-xs text-red-600 font-medium"
            >
              {errors.services}
            </motion.p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BusinessDetailsStep;