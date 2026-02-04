import React from 'react'


const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-xl" />
        <div className="h-5 w-32 bg-gray-200 rounded-lg" />
      </div>
      <div className="h-9 w-24 bg-gray-200 rounded-lg" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-6 w-full bg-gray-200 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

const SkeletonStats = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-pulse">
    <div className="h-6 w-32 bg-gray-200 rounded-lg mb-6" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-4 sm:p-6 bg-gray-50 rounded-xl space-y-2">
          <div className="h-8 w-16 bg-gray-200 rounded mx-auto" />
          <div className="h-4 w-20 bg-gray-200 rounded mx-auto" />
        </div>
      ))}
    </div>
  </div>
);

export default function AgencySettingLoading() {
  return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-6">
        {/* Skeleton for Booking Link */}
        <div className="bg-gradient-to-br from-[#3A0A21] via-[#4A0A31] to-[#5A1A41] rounded-2xl p-6 sm:p-8 shadow-2xl animate-pulse">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-white/20 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-6 w-40 bg-white/20 rounded" />
              <div className="h-4 w-64 bg-white/10 rounded" />
            </div>
          </div>
          <div className="h-12 w-full bg-white/20 rounded-xl" />
        </div>

        {/* Skeleton for Availability */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-2">
              <div className="h-5 w-48 bg-gray-200 rounded" />
              <div className="h-3 w-64 bg-gray-200 rounded" />
            </div>
            <div className="w-14 h-8 bg-gray-200 rounded-full" />
          </div>
        </div>

        <SkeletonCard />
        <SkeletonStats />
      </div>
    );
}
