'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { motion } from 'framer-motion';
import { useVerification } from '../../hooks/useVerification';
import ProgressBar from '../../components/verification/ProgressBar';
import {IntroPage} from '@/components/verification/IntroPage';
import {LicenseUpload} from '../../components/verification/LicenseUpload';
import NINInput from '../../components/verification/NINInput';
import Terms from '../../components/verification/Terms';
import {SubmitVerification} from '../../components/verification/SubmitVerification';

const VerificationPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [stepHistory, setStepHistory] = useState([]);
  
  const {
    verificationData,
    isLoading,
    error,
    uploadLicense,
    updateNIN,
    acceptTerms,
    submitVerification
  } = useVerification();

  const goToStep = (step) => {
    setStepHistory(prev => [...prev, currentStep]);
    setCurrentStep(step);
  };

  const goBack = () => {
    if (stepHistory.length > 0) {
      const previousStep = stepHistory[stepHistory.length - 1];
      setStepHistory(prev => prev.slice(0, -1));
      setCurrentStep(previousStep);
    }
  };

  const handleFileUpload = async (file) => {
    const result = await uploadLicense(file);
    if (result.success) {
      return result;
    }
    return result;
  };

  const handleSubmit = async () => {
    const result = await submitVerification();
    if (result.success) {
     router.push('/pendingVerification');
    }
  };

  const updateVerificationData = (updates) => {
    if (updates.hasOwnProperty('termsAccepted')) {
      acceptTerms(updates.termsAccepted);
    }
  };

  const Header = ({ showBack = false }) => (
    <motion.div 
      className="flex items-center justify-between mb-12 pt-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {showBack ? (
        <motion.button
          onClick={goBack}
          className="group p-3 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M15 19l-7-7 7-7"
              className="group-hover:stroke-2"
            />
          </svg>
        </motion.button>
      ) : (
        <div className="w-12"></div>
      )}
      
      <motion.div 
        className='flex-1 text-center'
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.h1 
          className="text-4xl font-light text-gray-900 tracking-tight mb-1"
          initial={{ letterSpacing: '0.5em', opacity: 0 }}
          animate={{ letterSpacing: '-0.025em', opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          CarryDey
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-sm font-medium text-gray-600 tracking-wide">SEND SMARTER</p>
          <p className="text-sm font-medium text-gray-400 tracking-wide">TRAVEL RICHER</p>
        </motion.div>
      </motion.div>
      
      <div className="w-12"></div>
    </motion.div>
  );

  const renderStep = () => {
    const stepComponents = {
      1: (
        <IntroPage onNext={() => goToStep(2)} />
      ),
      2: (
        <LicenseUpload
          uploadedFile={verificationData.licenseFileId ? { name: 'License uploaded' } : null}
          onFileUpload={handleFileUpload}
          isLoading={isLoading}
          error={error}
          onNext={() => goToStep(3)}
        />
      ),
      3: (
        <NINInput
          nin={verificationData.nin}
          onNINChange={updateNIN}
          onNext={() => goToStep(4)}
        />
      ),
      4: (
        <Terms
          verificationData={verificationData}
          updateVerificationData={updateVerificationData}
          onNext={() => goToStep(5)}
          loading={isLoading}
          error={error}
        />
      ),
      5: (
        <SubmitVerification
          verificationData={verificationData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      )
    };

    return stepComponents[currentStep] || null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-white to-gray-50/20"></div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, gray 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      ></div>

      <div className="relative z-10 px-8 py-6">
        <div className="max-w-lg mx-auto">
          <Header showBack={currentStep > 1} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ProgressBar currentStep={currentStep} />
          </motion.div>
          
          <main className="mt-8 min-h-[400px]">
            {renderStep()}
          </main>

          <motion.footer 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <p className="text-xs text-gray-400 tracking-widest uppercase font-medium">
              Secure Verification Process
            </p>
          </motion.footer>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;