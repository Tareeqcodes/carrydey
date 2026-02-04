'use client';
import { MapPin, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../Shared/Input';

const AddressStep = ({ formData, errors, onInputChange }) => {
  const serviceCitiesArray = formData.serviceCities
    ? formData.serviceCities
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '')
    : [];

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
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 mb-4 shadow-xl shadow-purple-500/30"
        >
          <MapPin className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-sm font-semibold text-gray-800 mb-2 tracking-tight">
          Primary business location for official correspondence
        </h2>
        
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Input
            label="Street Address"
            value={formData.street}
            onChange={(e) => onInputChange('street', e.target.value)}
            placeholder="123 Business Street"
            icon={Building}
            error={errors['street']}
            required
          />
        </motion.div>

        {/* Service Cities Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-6 border-t border-gray-200"
        >
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Service Areas
            </h3>
            <p className="text-xs text-gray-500">
              List all cities where you provide delivery services
            </p>
          </div>

          <Input
            label="Service Cities"
            value={formData.serviceCities}
            onChange={(e) => onInputChange('serviceCities', e.target.value)}
            placeholder="e.g., Lagos, Abuja, Kano, Kaduna"
            error={errors['serviceCities']}
            required
          />

          {serviceCitiesArray.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-2 mt-4"
            >
              {serviceCitiesArray.map((city, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/50 rounded-full text-sm font-medium shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5 mr-1.5" />
                  {city}
                </motion.span>
              ))}
            </motion.div>
          )}

          <p className="text-xs text-gray-500 mt-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Separate multiple cities with commas
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AddressStep;