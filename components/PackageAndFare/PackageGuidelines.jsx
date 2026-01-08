'use client';
import { Info, Shield, Package, Clock } from 'lucide-react';

export default function PackageGuidelines() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-2">
        <Info className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Package Guidelines</h2>
      </div>

      <div className="space-y-4">
        {/* Main Guidelines Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="font-semibold mb-4 text-blue-900 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Safety & Requirements
          </h3>
          <ul className="space-y-3">
            {[
              {
                icon: '📏',
                title: 'Size & Weight Limits',
                description: 'Maximum 15 kg weight, dimensions should not exceed 60x40x40 cm'
              },
              {
                icon: '💰',
                title: 'Value Limit',
                description: 'Maximum item value: ₦50,000. Higher values require additional verification'
              },
              {
                icon: '📦',
                title: 'Packaging Requirements',
                description: 'Must be securely sealed, labeled, and ready for pickup'
              },
              {
                icon: '🚫',
                title: 'Prohibited Items',
                description: 'No weapons, drugs, hazardous materials, or illegal items'
              }
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-xl mr-3">{item.icon}</span>
                <div>
                  <p className="font-medium text-blue-900">{item.title}</p>
                  <p className="text-sm text-blue-800">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <h3 className="font-semibold mb-4 text-green-900 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Best Practices
          </h3>
          <ul className="space-y-3 text-sm text-green-800">
            {[
              'Use bubble wrap or padding for fragile items',
              'Take a photo of your package before pickup',
              'Ensure recipient contact information is correct',
              'Be available for pickup at the scheduled time',
              'Communicate any special instructions in the description'
            ].map((tip, index) => (
              <li key={index} className="flex items-start">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div> */}

        
      
      </div>
    </section>
  );
}