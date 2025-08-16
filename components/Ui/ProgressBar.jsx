'use client'
const ProgressBar = ({ currentStep, totalSteps = 4 }) => {
  const steps = [
    'Start Verification',
    'Upload License',
    'Enter NIN',
    'Accept Terms',
    'Submit'
  ];

  return (
    <div className="mb-8">
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`text-center ${
              index + 1 <= currentStep ? 'text-orange-600 font-medium' : ''
            }`}
          >
            {step}
          </div>
        ))}
      </div>
      
      {/* <div className="text-sm text-gray-500 text-center">
        Step {currentStep} of {totalSteps}
      </div> */}
    </div>
  );
};

export default ProgressBar;