'use client'
import { useRef } from 'react';
import { CloudDownload, CheckCircle, ChevronRight } from 'lucide-react';

const LicenseUpload = ({ 
  uploadedFile, 
  onFileUpload, 
  isLoading, 
  error, 
  onNext 
}) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
      }
      
      onFileUpload(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Upload Driver's License
        </h1>
        <p className="text-gray-600">
          Please upload a clear photo of your valid driver's license or government-issued ID
        </p>
      </div>
      
      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all mb-4 ${
          uploadedFile 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-300 hover:border-orange-600 hover:bg-orange-50'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        {isLoading ? (
          <>
            <div className="w-12 h-12 mx-auto mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
            <h3 className="font-semibold text-orange-600 mb-1">Uploading...</h3>
          </>
        ) : uploadedFile ? (
          <>
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <h3 className="font-semibold text-green-600 mb-1">License uploaded successfully</h3>
            <p className="text-sm text-gray-600">{uploadedFile.name}</p>
          </>
        ) : (
          <>
            <CloudDownload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-semibold mb-1">Tap to upload photo</h3>
            <p className="text-sm text-gray-600">JPEG, PNG up to 10MB</p>
          </>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files[0])}
        disabled={isLoading}
      />
      
      {error && (
        <div className="bg-red-50 p-3 rounded-lg mb-4">
          <p className="text-sm text-red-700 font-medium">Error: {error}</p>
        </div>
      )}
      
      <div className="bg-blue-50 p-3 rounded-lg mb-6">
        <p className="text-sm text-blue-700 font-medium">
          💡 Tip: Ensure all text is clearly visible and the image is well-lit
        </p>
      </div>
      
      <button
        onClick={onNext}
        disabled={!uploadedFile || isLoading}
        className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        Continue
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default LicenseUpload;
