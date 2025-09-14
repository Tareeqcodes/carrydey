'use client'
import { motion } from 'framer-motion'

const ProgressBar = ({ currentStep, totalSteps = 4 }) => {
  const steps = [
    'Start',
    'Upload',
    'Enter NIN',
    'Terms',
    'Submit'
  ];

  return (
    <div className="mb-8">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          // const isUpcoming = stepNumber > currentStep;

          return (
            <motion.div 
              key={index} 
              className="flex flex-col items-center relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute top-3 left-8 w-12 h-0.5 bg-gray-200">
                  <motion.div 
                    className="h-full bg-black"
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              )}

              {/* Step circle */}
              <motion.div 
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-2 relative z-10 bg-white ${
                  isActive ? 'border-black shadow-lg' : 
                  isCompleted ? 'border-black bg-black' : 
                  'border-gray-300'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                  borderColor: isActive ? '#000000' : isCompleted ? '#000000' : '#d1d5db'
                }}
                transition={{ duration: 0.3 }}
              >
                {isCompleted && (
                  <motion.svg 
                    width="12" 
                    height="12" 
                    fill="none" 
                    stroke="white" 
                    viewBox="0 0 24 24"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                  </motion.svg>
                )}
                {isActive && (
                  <motion.div 
                    className="w-2 h-2 bg-black rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Step label */}
              <motion.span 
                className={`text-xs font-medium transition-colors duration-300 ${
                  isActive ? 'text-black' : 
                  isCompleted ? 'text-gray-700' : 
                  'text-gray-400'
                }`}
                animate={{ 
                  color: isActive ? '#000000' : isCompleted ? '#374151' : '#9ca3af',
                  y: isActive ? -2 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                {step}
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;