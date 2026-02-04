import React from 'react';
import { UserPlus, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../Shared/Input';

const ContactDetailsStep = ({ formData, errors, onInputChange }) => {
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
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 shadow-xl shadow-blue-500/30"
        >
          <UserPlus className="w-8 h-8 text-white" />
        </motion.div>
        
        <h2 className="text-xl text-gray-500 max-w-md mx-auto">
          Primary contact information for your organization
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
            label="Contact Name"
            value={formData.contactPerson}
            onChange={(e) => onInputChange('contactPerson', e.target.value)}
            placeholder="Full name of contact person"
            icon={UserPlus}
            error={errors.contactPerson}
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="contact@company.com"
            icon={Mail}
            error={errors.email}
            required
          />
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
              onChange={(e) => onInputChange('alternatePhone', e.target.value)}
              placeholder="+234 912 449 8160"
              icon={Phone}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactDetailsStep;