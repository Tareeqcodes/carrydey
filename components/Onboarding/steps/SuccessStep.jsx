'use client';
import { useRouter } from 'next/navigation';
import { Mail, Shield, Home, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const SuccessStep = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-0 bg-white dark:bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <div className="bg-white dark:bg-black rounded-3xl shadow-2xl border border-black/10 dark:border-white/10 p-8 sm:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight">
                Success!
              </h1>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-xl font-semibold text-emerald-600">
              Application Submitted
            </p>
            <p className="text-black/60 dark:text-white/60 leading-relaxed mx-auto">
              Thank you for registering! We've received your application and
              will review it shortly. You'll receive a confirmation email once
              approved.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 space-y-3"
          >
            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wide">
                  Contact
                </p>
                <p className="text-sm font-semibold text-black dark:text-white">
                  support@carrydey.tech
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-900/30">
              <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wide">
                  Security
                </p>
                <p className="text-sm font-semibold text-black dark:text-white">
                  Your data is secure
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                router.push('/');
                router.refresh();
              }}
              className="w-full py-4 bg-[#00C896] text-black rounded-2xl font-semibold hover:shadow-xl hover:shadow-[#00C896]/30 transition-all flex items-center justify-center gap-2"
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
