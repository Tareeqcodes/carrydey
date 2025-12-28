'use client';
import { useState } from 'react';
import OnboardingLayout from '@/components/Onboarding/OnboardingLayout';
import BasicInfoStep from '@/components/Onboarding/steps/BasicInfoStep';
import ContactDetailsStep from '@/components/Onboarding/steps/ContactDetailsStep';
import AddressStep from '@/components/Onboarding/steps/AddressStep';
import BusinessDetailsStep from '@/components/Onboarding/steps/BusinessDetailsStep';
import DocumentsStep from '@/components/Onboarding/steps/DocumentsStep';
import AccountSetupStep from '@/components/Onboarding/steps/AccountSetupStep';
import SuccessStep from '@/components/Onboarding/steps/SuccessStep';
import StepNavigation from '@/components/Onboarding/steps/StepNavigation';
import useOnboardingForm from '@/hooks/useOnboardingForm';

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const {
    formData,
    errors,
    handleInputChange,
    handleServiceToggle,
    handleFileUpload,
    validateStep,
  } = useOnboardingForm();

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 7));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(6)) {
      console.log('Submitting form data:', formData);
      alert('Organization profile submitted successfully!');
      setCurrentStep(7);
    }
  };

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
          <ContactDetailsStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <AddressStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 4:
        return (
          <BusinessDetailsStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onServiceToggle={handleServiceToggle}
          />
        );
      case 5:
        return (
          <DocumentsStep
            formData={formData}
            errors={errors}
            onFileUpload={handleFileUpload}
          />
        );
      case 6:
        return (
          <AccountSetupStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 7:
        return <SuccessStep />;
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout currentStep={currentStep}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
        {renderStep()}
        {currentStep < 7 && (
          <StepNavigation
            currentStep={currentStep}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingPage;
