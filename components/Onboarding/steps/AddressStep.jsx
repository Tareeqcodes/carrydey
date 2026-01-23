'use client';
import { useState } from 'react';
import { MapPin, Plus, X } from 'lucide-react';
import Input from '../Shared/Input';

const AddressStep = ({ formData, errors, onInputChange }) => {
  const [newCity, setNewCity] = useState('');

  const commonCities = ['Lagos', 'Abuja', 'Kano', 'Kaduna'];

  const handleAddCity = (city) => {
    if (!formData.serviceCities?.includes(city)) {
      const updatedCities = [...(formData.serviceCities || []), city];
      onInputChange('serviceCities', updatedCities);
    }
  };

  const handleRemoveCity = (city) => {
    const updatedCities =
      formData.serviceCities?.filter((c) => c !== city) || [];
    onInputChange('serviceCities', updatedCities);
  };

  const handleCustomCity = () => {
    if (newCity.trim() && !formData.serviceCities?.includes(newCity.trim())) {
      const updatedCities = [...(formData.serviceCities || []), newCity.trim()];
      onInputChange('serviceCities', updatedCities);
      setNewCity('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xs font-semibold text-gray-600 mb-2">
          Primary business location for official correspondence
        </h2>
      </div>

      <div className="space-y-4">
        <Input
          label="Street Address"
          value={formData.street}
          onChange={(e) => onInputChange('street', e.target.value)}
          placeholder="123 Business Street"
          error={errors['street']}
          required
        />
      </div>

      {/* Service Cities Section */}
      <div className="pt-6 border-t border-gray-200">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-600 mb-2">
            Select all cities where you provide delivery services
          </h3>
          
        </div>

        {/* Common Cities Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {commonCities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => {
                if (formData.serviceCities?.includes(city)) {
                  handleRemoveCity(city);
                } else {
                  handleAddCity(city);
                }
              }}
              className={`p-2 border rounded-xl flex items-center justify-center gap-2 transition-all ${
                formData.serviceCities?.includes(city)
                  ? 'border-[#3A0A21] bg-[#3A0A21] text-white bg-opacity-5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div
                className={`p-1 rounded ${
                  formData.serviceCities?.includes(city)
                    ? 'bg-[#3A0A21] text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <MapPin className="w-3 h-3" />
              </div>
              <span className="text-xs">{city}</span>
            </button>
          ))}
        </div>

        {/* Custom City Input */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700">
            Add Custom City
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder="e.g., Calabar, Warri, etc."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCustomCity();
                }
              }}
            />
            <button
              type="button"
              onClick={handleCustomCity}
              disabled={!newCity.trim()}
              className="px-4 py-2 bg-[#3A0A21] text-white rounded-xl hover:bg-[#2A0718] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>

        {/* Selected Cities Display */}
        {formData.serviceCities?.length > 0 && (
          <div className="mt-4">
           
            <div className="flex flex-wrap gap-2">
              {formData.serviceCities.map((city, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-[#3A0A21] bg-opacity-10 text-white rounded-lg text-sm"
                >
                  <MapPin className="w-3 h-3" />
                  {city}
                  <button
                    type="button"
                    onClick={() => handleRemoveCity(city)}
                    className="ml-1 hover:bg-[#3A0A21] hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {errors.serviceCities && (
          <p className="mt-2 text-sm text-red-600">{errors.serviceCities}</p>
        )}
      </div>
    </div>
  );
};

export default AddressStep;
