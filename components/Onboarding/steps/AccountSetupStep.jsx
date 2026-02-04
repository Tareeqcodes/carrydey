import { Shield, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const AccountSetupStep = ({ formData, errors, onInputChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Agreement Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-3xl p-4 border border-gray-200/50 space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3A0A21] to-[#5A1A41] flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">
            Agreements & Policies
          </h3>
        </div>

        <div className="space-y-4">
          {/* Terms of Service */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`group border-2 rounded-2xl p-5 transition-all ${
              errors.termsAccepted
                ? 'border-red-300 bg-red-50/50'
                : 'border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/30'
            }`}
          >
            <label className="flex items-start gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) =>
                  onInputChange('termsAccepted', e.target.checked)
                }
                className="mt-1 w-5 h-5 rounded-lg border-2 border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all cursor-pointer"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1.5">
                  Terms of Service Agreement
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  I have read and agree to the{' '}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 hover:underline font-semibold transition-colors"
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
                    className="mt-3 text-xs text-red-600 flex items-center gap-1.5 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.termsAccepted}
                  </motion.p>
                )}
              </div>
            </label>
          </motion.div>

          {/* Privacy Policy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className={`group border-2 rounded-2xl p-5 transition-all ${
              errors.privacyPolicyAccepted
                ? 'border-red-300 bg-red-50/50'
                : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30'
            }`}
          >
            <label className="flex items-start gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.privacyPolicyAccepted}
                onChange={(e) =>
                  onInputChange('privacyPolicyAccepted', e.target.checked)
                }
                className="mt-1 w-5 h-5 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all cursor-pointer"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1.5">Privacy Policy</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  I acknowledge that I have read and understood the{' '}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors"
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
                    className="mt-3 text-xs text-red-600 flex items-center gap-1.5 font-medium"
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
          <div className="absolute inset-0 bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100" />
          <div className="relative p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-2 text-sm">
                Important Notice
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">
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
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
          <Clock className="w-4 h-4 text-green-600" />
          <p className="text-xs font-medium text-green-700">
            Processing time: 24-48 hours
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          You will be notified via email once your application is reviewed
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AccountSetupStep;