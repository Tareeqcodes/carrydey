'use client';
import Header from "@/hooks/Header";

export default function page() { 
  return (
    <>
    <div className="p-5 pb-24">
      <Header title="Back to Dashboard" showBack />
         <div className="bg-white rounded-2xl p-5 mb-5 text-center">
          <div className="w-25 h-25 bg-gradient-to-r from-teal-500 to-green-400 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl">
            🚗
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">In Transit</h3>
          <p className="text-gray-600 mb-4">Your package is on its way to Abuja</p>
          <div className="bg-gray-100 rounded-xl p-4">
            <strong className="text-gray-900">Estimated Arrival: Today, 6:30 PM</strong>
          </div>
        </div>
    </div>
     </>
  )
}
