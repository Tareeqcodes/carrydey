'use client';
import { Building2, AlertCircle, Phone, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../Shared/Input';

const BasicInfoStep = ({ formData, errors, onInputChange }) => {
  const organizationTypes = ['Courier Service', 'Logistics Company'];

  const inputClass = (hasError) =>
    `w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none transition-all font-medium placeholder:text-black/30 dark:placeholder:text-white/30 bg-white dark:bg-black text-black dark:text-white ${
      hasError
        ? 'border-red-300 focus:border-red-400'
        : 'border-black/10 dark:border-white/10 focus:border-[#00C896]'
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        
        <h2 className="text-xl uppercase sm:text-sm font-semibold text-black dark:text-white mb-2 tracking-tight">
          Logistics Details
        </h2>
      </div>

      <div className="space-y-6">
        {/* Organization Name */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-xs font-semibold text-black/70 dark:text-white/70 uppercase tracking-wider mb-3">
            Organization Name
          </label>
          <div className="relative flex items-center">
            <Building2 className="absolute left-4 w-5 h-5 text-black/40 dark:text-white/40" />
            <input
              type="text"
              value={formData.organizationName}
              onChange={(e) =>
                onInputChange('organizationName', e.target.value)
              }
              className={inputClass(errors.organizationName)}
              placeholder="Enter your company name"
            />
          </div>
          {errors.organizationName && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs text-red-500 flex items-center gap-1.5 font-medium"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.organizationName}
            </motion.p>
          )}
        </motion.div>

        {/* Organization Type */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <label className="block text-xs font-semibold text-black/70 dark:text-white/70 uppercase tracking-wider mb-3">
            Organization Type
          </label>
          <div className="relative flex items-center">
            <Briefcase className="absolute left-4 w-5 h-5 text-black/40 dark:text-white/40 pointer-events-none" />
            <select
              value={formData.organizationType}
              onChange={(e) =>
                onInputChange('organizationType', e.target.value)
              }
              className={`${inputClass(errors.organizationType)} pr-10 appearance-none cursor-pointer`}
            >
              <option value="">Select organization type</option>
              {organizationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="absolute right-4 pointer-events-none">
              <svg
                className="w-5 h-5 text-black/40 dark:text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {errors.organizationType && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs text-red-500 flex items-center gap-1.5 font-medium"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.organizationType}
            </motion.p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Input
              label="Primary Phone"
              type="tel"
              value={formData.phone}
              className={inputClass(errors.phone)}
              onChange={(e) => onInputChange('phone', e.target.value)}
              placeholder="+234 912 449 8160"
              icon={Phone}
              error={errors.phone}
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Input
              label="Alternate Phone (Optional)"
              type="tel"
              value={formData.alternatePhone}
              className={inputClass}
              onChange={(e) => onInputChange('alternatePhone', e.target.value)}
              placeholder="+234 912 449 8160"
              icon={Phone}
              error={errors.alternatePhone}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default BasicInfoStep;
