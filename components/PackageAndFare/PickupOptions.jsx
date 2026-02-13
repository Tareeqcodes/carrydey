'use client';
import { Clock } from 'lucide-react';
import { useBrandColors } from '@/hooks/BrandColors';

export default function PickupOptions({
  packageDetails,
  onPackageDetailChange,
}) {
  const { brandColors } = useBrandColors();

  return (
    <section className="space-y-4 bg-white p-4">
      {/* Pickup Time */}
      <div className="">
        <div className="flex items-center gap-2 mb-4">
          <Clock 
            className="w-5 h-5" 
            style={{ color: brandColors.primary }}
          />
          <h3 className="font-semibold text-gray-900">Pickup Time</h3>
        </div>

        <div className="space-y-3">
          {/* ASAP Option */}
          <label
            className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all"
            style={
              packageDetails.pickupTime === 'courier'
                ? {
                    borderColor: brandColors.primary,
                    backgroundColor: `${brandColors.primary}0D`,
                  }
                : {
                    borderColor: '#e5e7eb',
                  }
            }
            onMouseEnter={(e) => {
              if (packageDetails.pickupTime !== 'courier') {
                e.currentTarget.style.borderColor = '#d1d5db';
              }
            }}
            onMouseLeave={(e) => {
              if (packageDetails.pickupTime !== 'courier') {
                e.currentTarget.style.borderColor = '#e5e7eb';
              }
            }}
          >
            <input
              type="radio"
              name="pickupTime"
              value="courier"
              checked={packageDetails.pickupTime === 'courier'}
              onChange={() => onPackageDetailChange('pickupTime', 'courier')}
              className="mt-0.5 mr-3"
              style={{
                accentColor: brandColors.primary,
              }}
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
            className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all"
            style={
              packageDetails.pickupTime === 'schedule'
                ? {
                    borderColor: brandColors.primary,
                    backgroundColor: `${brandColors.primary}0D`,
                  }
                : {
                    borderColor: '#e5e7eb',
                  }
            }
            onMouseEnter={(e) => {
              if (packageDetails.pickupTime !== 'schedule') {
                e.currentTarget.style.borderColor = '#d1d5db';
              }
            }}
            onMouseLeave={(e) => {
              if (packageDetails.pickupTime !== 'schedule') {
                e.currentTarget.style.borderColor = '#e5e7eb';
              }
            }}
          >
            <input
              type="radio"
              name="pickupTime"
              value="schedule"
              checked={packageDetails.pickupTime === 'schedule'}
              onChange={() => onPackageDetailChange('pickupTime', 'schedule')}
              className="mt-0.5 mr-3"
              style={{
                accentColor: brandColors.primary,
              }}
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
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none transition-all"
                    onFocus={(e) => {
                      e.target.style.borderColor = brandColors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${brandColors.primary}10`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none transition-all"
                    onFocus={(e) => {
                      e.target.style.borderColor = brandColors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${brandColors.primary}10`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
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
    </section>
  );
}