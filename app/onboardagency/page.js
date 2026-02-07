'use client';
import { useState } from 'react';
import OnboardingLayout from '@/components/Onboarding/OnboardingLayout';
import BasicInfoStep from '@/components/Onboarding/steps/BasicInfoStep';
import AddressStep from '@/components/Onboarding/steps/AddressStep';
import BusinessDetailsStep from '@/components/Onboarding/steps/BusinessDetailsStep';
import AccountSetupStep from '@/components/Onboarding/steps/AccountSetupStep';
import SuccessStep from '@/components/Onboarding/steps/SuccessStep';
import StepNavigation from '@/components/Onboarding/steps/StepNavigation';
import useOnboardingForm from '@/hooks/useOnboardingForm';
import { useAuth } from '@/hooks/Authcontext';
import NotUser from '@/hooks/NotUser';
const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const { user } = useAuth();

  const {
    formData,
    errors,
    handleInputChange,
    handleServiceToggle,
    validateStep,
     submitToAppwrite,
     isSubmitting
  } = useOnboardingForm();

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      console.log('Submitting form data:', formData);

      const result = await submitToAppwrite(); 
      if (result.success) {
        console.log('Submission successful:', result.data);
       
        setCurrentStep(5);
      } else {
        console.error('Submission failed:', result.error);
        alert(`Submission failed: ${result.error}`);
      }
    }
  };

   if (!user) {
    return <NotUser />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <AddressStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <BusinessDetailsStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onServiceToggle={handleServiceToggle}
          />
        );
      case 4:
        return (
          <AccountSetupStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 5:
        return <SuccessStep />;
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout currentStep={currentStep}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 md:p-8 mb-28">
        {renderStep()}
        {currentStep < totalSteps && (
          <StepNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingPage;
