import React from 'react';

export default function VerificationCenter() {
  // const getStatusColor = (status) => {
  //   switch (status?.toLowerCase()) {
  //     case 'verified':
  //       return 'bg-green-100 text-green-800 border-green-200';
  //     case 'pending':
  //       return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  //     case 'rejected':
  //       return 'bg-red-100 text-red-800 border-red-200';
  //     default:
  //       return 'bg-gray-100 text-gray-800 border-gray-200';
  //   }
  // };

  // const getRoleColor = (role) => {
  //   switch (role?.toLowerCase()) {
  //     case 'admin':
  //       return 'bg-purple-100 text-purple-800 border-purple-200';
  //     case 'courier':
  //       return 'bg-blue-100 text-blue-800 border-blue-200';
  //     case 'user':
  //       return 'bg-indigo-100 text-indigo-800 border-indigo-200';
  //     default:
  //       return 'bg-gray-100 text-gray-800 border-gray-200';
  //   }
  // };

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

        {/* {!roleLoading && (
            <div className="flex flex-col items-end space-y-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(role)}`}>
                {role || "User"}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
                {status?.toUpperCase() || "PENDING"}
              </span>
            </div>
          )} */}

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
