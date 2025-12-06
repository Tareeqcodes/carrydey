'use client';
import { Info, X, Clock, Navigation, DollarSign } from 'lucide-react';

function FareCalculationBottomSheet({ isOpen, onClose, routeData }) {
  const calculateFareBreakdown = () => {
    const baseFare = Math.round(routeData.estimatedFare * 0.4); // 40%
    const distanceFare = Math.round(routeData.estimatedFare * 0.3); // 30%
    const timeFare = Math.round(routeData.estimatedFare * 0.2); // 20%
    const serviceFee = Math.round(routeData.estimatedFare * 0.1); // 10%

    return { baseFare, distanceFare, timeFare, serviceFee };
  };

  const breakdown = calculateFareBreakdown();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0  bg-black bg-opacity-50 z-50 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-8 md:px-20 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#3A0A21]">
                Fare Breakdown
              </h2>
              <p className="text-sm text-gray-600">
                How your fare is calculated
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] px-8 md:px-20 overflow-y-auto">
          {/* Fare Breakdown Items */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-lg text-[#3A0A21]">
              Cost Breakdown
            </h3>

            <div className="space-y-3">
              {/* Base Fare */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#3A0A21] bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                    <DollarSign size={20} className="text-[#3A0A21]" />
                  </div>
                  <div>
                    <p className="font-medium">Base Fare</p>
                    <p className="text-xs text-gray-600">
                      Minimum delivery charge
                    </p>
                  </div>
                </div>
                <p className="font-semibold">₦{breakdown.baseFare}</p>
              </div>

              {/* Distance Charge */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Navigation size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Distance Charge</p>
                    <p className="text-xs text-gray-600">
                      {routeData.distance} km × ₦150/km
                    </p>
                  </div>
                </div>
                <p className="font-semibold">₦{breakdown.distanceFare}</p>
              </div>

              {/* Time Charge */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Clock size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Time Charge</p>
                    <p className="text-xs text-gray-600">
                      {routeData.duration} min × ₦20/min
                    </p>
                  </div>
                </div>
                <p className="font-semibold">₦{breakdown.timeFare}</p>
              </div>

              {/* Service Fee */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Info size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Service Fee</p>
                    <p className="text-xs text-gray-600">Platform & support</p>
                  </div>
                </div>
                <p className="font-semibold">₦{breakdown.serviceFee}</p>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-gray-300">
              <div className="flex justify-between items-center">
                <p className="font-bold text-lg">Total Fare</p>
                <p className="font-bold text-lg text-[#3A0A21]">
                  ₦{routeData.estimatedFare}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Factors */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">
              What affects the fare?
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-orange-600 font-bold text-sm">🚗</span>
                </div>
                <p className="text-sm font-medium mb-1">Traffic</p>
                <p className="text-xs text-gray-600">
                  Heavy traffic = higher fare
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-red-600 font-bold text-sm">⏰</span>
                </div>
                <p className="text-sm font-medium mb-1">Demand</p>
                <p className="text-xs text-gray-600">
                  Peak hours = higher demand
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-bold text-sm">🌧️</span>
                </div>
                <p className="text-sm font-medium mb-1">Weather</p>
                <p className="text-xs text-gray-600">
                  Bad weather = adjusted fare
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-green-600 font-bold text-sm">📏</span>
                </div>
                <p className="text-sm font-medium mb-1">Distance</p>
                <p className="text-xs text-gray-600">
                  Longer trips = higher fare
                </p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-start">
              <Info
                size={20}
                className="text-blue-500 mr-3 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="font-medium text-blue-800 mb-1">
                  Important Notes
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• This fare is guaranteed for the next 5 minutes</li>
                  <li>• No surge pricing will be applied</li>
                  <li>• Final fare may vary by ±5% based on exact route</li>
                  <li>• Toll fees (if any) are included in the fare</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="p-6 md:mx-20 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#3A0A21] text-white font-semibold rounded-lg hover:bg-[#4A0A31] transition active:scale-[0.98]"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </>
  );
}

export default FareCalculationBottomSheet;
