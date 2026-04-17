import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import Button from '../Shared/Button';

const StepNavigation = ({
  currentStep,
  totalSteps = 4,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting = false,
}) => {
  const isLastStep = currentStep === totalSteps;

  return (
    <>
      <div className="flex justify-between pt-8 mt-8 border-t border-black/10 dark:border-white/10">
        <Button
          variant="ghost"
          onClick={onPrevious}
          disabled={currentStep === 1 || isSubmitting}
        >
          Previous
        </Button>
        <Button
          onClick={isLastStep ? onSubmit : onNext}
          loading={isSubmitting}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          {isLastStep ? (
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

      {/* Progress dots — mobile */}
      <div className="lg:hidden flex justify-center gap-2 mt-8">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`w-2 h-2 rounded-full transition-all ${
              currentStep === step
                ? 'bg-[#00C896]'
                : currentStep > step
                  ? 'bg-green-500'
                  : 'bg-black/20 dark:bg-white/20'
            }`}
          />
        ))}
      </div>
    </>
  );
};

export default StepNavigation;
