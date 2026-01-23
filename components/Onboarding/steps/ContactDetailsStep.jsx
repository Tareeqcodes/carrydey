 import React from 'react';
import { UserPlus, Mail, Phone } from 'lucide-react';
import Input from '../Shared/Input';

const ContactDetailsStep = ({ formData, errors, onInputChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-gray-600">Primary contact information for your organization</h2>
        
      </div>

      <div className="space-y-4">
        <Input
          label="Contact Name"
          value={formData.contactPerson}
          onChange={(e) => onInputChange('contactPerson', e.target.value)}
          placeholder="Full name of contact person"
          icon={UserPlus}
          error={errors.contactPerson}
          required
        />

        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          placeholder="contact@company.com"
          icon={Mail}
          error={errors.email}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Primary Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
            placeholder="+2349124498160"
            icon={Phone}
            error={errors.phone}
            required
          />

          <Input
            label="Alternate Phone (Optional)"
            type="tel"
            value={formData.alternatePhone}
            onChange={(e) => onInputChange('alternatePhone', e.target.value)}
            placeholder="+2349124498160"
            icon={Phone}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsStep;