'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Send } from "lucide-react";
import PendingPage from "@/app/pendingVerification/page";

export function SubmitVerification({
  verificationData,
  onSubmit,
  isLoading,
  error,
}) {
  const [isSubmitted, setIsSubmitted] = useState(false); 

  const verificationItems = [
    {
      completed: !!verificationData.licenseFileId,
      text: "Driver's License uploaded",
    },
    {
      completed: verificationData.nin && verificationData.nin.length === 11,
      text: "NIN number provided",
    },
    {
      completed: verificationData.termsAccepted,
      text: "Terms accepted",
    },
  ];

  const allItemsCompleted = verificationItems.every((item) => item.completed);

  const handleSubmit = async () => {
    try {
      await onSubmit();
      // After successful submission, show pending page
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  if (isSubmitted) {
    return <PendingPage />;
  }

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
          <CheckCircle className="w-16 h-16 mx-auto mb-6 text-gray-700" />
          <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
            Ready to Submit
          </h1>
          <p className="text-gray-500 leading-relaxed">
            Review your information and submit for verification
          </p>
        </motion.div>

        <motion.div 
          className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h4 className="font-medium text-gray-800 mb-4 text-sm tracking-wide uppercase">
            Verification Summary
          </h4>
          <div className="space-y-4">
            {verificationItems.map((item, index) => (
              <motion.div 
                key={index} 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (index * 0.1), duration: 0.3 }}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  item.completed ? "bg-gray-900" : "bg-gray-300"
                }`}>
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className={`text-sm ${
                  item.completed ? "text-gray-700" : "text-gray-400"
                }`}>
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {error && (
          <motion.div 
            className="bg-gray-50 border border-gray-200 p-4 rounded-2xl mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-gray-700 font-medium">Error: {error}</p>
          </motion.div>
        )}

        <motion.div 
          className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h4 className="font-medium text-gray-800 mb-4 text-sm tracking-wide uppercase">
            What Happens Next
          </h4>
          <ul className="text-sm text-gray-600 space-y-3 leading-relaxed">
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              Our team will review your documents
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              You'll receive an email with verification status
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              Verification typically takes 12-24 hours
            </li>
          </ul>
        </motion.div>

        <motion.button
          onClick={handleSubmit}
          disabled={!allItemsCompleted || isLoading}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-medium text-sm tracking-wide uppercase hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={!isLoading && allItemsCompleted ? { y: -2 } : {}}
          whileTap={!isLoading && allItemsCompleted ? { scale: 0.98 } : {}}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Processing...
            </>
          ) : (
            <>
              Submit for Review
              <Send className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}