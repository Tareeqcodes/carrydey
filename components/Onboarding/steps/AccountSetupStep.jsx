import { FileText, Shield, CheckCircle } from 'lucide-react';

const AccountSetupStep = ({ formData, errors, onInputChange }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Review & Submit
        </h2>
        
      </div>

      {/* Agreement Section */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-[#3A0A21]" />

          <h3 className="text-lg font-semibold text-gray-900">
            Agreements & Policies
          </h3>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) =>
                  onInputChange('termsAccepted', e.target.checked)
                }
                className="mt-1 rounded border-gray-300 text-[#3A0A21] focus:ring-[#3A0A21]"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  Terms of Service Agreement
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  I have read and agree to the{' '}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3A0A21] hover:underline font-medium"
                  >
                    Terms of Service
                  </a>{' '}
                  which govern the use of this platform, including all
                  applicable policies and guidelines.
                </p>
                {errors.termsAccepted && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.termsAccepted}
                  </p>
                )}
              </div>
            </label>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.privacyPolicyAccepted}
                onChange={(e) =>
                  onInputChange('privacyPolicyAccepted', e.target.checked)
                }
                className="mt-1 rounded border-gray-300 text-[#3A0A21] focus:ring-[#3A0A21]"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Privacy Policy</p>
                <p className="text-sm text-gray-600 mt-1">
                  I acknowledge that I have read and understood the{' '}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3A0A21] hover:underline font-medium"
                  >
                    Privacy Policy
                  </a>{' '}
                  and consent to the collection, use, and disclosure of my
                  personal information as described therein.
                </p>
                {errors.privacyPolicyAccepted && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.privacyPolicyAccepted}
                  </p>
                )}
              </div>
            </label>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.dataProcessingAgreement}
                onChange={(e) =>
                  onInputChange('dataProcessingAgreement', e.target.checked)
                }
                className="mt-1 rounded border-gray-300 text-[#3A0A21] focus:ring-[#3A0A21]"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  Data Processing Agreement
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  I agree to the Data Processing Agreement for the handling of
                  business and operational data on this platform.
                </p>
              </div>
            </label>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.marketingEmails}
                onChange={(e) =>
                  onInputChange('marketingEmails', e.target.checked)
                }
                className="mt-1 rounded border-gray-300 text-[#3A0A21] focus:ring-[#3A0A21]"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  Marketing Communications (Optional)
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  I'd like to receive marketing emails about new features,
                  updates, industry insights, and promotional offers.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div>
              <p className="text-xs text-[#3A0A21]">
                <span className="font-bold text-lg">Important:</span> By
                submitting this application, you certify that all information
                provided is accurate and complete. Falsification of information
                may result in termination of services. You will receive a
                confirmation email once your application is processed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estimated Processing Time */}
      <div className="text-center">
    
        <p className="text-sm text-gray-400 mt-1">
          Please review all the information You will be notified via email within 24-48 hours.
        </p>
      </div>
    </div>
  );
};

export default AccountSetupStep;
