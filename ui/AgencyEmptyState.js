import React from 'react';

const AgencyEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <div className="text-6xl mb-4">😕</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No agencies available</h3>
      <p className="text-gray-600 mb-6">We're checking again or you can adjust distance</p>
      <button className="bg-[#3A0A21] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#4a0a2a] transition-colors">
        Increase search radius
      </button>
    </div>
  );
};

export default AgencyEmptyState;