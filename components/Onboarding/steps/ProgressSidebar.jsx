import React from 'react';
import { 
  Building2, Phone, MapPin, Users, Shield, CheckCircle 
} from 'lucide-react';

const ProgressSidebar = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Basic Information', icon: Building2 },
    { number: 2, title: 'Contact Details', icon: Phone },
    { number: 3, title: 'Address', icon: MapPin },
    { number: 4, title: 'Business Details', icon: Users },
    { number: 5, title: 'Account Setup', icon: Shield }
  ];

  return (
    <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
      <div className="sticky top-8 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  currentStep === step.number
                    ? 'bg-[#3A0A21] text-white'
                    : currentStep > step.number
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === step.number
                    ? 'bg-white text-[#3A0A21]'
                    : currentStep > step.number
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}> 
                  {currentStep > step.number ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs">{step.title}</p>
                </div>
                {currentStep > step.number && (
                  <CheckCircle className="w-5 h-5" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/90 border border-blue-200 rounded-2xl p-6">
          <h4 className="font-bold text-shadow-gray-500 mb-3">Need Help?</h4>
          <p className="text-xs font-semibold text-shadow-gray-500 mb-4">
            Our support team is here to assist you with the registration process.
          </p>
          <button className="w-full py-2 border border-blue-300 text-blue-700 rounded-xl text-sm hover:bg-blue-100 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressSidebar;