import React from 'react';

export default function VerificationCenter() {
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3A0A21]">Verification Center</h2>
      <div className="space-y-4">
        <div className="bg-[#F8F5F7] p-6 rounded-xl border border-[#E8DDE3]">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-4 h-4 bg-[#3A0A21] rounded-full"></div>
            <span className="text-[#3A0A21] font-semibold text-lg">
              Account Verified
            </span>
          </div>
          <p className="text-gray-600">
            Your account has been successfully verified
          </p>
        </div>


        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Identity Verification
          </h3>
          <p className="text-gray-600 mb-4">Upload your government-issued ID</p>
          <button className="bg-[#3A0A21] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#4A1A31] transition-colors">
            Upload Document
          </button>
        </div>
      </div>
    </div>
  );
}
