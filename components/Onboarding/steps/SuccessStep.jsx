'use client';
import { useRouter } from 'next/navigation';
import { CheckCircle, Mail, Shield, Home, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const SuccessStep = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-0 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-12">
          {/* Success Animation */}
          {/* <div className="relative mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="relative z-10"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/40">
                <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: [0, 0.5, 0] }}
              transition={{ delay: 0.3, duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-24 h-24 rounded-full border-4 border-green-300" />
            </motion.div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2, opacity: [0, 0.3, 0] }}
              transition={{ delay: 0.5, duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-24 h-24 rounded-full border-4 border-green-200" />
            </motion.div>
          </div> */}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Success!
              </h1>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-xl font-semibold text-emerald-600">
              Application Submitted
            </p>
            <p className="text-gray-600 leading-relaxed mx-auto">
              Thank you for registering! We've received your application and will review it shortly. 
              You'll receive a confirmation email once approved.
            </p>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 space-y-3"
          >
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Contact</p>
                <p className="text-sm font-semibold text-gray-900">support@carrydey.tech</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Security</p>
                <p className="text-sm font-semibold text-gray-900">Your data is secure</p>
              </div>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBackToHome}
              className="w-full py-4 bg-gradient-to-r from-[#3A0A21] to-[#5A1A41] text-white rounded-2xl font-semibold hover:shadow-xl hover:shadow-[#3A0A21]/30 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.button>
          </motion.div>

        
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessStep;