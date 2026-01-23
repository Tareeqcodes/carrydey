'use client';
import { useRouter } from 'next/navigation';
import { CheckCircle, Mail, Shield } from 'lucide-react';

const SuccessStep = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/home');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Success Icon */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900">
            Application Submitted
          </h1>
          <p className="text-gray-600 text-sm font-semibold leading-relaxed">
            We'll notify you once approved.
          </p>
        </div>

        <div className="pt-6 border-t border-gray-100 space-y-4">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Mail className="w-4 h-4" />
            <span className="text-sm">support@carrydey.tech</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Your data is secure</span>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <button
            onClick={handleBackToHome}
            className="w-full py-3 bg-[#3A0A21] text-white rounded-lg font-medium hover:bg-[#4A0A31] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessStep;
