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
      <div className="text-center">
       
        <h2 className="text-xl uppercase sm:text-sm font-semibold text-black dark:text-white mb-2 tracking-tight">
          Primary business location
        </h2>
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Input
            label="Street Address"
            value={formData.street}
            className="w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none transition-all font-medium placeholder:text-black/30 dark:placeholder:text-white/30 bg-white dark:bg-black text-black dark:text-white"
            onChange={(e) => onInputChange('street', e.target.value)}
            placeholder="123 Business Street"
            icon={Building}
            error={errors['street']}
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-6 border-t border-black/10 dark:border-white/10"
        >
          <div className="mb-6">
            <h3 className="text-base font-bold text-black dark:text-white mb-1 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#00C896]" />
              Service Areas
            </h3>
            <p className="text-xs text-black/50 dark:text-white/50">
              List all cities where you provide delivery services
            </p>
          </div>

          <Input
            label="Service Cities"
            value={formData.serviceCities}
            className="w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none transition-all font-medium placeholder:text-black/30 dark:placeholder:text-white/30 bg-white dark:bg-black text-black dark:text-white"
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
                  className="inline-flex items-center px-4 py-2 bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/20 rounded-full text-sm font-medium shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5 mr-1.5" />
                  {city}
                </motion.span>
              ))}
            </motion.div>
          )}
          <p className="text-xs text-black/40 dark:text-white/40 mt-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-black/30 dark:bg-white/30" />
            Separate multiple cities with commas
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AddressStep;
