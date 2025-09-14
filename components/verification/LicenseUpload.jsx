'use client';
import { motion } from "framer-motion";
import { useRef } from 'react';
import { CloudDownload, CheckCircle, ChevronRight } from 'lucide-react';

export function LicenseUpload({ 
  uploadedFile, 
  onFileUpload, 
  isLoading, 
  error, 
  onNext 
}) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      onFileUpload(file);
    }
  };

  return (
    <motion.div 
      className="max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
            Upload License
          </h1>
          <p className="text-gray-500 leading-relaxed">
            Please provide a clear photo of your valid driver's license or government-issued identification.
          </p>
        </div>
        
        <motion.div
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all mb-6 ${
            uploadedFile 
              ? 'border-gray-300 bg-gray-50' 
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !isLoading && fileInputRef.current?.click()}
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
        >
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-12 h-12 mx-auto mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900"></div>
              </div>
              <h3 className="font-medium text-gray-700 text-sm tracking-wide uppercase">Processing...</h3>
            </motion.div>
          ) : uploadedFile ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-700" />
              <h3 className="font-medium text-gray-700 mb-1 text-sm tracking-wide uppercase">Upload Complete</h3>
              <p className="text-sm text-gray-500">{uploadedFile.name}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CloudDownload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="font-medium text-gray-700 mb-1 text-sm tracking-wide uppercase">Select Document</h3>
              <p className="text-sm text-gray-500">JPEG, PNG up to 10MB</p>
            </motion.div>
          )}
        </motion.div>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files[0])}
          disabled={isLoading}
        />
        
        {error && (
          <motion.div 
            className="bg-gray-50 border border-gray-200 p-4 rounded-2xl mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-gray-700 font-medium">Error: {error}</p>
          </motion.div>
        )}
        
        <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl mb-8">
          <p className="text-sm text-gray-600 font-medium text-center">
            Ensure all text is clearly visible and well-lit
          </p>
        </div>
        
        <button
          onClick={onNext}
          disabled={!uploadedFile || isLoading}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-medium text-sm tracking-wide uppercase hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}