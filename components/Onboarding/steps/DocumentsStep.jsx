import React from 'react';
import FileUpload from '../Shared/FileUpload';

const DocumentsStep = ({ formData, errors, onFileUpload }) => {
  const documentTypes = [
    {
      id: 'registrationCertificate',
      label: 'Business Registration Certificate',
      description: 'Official document proving business registration',
      error: errors.registrationCertificate
    },
    {
      id: 'taxCertificate',
      label: 'Tax Registration Certificate',
      description: 'Document showing tax registration number',
      error: errors.taxCertificate
    },
    {
      id: 'ownerNiN',
      label: 'Owner/Director ID (Optional)',
      description: 'Government-issued ID of owner/director'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Required Documents</h2>
        <p className="text-gray-600 mt-2">Upload necessary documents for verification</p>
        <p className="text-sm text-gray-500 mt-1">
          Max file size: 5MB each. Supported formats: PDF, JPG, PNG
        </p>
      </div>

      <div className="space-y-4">
        {documentTypes.map((doc) => (
          <div key={doc.id} className="border border-gray-300 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <FileUpload
                  label={doc.label}
                  description={doc.description}
                  value={formData[doc.id]} 
                  onChange={(file) => onFileUpload(doc.id, file)}
                  error={doc.error}
                  required={doc.id === 'registrationCertificate' || doc.id === 'taxCertificate'}
                  className="mb-0"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsStep;