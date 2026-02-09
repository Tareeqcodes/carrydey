'use client';
import { Clock, Shield } from 'lucide-react';

export default function PickupOptions({
  packageDetails,
  onPackageDetailChange,
}) {
  return (
    <section className="space-y-4 bg-white p-4">
      {/* Pickup Time */}
      <div className="">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[#3A0A21]" />
          <h3 className="font-semibold text-gray-900">Pickup Time</h3>
        </div>

        <div className="space-y-3">
          {/* ASAP Option */}
          <label
            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
              packageDetails.pickupTime === 'courier'
                ? 'border-[#3A0A21] bg-[#3A0A21]/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="pickupTime"
              value="courier"
              checked={packageDetails.pickupTime === 'courier'}
              onChange={() => onPackageDetailChange('pickupTime', 'courier')}
              className="mt-0.5 mr-3 text-[#3A0A21] focus:ring-[#3A0A21]"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">ASAP Delivery</p>
                 
                </div>
                <div className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Recommended
                </div>
              </div>
              <div className="mt-3 bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">Faster matching:</span>{' '}
                  Available couriers can accept your delivery immediately
                </p>
              </div>
            </div>
          </label>

          {/* Schedule Option */}
          <label
            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
              packageDetails.pickupTime === 'schedule'
                ? 'border-[#3A0A21] bg-[#3A0A21]/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="pickupTime"
              value="schedule"
              checked={packageDetails.pickupTime === 'schedule'}
              onChange={() => onPackageDetailChange('pickupTime', 'schedule')}
              className="mt-0.5 mr-3 text-[#3A0A21] focus:ring-[#3A0A21]"
            />
            <div>
              <p className="font-semibold text-gray-900">Schedule for Later</p>
              <p className="text-sm text-gray-500 mt-1">
                Choose specific pickup date & time
              </p>
            </div>
          </label>

          {/* Time Selector (Conditional) */}
          {packageDetails.pickupTime === 'schedule' && (
            <div className="ml-7 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent">
                    <option>9:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>12:00 PM</option>
                    <option>1:00 PM</option>
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                    <option>4:00 PM</option>
                    <option>5:00 PM</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PIN Confirmation */}
      {/* <div className="">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#3A0A21] mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">PIN Confirmation</p>
              <p className="text-sm text-gray-500 max-w-md">
                Recipient must enter a 4-digit PIN to confirm delivery
              </p>
              <div className="mt-2 text-xs text-gray-600 space-y-1">
                <p className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Ensures delivery to the right person
                </p>
                <p className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Required for high-value items (₦10,000+)
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() =>
              onPackageDetailChange(
                'pinConfirmation',
                !packageDetails.pinConfirmation
              )
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              packageDetails.pinConfirmation ? 'bg-[#3A0A21]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                packageDetails.pinConfirmation
                  ? 'translate-x-6'
                  : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        
        {packageDetails.pinConfirmation && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-2">
              Your 4-digit PIN will be generated after confirmation
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((digit) => (
                  <div
                    key={digit}
                    className="h-12 bg-white border-2 border-blue-300 rounded-lg flex items-center justify-center"
                  >
                    <span className="text-xl font-bold text-blue-900">•</span>
                  </div>
                ))}
              </div>
              <button className="text-sm text-blue-700 font-semibold hover:underline">
                Regenerate
              </button>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              Share this PIN with your recipient only after traveler is matched
            </p>
          </div>
        )}
      </div> */}
    </section>
  );
}
