
import { Building2, Globe, AlertCircle } from 'lucide-react';

const BasicInfoStep = ({ formData, errors, onInputChange }) => {
  const organizationTypes = [
    'Courier Service',
    'Logistics Company',
    'Freight Forwarder',
    'Delivery Agency',
    'E-commerce Logistics',
    'Same-day Delivery',
    'Medical Courier',
    'Food Delivery',
    'Other'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg md:text-2xl font-bold text-gray-900">Basic Organization Information</h2>
        <p className="text-gray-600 text-sm md:text-lg mt-2">Tell us about your logistics company</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization Name
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.organizationName}
              onChange={(e) => onInputChange('organizationName', e.target.value)}
              className={`pl-10 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent ${
                errors.organizationName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your company name"
            />
          </div>
          {errors.organizationName && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.organizationName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization Type
          </label>
          <select
            value={formData.organizationType}
            onChange={(e) => onInputChange('organizationType', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent ${
              errors.organizationType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select type</option>
            {organizationTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.organizationType && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.organizationType}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Number
            </label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => onInputChange('registrationNumber', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent ${
                errors.registrationNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., REG123456"
            />
            {errors.registrationNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.registrationNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year Established
            </label>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.yearEstablished}
              onChange={(e) => onInputChange('yearEstablished', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent ${
                errors.yearEstablished ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="YYYY"
            />
            {errors.yearEstablished && (
              <p className="mt-1 text-sm text-red-600">{errors.yearEstablished}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website (Optional)
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="url"
              value={formData.website}
              onChange={(e) => onInputChange('website', e.target.value)}
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent"
              placeholder="https://yourcompany.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;