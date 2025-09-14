'use client'
import { motion } from "framer-motion";
import { ChevronRight, Check, FileText, Shield } from "lucide-react";

const Terms = ({ verificationData, updateVerificationData, onNext, loading, error }) => {
    const handleTermsToggle = () => {
        updateVerificationData({ termsAccepted: !verificationData.termsAccepted });
    };

    const termsItems = [
        "Handle all packages with care and professionalism",
        "Maintain the security and confidentiality of deliveries",
        "Follow all local laws and regulations",
        "Provide accurate delivery updates and communicate clearly",
        "Respect pickup and delivery timeframes",
        "Maintain a professional demeanor with all users"
    ];

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
                        <FileText className="w-16 h-16 mx-auto mb-6 text-gray-700" />
                    </motion.div>
                    <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
                        Terms & Conduct
                    </h1>
                    <p className="text-gray-500 leading-relaxed">
                        Review our delivery terms and community guidelines to continue
                    </p>
                </motion.div>
                
                <motion.div 
                    className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-8 max-h-64 overflow-y-auto"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <h4 className="font-medium text-gray-800 mb-4 text-sm tracking-wide uppercase flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Delivery Requirements
                    </h4>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        By becoming a Sendr traveler, you agree to:
                    </p>
                    <div className="space-y-3">
                        {termsItems.map((item, index) => (
                            <motion.div 
                                key={index}
                                className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + (index * 0.05), duration: 0.3 }}
                            >
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                <span>{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
                
                <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                >
                    <div className="flex items-start gap-4">
                        <motion.button
                            onClick={handleTermsToggle}
                            disabled={loading}
                            className={`w-6 h-6 border-2 rounded-lg flex-shrink-0 mt-1 transition-all duration-300 flex items-center justify-center ${
                                verificationData.termsAccepted 
                                    ? 'bg-gray-900 border-gray-900' 
                                    : 'border-gray-300 hover:border-gray-400'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            whileHover={!loading ? { scale: 1.05 } : {}}
                            whileTap={!loading ? { scale: 0.95 } : {}}
                            animate={{
                                backgroundColor: verificationData.termsAccepted ? '#111827' : '#ffffff',
                                borderColor: verificationData.termsAccepted ? '#111827' : '#d1d5db'
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ 
                                    scale: verificationData.termsAccepted ? 1 : 0,
                                    opacity: verificationData.termsAccepted ? 1 : 0
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <Check className="w-4 h-4 text-white" />
                            </motion.div>
                        </motion.button>
                        
                        <label 
                            className={`text-sm text-gray-600 leading-relaxed ${
                                loading ? 'cursor-default' : 'cursor-pointer'
                            }`} 
                            onClick={!loading ? handleTermsToggle : undefined}
                        >
                            I have read and agree to the{' '}
                            <motion.span 
                                className="text-gray-900 font-medium hover:underline underline-offset-2"
                                whileHover={{ color: '#374151' }}
                            >
                                Sendr Delivery Terms
                            </motion.span>
                            {' '}and{' '}
                            <motion.span 
                                className="text-gray-900 font-medium hover:underline underline-offset-2"
                                whileHover={{ color: '#374151' }}
                            >
                                Code of Conduct
                            </motion.span>
                        </label>
                    </div>
                </motion.div>
                
                {error && (
                    <motion.div 
                        className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-6"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs">!</span>
                            </div>
                            <p className="text-sm text-gray-700 font-medium">{error}</p>
                        </div>
                    </motion.div>
                )}
                
                <motion.button
                    onClick={onNext}
                    disabled={!verificationData.termsAccepted || loading}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-medium text-sm tracking-wide uppercase hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900"
                    whileHover={verificationData.termsAccepted && !loading ? { y: -2 } : {}}
                    whileTap={verificationData.termsAccepted && !loading ? { scale: 0.98 } : {}}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                >
                    <motion.span
                        key={verificationData.termsAccepted}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        {verificationData.termsAccepted ? 'Accept & Continue' : 'Please Accept Terms'}
                    </motion.span>
                    <ChevronRight className="w-4 h-4" />
                </motion.button>

                {/* Progress indicator */}
                <motion.p 
                    className="text-center text-xs text-gray-400 mt-4 tracking-wide uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.4 }}
                >
                    Step 4 of 5
                </motion.p>
            </div>
        </motion.div>
    );
};

export default Terms;