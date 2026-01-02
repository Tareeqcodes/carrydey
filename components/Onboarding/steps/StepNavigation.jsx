import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import Button from '../Shared/Button';

const StepNavigation = ({ 
  currentStep, 
  onPrevious, 
  onNext, 
  onSubmit,
  isSubmitting = false 
}) => {
  return (
    <>
      <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={onPrevious}
          disabled={currentStep === 1 || isSubmitting}
        >
          Previous
        </Button>
        
        <Button
          onClick={currentStep === 6 ? onSubmit : onNext}
          loading={isSubmitting}  // Changed from 'loading' to 'isSubmitting'
          disabled={isSubmitting}  // Add disabled state
          className="flex items-center gap-2"
        >
          {currentStep === 6 ? (
            <>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
              <ArrowRight className="w-5 h-5" />
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </div>
      
      {/* Progress dots for mobile */}
      <div className="lg:hidden flex justify-center gap-2 mt-8">
        {[1, 2, 3, 4, 5, 6].map((step) => (
          <div
            key={step}
            className={`w-2 h-2 rounded-full ${
              currentStep === step
                ? 'bg-[#3A0A21]'
                : currentStep > step
                ? 'bg-green-500'
                : 'bg-gray-300'
            }`}
          ></div>
        ))}
      </div>
      
      {/* Bottom note */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <a href="#" className="text-[#3A0A21] hover:underline font-medium">
            Sign in here
          </a>
        </p>
      </div>
    </>
  );
};

export default StepNavigation;