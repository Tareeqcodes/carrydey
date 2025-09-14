'use client'
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function IntroPage({ onNext }) {
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
            <ShieldCheck className="w-16 h-16 mx-auto mb-6 text-gray-700" />
          </motion.div>
          <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
            Verify Your Identity
          </h1>
          <p className="text-gray-500 leading-relaxed">
            To ensure security and trust within our community, we need to verify your identity before you can start using our services.
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h3 className="font-medium text-gray-800 mb-4 text-sm tracking-wide uppercase">
            Required Documents
          </h3>
          <ul className="text-sm text-gray-600 space-y-3 leading-relaxed">
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              Valid driver's license or government ID
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              National Identification Number (NIN)
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              5-10 minutes of your time
            </li>
          </ul>
        </motion.div>
        
        <motion.button
          onClick={onNext}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-medium text-sm tracking-wide uppercase hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          Begin Verification
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}