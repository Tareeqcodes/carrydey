'use client';
import dynamic from 'next/dynamic';

// Dynamically import SimpleRouteMap to avoid SSR issues
const SimpleRouteMap = dynamic(() => import('./SimpleRouteMap'), {
  ssr: false,
  loading: () => (
    <div className="h-80 bg-gray-100 rounded-xl flex items-center justify-center animate-pulse">
      <div className="text-center">
        <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-40 mx-auto"></div>
      </div>
    </div>
  )
});

export default function RouteMapPreview({ pickup, dropoff }) {
  return (
    <div className="h-96 rounded-xl overflow-hidden shadow-lg border border-gray-300">
      <SimpleRouteMap pickup={pickup} dropoff={dropoff} />
    </div>
  );
}