'use client';
import { Building2, Globe, AlertCircle, Calendar, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const BasicInfoStep = ({ formData, errors, onInputChange }) => {
  const organizationTypes = [
    'Courier Service',
    'Logistics Company',
  ];

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
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 shadow-xl shadow-emerald-500/30"
        >
          <Building2 className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-sm font-semibold text-gray-800 mb-2 tracking-tight">
          Tell us about your logistics company
        </h2>
      <p className="text-sm text-gray-500 max-w-md mx-auto">
          
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Organization Name */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
            Organization Name
          </label>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
            <div className="relative flex items-center">
              <Building2 className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
              <input
                type="text"
                value={formData.organizationName}
                onChange={(e) =>
                  onInputChange('organizationName', e.target.value)
                }
                className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-2xl focus:outline-none transition-all text-gray-900 font-medium placeholder:text-gray-400 ${
                  errors.organizationName 
                    ? 'border-red-300 bg-red-50/50 focus:border-red-400' 
                    : 'border-gray-200 focus:border-emerald-500 focus:bg-emerald-50/30'
                }`}
                placeholder="Enter your company name"
              />
            </div>
          </div>
          {errors.organizationName && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs text-red-600 flex items-center gap-1.5 font-medium"
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
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
            Organization Type
          </label>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
            <div className="relative flex items-center">
              <Briefcase className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none" />
              <select
                value={formData.organizationType}
                onChange={(e) => onInputChange('organizationType', e.target.value)}
                className={`w-full pl-12 pr-10 py-4 bg-white border-2 rounded-2xl focus:outline-none transition-all text-gray-900 font-medium appearance-none cursor-pointer ${
                  errors.organizationType 
                    ? 'border-red-300 bg-red-50/50 focus:border-red-400' 
                    : 'border-gray-200 focus:border-emerald-500 focus:bg-emerald-50/30'
                }`}
              >
                <option value="" className="text-gray-400">Select organization type</option>
                {organizationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          {errors.organizationType && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs text-red-600 flex items-center gap-1.5 font-medium"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.organizationType}
            </motion.p>
          )}
        </motion.div>

        {/* Year & Website Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Year Established */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
              Year Established
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
              <div className="relative flex items-center">
                <Calendar className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.yearEstablished}
                  onChange={(e) => onInputChange('yearEstablished', e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-2xl focus:outline-none transition-all text-gray-900 font-medium placeholder:text-gray-400 ${
                    errors.yearEstablished 
                      ? 'border-red-300 bg-red-50/50 focus:border-red-400' 
                      : 'border-gray-200 focus:border-emerald-500 focus:bg-emerald-50/30'
                  }`}
                  placeholder="YYYY"
                />
              </div>
            </div>
            {errors.yearEstablished && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs text-red-600 flex items-center gap-1.5 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.yearEstablished}
              </motion.p>
            )}
          </motion.div>

          {/* Website */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
              Website <span className="text-gray-400 normal-case">(Optional)</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
              <div className="relative flex items-center">
                <Globe className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => onInputChange('website', e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-blue-50/30 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                  placeholder="https://yourcompany.com"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default BasicInfoStep;