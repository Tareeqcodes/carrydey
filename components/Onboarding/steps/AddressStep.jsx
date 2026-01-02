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
          value={formData.street} // Changed from formData.address.street
          onChange={(e) => onInputChange('street', e.target.value)} // Changed from 'address.street'
          placeholder="123 Business Street"
          error={errors['street']} // Changed from errors['address.street']
          required
        />
        

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="City"
            value={formData.city}
            onChange={(e) => onInputChange('city', e.target.value)}
            placeholder="New York"
            error={errors['city']}
            required
          />

          <Input
            label="State / Province"
            value={formData.state}
            onChange={(e) => onInputChange('state', e.target.value)}
            placeholder="NY"
          />
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Postal Code"
            value={formData.postalCode}
            onChange={(e) => onInputChange('postalCode', e.target.value)}
            placeholder="10001"
            error={errors['postalCode']}
            required
          />
        </div> */}
      </div>
    </div>
  );
};

export default AddressStep;