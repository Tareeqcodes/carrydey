'use client';
import dynamic from 'next/dynamic';

const SimpleRouteMap = dynamic(() => import('./SimpleRouteMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-gray-900 rounded-2xl flex items-center justify-center animate-pulse">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4"></div>
        <div className="h-5 bg-gray-700 rounded w-40 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-800 rounded w-32 mx-auto"></div>
      </div>
    </div> 
  )
});

export default function RouteMapPreview({ pickup, dropoff }) {
  return (
    <div className="h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
      <SimpleRouteMap pickup={pickup} dropoff={dropoff} />
    </div>
  );
}