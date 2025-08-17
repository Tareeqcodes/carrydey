'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Changed from 'next/router'
// import { useAuth } from '../../lib/config/Appwriteconfig';
import { useVerification } from '../../hooks/useVerification';
import ProgressBar from '../../components/ui/ProgressBar';
import IntroPage from '@/components/IntroPage';
import LicenseUpload from '../../components/verification/LicenseUpload';
import NINInput from '../../components/verification/NINInput';
import Terms from '../../components/verification/Terms';
import SubmitVerification from '../../components/verification/SubmitVerification';

const VerificationPage = () => {
  const router = useRouter();
  // const { user, loading } = useAuth();
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

  // Redirect if not authenticated
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
  //     </div>
  //   );
  // }

  // if (!user) {
  //   router.push('/login');
  //   return null;
  // }

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
      // File uploaded successfully, the hook will update the state
      return result;
    }
    return result;
  };

  const handleSubmit = async () => {
    const result = await submitVerification();
    if (result.success) {
     router.push('/traveler');
    }
  };

  // Helper function to update verification data
  const updateVerificationData = (updates) => {
    // Since acceptTerms expects a boolean, we need to handle this properly
    if (updates.hasOwnProperty('termsAccepted')) {
      acceptTerms(updates.termsAccepted);
    }
    // Add other update handlers here if needed
  };

  const Header = ({ showBack = false }) => (
    <div className="flex items-center justify-between mb-8 pt-5">
      {showBack ? (
        <button
          onClick={goBack}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
      ) : (
        <div className="w-9"></div>
      )}
      <div className='flex-1 text-center'>
        <div className="text-3xl font-bold text-orange-600">Sendr</div>
        <p>Send Smarter.</p>
        <p>Travel Richer.</p>
      </div>
      <div className="w-9"></div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <IntroPage
            onNext={() => goToStep(2)}
           />
        );
      case 2:
        return (
          <LicenseUpload
            uploadedFile={verificationData.licenseFileId ? { name: 'License uploaded' } : null}
            onFileUpload={handleFileUpload}
            isLoading={isLoading}
            error={error}
            onNext={() => goToStep(3)}
          />
        );
      case 3:
        return (
          <NINInput
            nin={verificationData.nin}
            onNINChange={updateNIN}
            onNext={() => goToStep(4)}
          />
        );
      case 4:
        return (
          <Terms
            verificationData={verificationData}
            updateVerificationData={updateVerificationData}
            onNext={() => goToStep(5)}
            loading={isLoading}
            error={error}
          />
        );
      case 5:
        return (
          <SubmitVerification
            verificationData={verificationData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white px-6 py-5">
      <div className="max-w-md mx-auto">
        <Header showBack={currentStep > 1} />
        <ProgressBar currentStep={currentStep} />
        {renderStep()}
      </div>
    </div>
  );
};

export default VerificationPage;