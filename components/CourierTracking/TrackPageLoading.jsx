'use client';

const TrackPageLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="h-8 w-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
            <div className="h-10 w-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar Skeleton */}
        <aside className="hidden lg:block w-72 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6 pt-10">
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="relative">
                  <div className="h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl animate-pulse">
                    <div className="flex items-start gap-4 p-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-4 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2"></div>
                        <div className="h-3 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {/* Title Skeleton */}
          <div className="mb-8">
            <div className="h-7 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse mb-3"></div>
            <div className="h-4 w-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
          </div>

          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { from: 'from-blue-100', to: 'to-blue-200' },
              { from: 'from-emerald-100', to: 'to-emerald-200' },
              { from: 'from-purple-100', to: 'to-purple-200' }
            ].map((colors, i) => (
              <div key={i} className={`bg-gradient-to-br ${colors.from} ${colors.to} rounded-3xl p-6 border border-gray-200/50 animate-pulse`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-14 h-14 bg-white/60 rounded-2xl"></div>
                  <div className="text-right">
                    <div className="h-9 w-20 bg-white/60 rounded-lg"></div>
                  </div>
                </div>
                <div className="h-4 w-28 bg-white/60 rounded mb-2"></div>
                <div className="h-3 w-32 bg-white/60 rounded"></div>
              </div>
            ))}
          </div>

          {/* Content Cards Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="h-6 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                  <div className="h-5 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                </div>

                {/* Location Cards */}
                <div className="space-y-4 mb-6">
                  {/* Pickup Location */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-200/50 animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-white/60 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-3 w-24 bg-white/60 rounded mb-2"></div>
                        <div className="h-4 w-48 bg-white/60 rounded mb-3"></div>
                        <div className="h-10 bg-white/60 rounded-lg"></div>
                      </div>
                    </div>
                  </div>

                  {/* Route Line */}
                  <div className="flex items-center pl-6">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                  </div>

                  {/* Dropoff Location */}
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-4 border border-emerald-200/50 animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-white/60 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-3 w-24 bg-white/60 rounded mb-2"></div>
                        <div className="h-4 w-48 bg-white/60 rounded mb-3"></div>
                        <div className="h-10 bg-white/60 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Package Info */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="bg-gray-50 rounded-xl p-3 animate-pulse">
                      <div className="h-3 w-12 bg-gray-200 rounded mb-2 mx-auto"></div>
                      <div className="h-4 w-16 bg-gray-300 rounded mx-auto"></div>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="h-14 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse"></div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Modern Loading Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full mx-4 text-center shadow-2xl border border-gray-100">
          {/* Animated Logo/Spinner */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            {/* Outer ring */}
            <div className="absolute inset-0 border-[6px] border-gray-100 rounded-full"></div>
            <div className="absolute inset-0 border-[6px] border-transparent border-t-[#3A0A21] border-r-[#3A0A21] rounded-full animate-spin"></div>
            
            {/* Middle ring */}
            <div className="absolute inset-3 border-[6px] border-gray-50 rounded-full"></div>
            <div className="absolute inset-3 border-[6px] border-transparent border-t-[#5A0A31] border-l-[#5A0A31] rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
            
            {/* Inner dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-br from-[#3A0A21] to-[#5A0A31] rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Loading Dashboard
            </h3>
            <p className="text-gray-600 text-sm">
              Preparing your delivery information...
            </p>
          </div>

          {/* Animated Progress Bar */}
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-[#3A0A21] via-[#5A0A31] to-[#3A0A21] animate-shimmer" 
                 style={{
                   backgroundSize: '200% 100%',
                   animation: 'shimmer 2s infinite linear'
                 }}></div>
          </div>

          {/* Status Messages */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#3A0A21] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-[#3A0A21] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-[#3A0A21] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="animate-pulse">Fetching deliveries</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default TrackPageLoading;