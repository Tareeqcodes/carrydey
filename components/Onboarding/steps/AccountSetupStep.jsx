import { Shield, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const AccountSetupStep = ({ formData, errors, onInputChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-black/5 dark:bg-white/5 rounded-3xl p-4 border border-black/10 dark:border-white/10 space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00C896] flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <h3 className="text-lg font-bold text-black dark:text-white tracking-tight">
            Agreements & Policies
          </h3>
        </div>

        <div className="space-y-4">
          {/* Terms */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`border-2 rounded-2xl p-5 transition-all ${errors.termsAccepted ? 'border-red-300 bg-red-50/50 dark:bg-red-900/10' : 'border-black/10 dark:border-white/10 bg-white dark:bg-black hover:border-emerald-300 dark:hover:border-emerald-700'}`}
          >
            <label className="flex items-start gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) =>
                  onInputChange('termsAccepted', e.target.checked)
                }
                className="mt-1 w-5 h-5 rounded-lg border-2 border-black/20 dark:border-white/20 text-emerald-600 focus:ring-2 focus:ring-[#00C896] cursor-pointer"
              />
              <div className="flex-1">
                <p className="font-semibold text-black dark:text-white mb-1.5">
                  Terms of Service Agreement
                </p>
                <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed">
                  I have read and agree to the{' '}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00C896] hover:underline font-semibold"
                  >
                    Terms of Service
                  </a>{' '}
                  which govern the use of this platform, including all
                  applicable policies and guidelines.
                </p>
                {errors.termsAccepted && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-xs text-red-500 flex items-center gap-1.5 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.termsAccepted}
                  </motion.p>
                )}
              </div>
            </label>
          </motion.div>

          {/* Privacy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className={`border-2 rounded-2xl p-5 transition-all ${errors.privacyPolicyAccepted ? 'border-red-300 bg-red-50/50 dark:bg-red-900/10' : 'border-black/10 dark:border-white/10 bg-white dark:bg-black hover:border-blue-300 dark:hover:border-blue-700'}`}
          >
            <label className="flex items-start gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.privacyPolicyAccepted}
                onChange={(e) =>
                  onInputChange('privacyPolicyAccepted', e.target.checked)
                }
                className="mt-1 w-5 h-5 rounded-lg border-2 border-black/20 dark:border-white/20 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <div className="flex-1">
                <p className="font-semibold text-black dark:text-white mb-1.5">
                  Privacy Policy
                </p>
                <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed">
                  I acknowledge that I have read and understood the{' '}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    Privacy Policy
                  </a>{' '}
                  and consent to the collection, use, and disclosure of my
                  personal information as described therein.
                </p>
                {errors.privacyPolicyAccepted && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-xs text-red-500 flex items-center gap-1.5 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.privacyPolicyAccepted}
                  </motion.p>
                )}
              </div>
            </label>
          </motion.div>
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0 bg-amber-50 dark:bg-amber-900/20" />
          <div className="relative p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-black dark:text-white mb-2 text-sm">
                Important Notice
              </p>
              <p className="text-xs text-black/60 dark:text-white/60 leading-relaxed">
                By submitting this application, you certify that all information
                provided is accurate and complete. Falsification of information
                may result in termination of services. You will receive a
                confirmation email once your application is processed.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Processing Time */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      ></motion.div>
    </motion.div>
  );
};

export default AccountSetupStep;
