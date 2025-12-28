import React from 'react';
import Input from '../Shared/Input';

const AddressStep = ({ formData, errors, onInputChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Business Address</h2>
        <p className="text-gray-600 text-sm md:text-lg mt-2">Primary business location for official correspondence</p>
      </div>

      <div className="space-y-4">
        <Input
          label="Street Address"
          value={formData.address.street}
          onChange={(e) => onInputChange('address.street', e.target.value)}
          placeholder="123 Business Street"
          error={errors['address.street']}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="City"
            value={formData.address.city}
            onChange={(e) => onInputChange('address.city', e.target.value)}
            placeholder="New York"
            error={errors['address.city']}
            required
          />

          <Input
            label="State / Province"
            value={formData.address.state}
            onChange={(e) => onInputChange('address.state', e.target.value)}
            placeholder="NY"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Postal Code"
            value={formData.address.postalCode}
            onChange={(e) => onInputChange('address.postalCode', e.target.value)}
            placeholder="10001"
            error={errors['address.postalCode']}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default AddressStep;