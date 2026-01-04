import React from 'react';

const AgencyLoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-gray-100 rounded-2xl p-4 animate-pulse">
          <div className="flex gap-3 mb-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-24 mb-2" />
              <div className="h-3 bg-gray-300 rounded w-32" />
            </div>
            <div className="h-6 bg-gray-300 rounded w-20" />
          </div>
          <div className="h-3 bg-gray-300 rounded w-full mb-2" />
          <div className="h-10 bg-gray-300 rounded-lg w-full" />
        </div>
      ))}
    </div>
  );
};

export default AgencyLoadingSkeleton;