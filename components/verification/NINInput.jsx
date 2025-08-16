'use client'
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const NINInput = ({ nin, onNINChange, onNext }) => {
  const [localNIN, setLocalNIN] = useState(nin || '');
  
  const handleNINChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setLocalNIN(value);
    onNINChange(value);
  };

  const isValid = localNIN.length === 11;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="text-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          National Identification Number
        </h1>
        <p className="text-gray-600 text-sm">
          Enter your 11-digit NIN to verify your identity
        </p>
      </div>
      
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          NIN Number
        </label>
        <input
          type="text"
          value={localNIN}
          onChange={handleNINChange}
          placeholder="Enter your 11-digit NIN"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          maxLength={11}
        />
        {/* <div className="mt-1 text-xs text-gray-500">
          {localNIN.length}/11 digits
        </div> */}
      </div>
      
      <div className="bg-yellow-50 p-3 rounded-lg mb-6">
        <p className="text-sm text-yellow-800 font-medium">
          🔒 Your NIN is encrypted and stored securely. We use it only for identity verification.
        </p>
      </div>
      
      <button
        onClick={onNext}
        disabled={!isValid}
        className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        Continue
       <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default NINInput;