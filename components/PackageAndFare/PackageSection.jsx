'use client';
import { AlertCircle } from 'lucide-react';

const packageSizes = [
  {
    id: 'small',
    label: 'Small',
    description: 'Fits in a backpack',
    icon: '📦',
    examples: 'Documents, phone, keys',
  },
  {
    id: 'medium',
    label: 'Medium',
    description: 'Fits in a large bag',
    icon: '📫',
    examples: 'Clothes, shoes, books',
  },
  {
    id: 'large',
    label: 'Large',
    description: 'Requires car trunk',
    icon: '📮',
    examples: 'Electronics, multiple items',
  },
];


export default function PackageSection({
  packageDetails,
  onPackageDetailChange,

}) {
  return (
    <section className="space-y-4 bg-white p-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-semibold text-gray-900">Package Size</h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {packageSizes.map((size) => (
          <label
            key={size.id}
            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
              packageDetails.size === size.id
                ? 'border-[#3A0A21] bg-[#3A0A21]/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="packageSize"
              value={size.id}
              checked={packageDetails.size === size.id}
              onChange={() => onPackageDetailChange('size', size.id)}
              className="mt-1 mr-3 text-[#3A0A21] focus:ring-[#3A0A21]"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{size.icon}</span>
                <p className="font-semibold text-gray-900">{size.label}</p>
              </div>
              <p className="text-sm text-gray-600 mb-1">{size.description}</p>
              <p className="text-xs text-gray-500">e.g., {size.examples}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="font-semibold mb-3 text-gray-900">
          What are you sending?{' '}
          <span className="text-gray-500 font-normal">(Optional)</span>
        </h3>
        <textarea
          value={packageDetails.description}
          onChange={(e) => onPackageDetailChange('description', e.target.value)}
          placeholder="e.g., Birthday gift, documents, laptop..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent outline-none resize-none"
          rows="3"
        />
        <p className="text-xs text-gray-500 mt-2">
          This helps couriers understand what they're carrying
        </p>
      </div>

      {/* Fragile Toggle */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">
                Fragile / Handle with care
              </p>
              <p className="text-sm text-gray-500">
                Item requires extra careful handling
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              onPackageDetailChange('isFragile', !packageDetails.isFragile)
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              packageDetails.isFragile ? 'bg-[#3A0A21]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                packageDetails.isFragile ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
