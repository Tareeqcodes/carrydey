'use client'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Shield } from 'lucide-react';

const NINInput = ({ nin, onNINChange, onNext }) => {
  const [localNIN, setLocalNIN] = useState(nin || '');
  const [isFocused, setIsFocused] = useState(false);
  
  const handleNINChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setLocalNIN(value);
    onNINChange(value);
  };

  const isValid = localNIN.length === 11;
  const progress = (localNIN.length / 11) * 100;

  return (
    <motion.div 
      className="max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            initial={{ rotate: -10, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <Shield className="w-16 h-16 mx-auto mb-6 text-gray-700" />
          </motion.div>
          <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
            National Identity
          </h1>
          <p className="text-gray-500 leading-relaxed">
            Enter your 11-digit National Identification Number for verification
          </p>
        </motion.div>
        
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-3 tracking-wide uppercase">
            NIN Number
          </label>
          
          {/* Progress bar */}
          <div className="mb-4">
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gray-900 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{localNIN.length}/11 digits</span>
              <span className={isValid ? 'text-gray-700 font-medium' : ''}>
                {isValid ? 'Complete' : 'In progress'}
              </span>
            </div>
          </div>

          <motion.div
            className={`relative transition-all duration-300 ${
              isFocused ? 'transform scale-[1.02]' : ''
            }`}
          >
            <input
              type="text"
              value={localNIN}
              onChange={handleNINChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter your 11-digit NIN"
              className={`w-full p-4 border-2 rounded-2xl text-lg font-mono tracking-widest text-center transition-all duration-300 focus:outline-none ${
                isFocused 
                  ? 'border-gray-400 bg-gray-50' 
                  : isValid 
                    ? 'border-gray-300 bg-white' 
                    : 'border-gray-200 bg-white'
              } ${isValid ? 'text-gray-900' : 'text-gray-600'}`}
              maxLength={11}
            />
            
            
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-800 mb-2 text-sm tracking-wide uppercase">
                Security Notice
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your NIN is encrypted and stored securely. We use it exclusively for identity verification and compliance purposes.
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.button
          onClick={onNext}
          disabled={!isValid}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-medium text-sm tracking-wide uppercase hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900"
          whileHover={isValid ? { y: -2 } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <motion.span
            key={isValid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {isValid ? 'Continue Verification' : 'Enter Complete NIN'}
          </motion.span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>

        {/* Subtle helper text */}
        <motion.p 
          className="text-center text-xs text-gray-400 mt-4 tracking-wide uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
        >
          Step 3 of 5
        </motion.p>
      </div>
    </motion.div>
  );
};

export default NINInput;