import React from 'react';

const SubmitVerification = ({ 
  verificationData, 
  onSubmit, 
  isLoading, 
  error 
}) => {
  const verificationItems = [
    {
      completed: !!verificationData.licenseFileId,
      text: "Driver's License uploaded"
    },
    {
      completed: verificationData.nin && verificationData.nin.length === 11,
      text: "NIN number provided"
    },
    {
      completed: verificationData.termsAccepted,
      text: "Terms accepted"
    }
  ];

  const allItemsCompleted = verificationItems.every(item => item.completed);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="text-center mb-6">
        <svg width="64" height="64" className="mx-auto mb-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Ready to Submit</h1>
        <p className="text-gray-600">Review your information and submit for verification</p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-5">
        <h4 className="font-semibold text-gray-800 mb-3">Verification Summary</h4>
        <div className="space-y-2">
          {verificationItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <svg 
                width="16" 
                height="16" 
                className={item.completed ? "text-green-500" : "text-gray-300"} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
              <span className={`text-sm ${item.completed ? "text-gray-700" : "text-gray-400"}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-red-700 font-medium">Error: {error}</p>
        </div>
      )}
      
      <div className="bg-orange-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-orange-600 mb-2">What happens next?</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Our team will review your documents</li>
          <li>• You'll receive an email with the verification status</li>
          <li>• Verification typically takes 12-24 hours</li>
          <li>• Once approved, you can start accepting deliveries</li>
        </ul>
      </div>
      
      <button
        onClick={onSubmit}
        disabled={!allItemsCompleted || isLoading}
        className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Submitting...
          </>
        ) : (
          <>
            Submit for Review
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </>
        )}
      </button>
    </div>
  );
};

export default SubmitVerification;