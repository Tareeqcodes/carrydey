'use client';
import { motion } from "framer-motion";
import VerificationHeader from "./VerificationHeader";

export function Pending() {
  return (
    <div className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-white to-gray-50/20"></div>
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, gray 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      ></div>

      <div className="relative z-10 px-8 py-6">
        <div className="max-w-lg mx-auto">
          <VerificationHeader />
          
          <motion.div 
            className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="text-center mb-8"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.svg 
                width="64" 
                height="64" 
                className="mx-auto mb-6 text-gray-700" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </motion.svg>
              <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
                Verification Submitted
              </h1>
              <p className="text-gray-500 leading-relaxed">
                Your documents are being reviewed by our security team
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <span className="inline-flex items-center gap-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium tracking-wide uppercase">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                </svg>
                Under Review
              </span>
            </motion.div>
            
            <motion.div 
              className="space-y-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {[
                { title: "Documents Received", status: "completed", time: "Completed just now" },
                { title: "Security Review", status: "current", time: "Typically takes 12-24 hours" },
                { title: "Account Activation", status: "pending", time: "Email notification sent" }
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (index * 0.1), duration: 0.4 }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.status === 'completed' ? 'bg-gray-900 text-white' :
                    item.status === 'current' ? 'bg-gray-700 text-white' :
                    'bg-gray-200 text-gray-400'
                  }`}>
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                      {item.status === 'completed' ? (
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                      ) : item.status === 'current' ? (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                      ) : (
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                      )}
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.time}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-8 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
            >
              <p className="text-sm text-gray-600 font-medium">
                We'll email you once verification is complete
              </p>
            </motion.div>
            
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
            >
              <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium text-sm tracking-wide uppercase hover:bg-gray-200 transition-all flex items-center justify-center gap-3">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                View as Verified (Demo)
              </button>
              
              <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-medium text-sm tracking-wide uppercase hover:bg-gray-800 transition-all flex items-center justify-center gap-3">
                Return Home
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}