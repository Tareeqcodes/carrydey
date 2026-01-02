'use client';
import { useState } from 'react';
import { Building2, Truck, CheckCircle, X, Plus } from 'lucide-react';

const BusinessDetailsStep = ({
  formData,
  errors,
  onInputChange,
  onServiceToggle,
}) => {
  const [newVehicleType, setNewVehicleType] = useState('');

  const businessTypes = [
    { value: 'partnership', label: 'Partnership' },
    { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
  ];

  const serviceOptions = [
    'Express Delivery',
    'Same-day Delivery',
    'Next-day Delivery',
    'Freight Services',
    'Warehousing',
    'Cold Chain',
    'Medical Transport',
    'International Shipping',
    'Last-mile Delivery',
    'Bulk Cargo',
  ];

  const commonVehicleTypes = [
    'Car/Van',
    'Motorcycle/Bike',
    'Truck',
    'Pickup Truck',
    'SUV',
    'Minivan',
    'Cargo Van',
    'Box Truck',
  ];


  const handleAddVehicleType = (vehicleType) => {
    if (!formData.vehicleTypes?.includes(vehicleType)) {
      const updatedVehicleTypes = [
        ...(formData.vehicleTypes || []),
        vehicleType,
      ];
      onInputChange('vehicleTypes', updatedVehicleTypes);
    }
  };

  const handleRemoveVehicleType = (vehicleType) => {
    const updatedVehicleTypes =
      formData.vehicleTypes?.filter((vt) => vt !== vehicleType) || [];
    onInputChange('vehicleTypes', updatedVehicleTypes);
  };

  const handleCustomVehicleType = () => {
    if (
      newVehicleType.trim() &&
      !formData.vehicleTypes?.includes(newVehicleType.trim())
    ) {
      const updatedVehicleTypes = [
        ...(formData.vehicleTypes || []),
        newVehicleType.trim(),
      ];
      onInputChange('vehicleTypes', updatedVehicleTypes);
      setNewVehicleType('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Business Details
        </h2>
        <p className="text-gray-600 mt-2">Tell us more about your operations</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Business Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {businessTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => onInputChange('businessType', type.value)}
                className={`p-4 border rounded-xl text-left transition-all ${
                  formData.businessType === type.value
                    ? 'border-[#3A0A21] bg-[#3A0A21] bg-opacity-5 ring-2 ring-[#3A0A21] text-white/95 ring-opacity-20'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      formData.businessType === type.value
                        ? 'bg-[#3A0A21] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{type.label}</span>
                </div>
              </button>
            ))}
          </div>
          {errors.businessType && (
            <p className="mt-2 text-sm text-red-600">{errors.businessType}</p>
          )}
        </div>

        {/* Vehicle Types Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select all vehicle types in your fleet
          </label>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {commonVehicleTypes.map((vehicleType) => (
              <button
                key={vehicleType}
                type="button"
                onClick={() => {
                  if (formData.vehicleTypes?.includes(vehicleType)) {
                    handleRemoveVehicleType(vehicleType);
                  } else {
                    handleAddVehicleType(vehicleType);
                  }
                }}
                className={`p-2 border rounded-xl flex items-center justify-center gap-2 transition-all ${
                  formData.vehicleTypes?.includes(vehicleType)
                    ? 'border-[#3A0A21] bg-[#3A0A21] text-white/95 bg-opacity-5'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div
                  className={`p-1 rounded ${
                    formData.vehicleTypes?.includes(vehicleType)
                      ? 'bg-[#3A0A21] text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Truck className="w-3 h-3" />
                </div>
                <span className="text-xs">{vehicleType}</span>
              </button>
            ))}
          </div>

          {/* Custom vehicle type input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Add Custom Vehicle Type
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newVehicleType}
                onChange={(e) => setNewVehicleType(e.target.value)}
                placeholder="e.g., Electric Scooter, Bicycle, etc."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCustomVehicleType();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleCustomVehicleType}
                disabled={!newVehicleType.trim()}
                className="px-2 py-2 bg-[#3A0A21] text-white rounded-xl hover:bg-[#2A0718] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
               
              </button>
            </div>
          </div>

          {/* Selected vehicle types display */}
          {formData.vehicleTypes?.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected Vehicle Types ({formData.vehicleTypes.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.vehicleTypes.map((vehicleType, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-[#3A0A21] bg-opacity-10 text-white/95 rounded-b-lg text-sm"
                  >
                    {vehicleType}
                    <button
                      type="button"
                      onClick={() => handleRemoveVehicleType(vehicleType)}
                      className="ml-1 hover:bg-[#3A0A21] hover:bg-opacity-20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {errors.vehicleTypes && (
            <p className="mt-2 text-sm text-red-600">{errors.vehicleTypes}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Services Offered
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {serviceOptions.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => onServiceToggle(service)}
                className={`p-3 border rounded-xl flex items-center gap-3 transition-all ${
                  formData.services.includes(service)
                    ? 'border-[#3A0A21] bg-[#3A0A21] bg-opacity-5 text-white/95'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div
                  className={`p-1 rounded ${
                    formData.services.includes(service)
                      ? 'bg-[#3A0A21] text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm">{service}</span>
              </button>
            ))}
          </div>
          {errors.services && (
            <p className="mt-2 text-sm text-red-600">{errors.services}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsStep;
