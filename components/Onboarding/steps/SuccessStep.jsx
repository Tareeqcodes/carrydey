import React from 'react';
import { CheckCircle } from 'lucide-react';
import Button from '../Shared/Button';

const SuccessStep = () => {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Profile Setup Complete!</h2>
      <p className="text-gray-600 max-w-md mx-auto mb-8">
        Your organization profile has been submitted successfully. Our team will review your application and you'll receive access to the dashboard within 24-48 hours.
      </p>
      
      <div className="bg-gray-50 rounded-xl p-6 max-w-lg mx-auto mb-8">
        <h3 className="font-medium text-gray-900 mb-4">Next Steps:</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-[#3A0A21] rounded-full flex items-center justify-center text-white text-sm">
              1
            </div>
            <span className="text-sm">Verification of submitted documents</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-[#3A0A21] rounded-full flex items-center justify-center text-white text-sm">
              2
            </div>
            <span className="text-sm">Background check (if required)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-[#3A0A21] rounded-full flex items-center justify-center text-white text-sm">
              3
            </div>
            <span className="text-sm">Dashboard access email sent</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          onClick={() => window.location.reload()}
          className="px-8 py-3"
        >
          Go to Dashboard Login
        </Button>
        <p className="text-sm text-gray-500">
          Need help? Contact our support team at support@carrydey.tech
        </p>
      </div>
    </div>
  );
};

export default SuccessStep;