'use client';
import Input from '../Shared/Input';

const AddressStep = ({ formData, errors, onInputChange }) => {
  const serviceCitiesArray = formData.serviceCities
    ? formData.serviceCities
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '')
    : [];

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
        

        <Input
          label="Service Cities"
          value={formData.serviceCities}
          onChange={(e) => onInputChange('serviceCities', e.target.value)}
          placeholder="e.g., Lagos, Abuja, Kano, Kaduna"
          error={errors['serviceCities']}
          required
        />
        {serviceCitiesArray.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {serviceCitiesArray.map((city, index) => (
              <span
                key={index}
                className="text-xs bg-white text-gray-700 shadow-xl border px-3 py-1.5 rounded font-medium"
              >
                {city}
              </span>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2">
          Separate multiple cities with commas
        </p>
      </div>
    </div>
  );
};

export default AddressStep;
