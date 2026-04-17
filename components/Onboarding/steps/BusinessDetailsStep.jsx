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
  const serviceOptions = ['Express Delivery', 'Same-day Delivery'];
  const commonVehicleTypes = ['Car/Van', 'Motorcycle', 'Pickup Truck'];

  const handleAddVehicleType = (vehicleType) => {
    if (!formData.vehicleTypes?.includes(vehicleType))
      onInputChange('vehicleTypes', [
        ...(formData.vehicleTypes || []),
        vehicleType,
      ]);
  };
  const handleRemoveVehicleType = (vehicleType) => {
    onInputChange(
      'vehicleTypes',
      formData.vehicleTypes?.filter((vt) => vt !== vehicleType) || []
    );
  };
  const handleCustomVehicleType = () => {
    if (
      newVehicleType.trim() &&
      !formData.vehicleTypes?.includes(newVehicleType.trim())
    ) {
      onInputChange('vehicleTypes', [
        ...(formData.vehicleTypes || []),
        newVehicleType.trim(),
      ]);
      setNewVehicleType('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        
        <h2 className="text-xl sm:text-sm uppercase font-semibold text-black dark:text-white mb-2 tracking-tight">
          Fleet Vehicles and Services
        </h2>
      </div>

      <div className="space-y-8">
        {/* Vehicle Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4">
            
            <p className="text-xs text-black/50 dark:text-white/50">
              Select all vehicle types in your fleet
            </p>
          </div>

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
                  onClick={() =>
                    isSelected
                      ? handleRemoveVehicleType(vehicleType)
                      : handleAddVehicleType(vehicleType)
                  }
                  className={`relative p-2 border-2 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'border-[#00C896] bg-[#00C896]/10 shadow-lg shadow-[#00C896]/20'
                      : 'border-black/10 dark:border-white/10 bg-white dark:bg-black hover:border-black/20 dark:hover:border-white/20 hover:shadow-md'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-3 h-3 bg-[#00C896] rounded-sm flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-black" />
                    </motion.div>
                  )}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-[#00C896] shadow-lg shadow-[#00C896]/30' : 'bg-black/5 dark:bg-white/10'}`}
                  >
                    <Truck
                      className={`w-5 h-5 ${isSelected ? 'text-black' : 'text-black/40 dark:text-white/40'}`}
                    />
                  </div>
                  <span
                    className={`text-sm font-semibold ${isSelected ? 'text-[#00C896]' : 'text-black dark:text-white'}`}
                  >
                    {vehicleType}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Custom vehicle input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <label className="block text-xs font-semibold text-black/70 dark:text-white/70 uppercase tracking-wider">
              Add Custom Vehicle Type
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newVehicleType}
                onChange={(e) => setNewVehicleType(e.target.value)}
                placeholder="e.g., Electric Scooter, Bicycle, etc."
                className="flex-1 px-4 py-3 bg-white dark:bg-black border-2 border-black/10 dark:border-white/10 rounded-2xl focus:outline-none focus:border-[#00C896] transition-all text-black dark:text-white font-medium placeholder:text-black/30 dark:placeholder:text-white/30"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCustomVehicleType();
                  }
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleCustomVehicleType}
                disabled={!newVehicleType.trim()}
                className="px-5 py-3 bg-[#00C896] text-black rounded-2xl hover:shadow-lg hover:shadow-[#00C896]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Selected vehicles */}
          <AnimatePresence>
            {formData.vehicleTypes?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-black dark:text-white">
                    Selected Vehicles
                  </label>
                  <span className="px-3 py-1 bg-[#00C896]/20 text-[#00C896] rounded-full text-xs font-bold">
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
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-black border border-[#00C896]/30 rounded-xl text-sm font-medium text-black dark:text-white shadow-sm"
                    >
                      <Truck className="w-3.5 h-3.5 text-[#00C896]" />
                      {vehicleType}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => handleRemoveVehicleType(vehicleType)}
                        className="ml-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full p-1 transition-colors"
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
              className="mt-2 text-xs text-red-500 font-medium"
            >
              {errors.vehicleTypes}
            </motion.p>
          )}
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="pt-6 border-t border-black/10 dark:border-white/10"
        >
          <div className="mb-4">
            <label className="block text-xs font-semibold text-black/70 dark:text-white/70 uppercase tracking-wider mb-1">
              Services Offered
            </label>
            <p className="text-xs text-black/50 dark:text-white/50">
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
                      ? 'border-[#00C896] bg-[#00C896]/10 shadow-lg shadow-[#00C896]/20'
                      : 'border-black/10 dark:border-white/10 bg-white dark:bg-black hover:border-black/20 dark:hover:border-white/20 hover:shadow-md'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-[#00C896] rounded-full flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-black" />
                    </motion.div>
                  )}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${isSelected ? 'bg-[#00C896] shadow-lg shadow-[#00C896]/30' : 'bg-black/5 dark:bg-white/10'}`}
                  >
                    <Zap
                      className={`w-6 h-6 ${isSelected ? 'text-black' : 'text-black/40 dark:text-white/40'}`}
                    />
                  </div>
                  <span
                    className={`text-sm font-semibold text-left ${isSelected ? 'text-[#00C896]' : 'text-black dark:text-white'}`}
                  >
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
              className="mt-3 text-xs text-red-500 font-medium"
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
