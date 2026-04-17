import React from 'react';
import { Building2, MapPin, Users, Shield, CheckCircle } from 'lucide-react';

const ProgressSidebar = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Basic Information', icon: Building2 },
    { number: 2, title: 'Address', icon: MapPin },
    { number: 3, title: 'Business Details', icon: Users },
    { number: 4, title: 'Account Setup', icon: Shield },
  ];

  return (
    <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
      <div className="sticky top-8 space-y-6">
        <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-sm border border-black/10 dark:border-white/10">
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  currentStep === step.number
                    ? 'bg-[#00C896] text-black'
                    : currentStep > step.number
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : 'text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step.number
                      ? 'bg-black/10 text-black'
                      : currentStep > step.number
                        ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'
                        : 'bg-black/5 dark:bg-white/10 text-black/40 dark:text-white/40'
                  }`}
                >
                  {currentStep > step.number ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold">{step.title}</p>
                </div>
                {currentStep > step.number && (
                  <CheckCircle className="w-5 h-5" />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProgressSidebar;
