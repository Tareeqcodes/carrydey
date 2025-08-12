"use client";
import { useState, useRef } from 'react';

const TravelerDashboard = ({ role, name }) => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [screenHistory, setScreenHistory] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [verificationData, setVerificationData] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  const licenseInputRef = useRef(null);
  const selfieInputRef = useRef(null);

  const showScreen = (screenId) => {
    setScreenHistory(prev => [...prev, currentScreen]);
    setCurrentScreen(screenId);
  };

  const goBack = () => {
    if (screenHistory.length > 0) {
      const previousScreen = screenHistory[screenHistory.length - 1];
      setScreenHistory(prev => prev.slice(0, -1));
      setCurrentScreen(previousScreen);
    }
  };

  const handleFileUpload = (type, file) => {
    if (file) {
      setUploadedFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const validateNIN = (nin) => {
    const cleanNin = nin.replace(/\D/g, '');
    setVerificationData(prev => ({ ...prev, nin: cleanNin }));
    return cleanNin.length === 11;
  };

  const Header = ({ showBack = false }) => (
    <div className="flex items-center justify-between mb-8 pt-5">
      {showBack ? (
        <button
          onClick={goBack}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
      ) : (
        <div className="w-9"></div>
      )}
      <div className='flex-1 text-center'>
      <div className="text-3xl font-bold text-orange-600">Sendr</div>
        <p>Send Smarter.</p>
        <p>Travel Richer.</p>
      </div>
    
      <div className="w-9"></div>
    </div>
  );

  const ProgressBar = ({ step, totalSteps }) => (
    <div className="mb-8">
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div 
          className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full transition-all duration-500"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
      <div className="text-sm text-gray-500 text-center">Step {step} of {totalSteps}</div>
    </div>
  );

  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white px-6 py-5">
      <div className="max-w-md mx-auto">
        <Header />
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Sendr</h1>
            <p className="text-gray-600">Let's verify your identity before you can start delivering packages and earning money.</p>
          </div>
          
          <button
            onClick={() => showScreen('identity-verification')}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Start Verification
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const IdentityVerificationScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white px-6 py-5">
      <div className="max-w-md mx-auto">
        <Header showBack />
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="text-center mb-6">
            <svg width="64" height="64" className="mx-auto mb-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Verify Your Identity</h1>
            <p className="text-gray-600">To start delivering packages and earning money, we need to verify your identity. This helps keep our community safe and trusted.</p>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-orange-600 mb-2">What you'll need:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Valid driver's license or government ID</li>
              <li>• National Identification Number (NIN)</li>
              <li>• Live selfie photo</li>
              <li>• 5-10 minutes of your time</li>
            </ul>
          </div>
          
          <button
            onClick={() => showScreen('license-upload')}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Begin Verification
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const LicenseUploadScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white px-6 py-5">
      <div className="max-w-md mx-auto">
        <Header showBack />
        <ProgressBar step={1} totalSteps={5} />
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Upload Driver's License</h1>
            <p className="text-gray-600">Please upload a clear photo of your valid driver's license or government-issued ID</p>
          </div>
          
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all mb-4 ${
              uploadedFiles.license 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-orange-600 hover:bg-orange-50'
            }`}
            onClick={() => licenseInputRef.current?.click()}
          >
            {uploadedFiles.license ? (
              <>
                <svg className="w-12 h-12 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h3 className="font-semibold text-green-600 mb-1">License uploaded successfully</h3>
                <p className="text-sm text-gray-600">{uploadedFiles.license.name}</p>
              </>
            ) : (
              <>
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                <h3 className="font-semibold mb-1">Tap to upload photo</h3>
                <p className="text-sm text-gray-600">JPEG, PNG up to 10MB</p>
              </>
            )}
          </div>
          
          <input
            ref={licenseInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileUpload('license', e.target.files[0])}
          />
          
          <div className="bg-blue-50 p-3 rounded-lg mb-6">
            <p className="text-sm text-blue-700 font-medium">💡 Tip: Ensure all text is clearly visible and the image is well-lit</p>
          </div>
          
          <button
            onClick={() => showScreen('nin-input')}
            disabled={!uploadedFiles.license}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Continue
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const NINInputScreen = () => {
    const [NIN, setNIN] = useState('');
    
    const handleNINChange = (e) => {
      const value = e.target.value.replace(/\D/g, '').slice(0, 11);
      setNIN(value);
      validateNIN(value);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white px-6 py-5">
        <div className="max-w-md mx-auto">
          <Header showBack />
          <ProgressBar step={2} totalSteps={5} />
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">National Identification Number</h1>
              <p className="text-gray-600">Enter your 11-digit NIN to verify your identity</p>
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">NIN Number</label>
              <input
                type="text"
                value={NIN}
                onChange={handleNINChange}
                placeholder="Enter your 11-digit NIN"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
            
            <div className="bg-yellow-50 p-3 rounded-lg mb-6">
              <p className="text-sm text-yellow-800 font-medium">🔒 Your NIN is encrypted and stored securely. We use it only for identity verification.</p>
            </div>
            
            <button
              onClick={() => showScreen('selfie-capture')}
              disabled={NIN.length !== 11}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Continue
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // const SelfieScreen = () => {
  //   const [photoTaken, setPhotoTaken] = useState(false);

  //   const handleSelfieUpload = (file) => {
  //     handleFileUpload('selfie', file);
  //     setPhotoTaken(true);
  //   };

  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white px-6 py-5">
  //       <div className="max-w-md mx-auto">
  //         <Header showBack />
  //         <ProgressBar step={3} totalSteps={5} />
          
  //         <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
  //           <div className="text-center mb-6">
  //             <h1 className="text-2xl font-semibold text-gray-900 mb-2">Take a Live Selfie</h1>
  //             <p className="text-gray-600">We'll use this to match with your ID and verify it's really you</p>
  //           </div>
            
  //           <div className="bg-black rounded-xl mb-4 aspect-[3/4] flex items-center justify-center relative overflow-hidden">
  //             {photoTaken ? (
  //               <div className="flex flex-col items-center justify-center h-full text-green-400">
  //                 <svg width="64" height="64" fill="currentColor" viewBox="0 0 20 20" className="mb-4">
  //                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
  //                 </svg>
  //                 <p className="text-center font-semibold">Photo captured successfully!</p>
  //               </div>
  //             ) : (
  //               <div className="flex flex-col items-center justify-center h-full text-white">
  //                 <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mb-4">
  //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
  //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
  //                 </svg>
  //                 <p className="text-center mb-4">Camera will appear here</p>
  //                 <button 
  //                   onClick={() => setPhotoTaken(true)}
  //                   className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
  //                 >
  //                   Enable Camera
  //                 </button>
  //               </div>
  //             )}
  //           </div>
            
  //           <button
  //             onClick={() => selfieInputRef.current?.click()}
  //             className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all mb-3 flex items-center justify-center gap-2"
  //           >
  //             <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
  //             </svg>
  //             Upload from Gallery
  //           </button>
            
  //           <input
  //             ref={selfieInputRef}
  //             type="file"
  //             className="hidden"
  //             accept="image/*"
  //             onChange={(e) => handleSelfieUpload(e.target.files[0])}
  //           />
            
  //           <button
  //             onClick={() => showScreen('terms')}
  //             disabled={!photoTaken && !uploadedFiles.selfie}
  //             className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
  //           >
  //             Continue
  //             <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
  //             </svg>
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const TermsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white px-6 py-5">
      <div className="max-w-md mx-auto">
        <Header showBack />
        <ProgressBar step={4} totalSteps={5} />
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Terms & Code of Conduct</h1>
            <p className="text-gray-600">Please review and accept our delivery terms and community guidelines</p>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5 max-h-48 overflow-y-auto">
            <h4 className="font-semibold mb-3">Sendr Delivery Terms</h4>
            <p className="text-sm text-gray-700 mb-3">By becoming a Sendr traveler, you agree to:</p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>Handle all packages with care and professionalism</li>
              <li>Maintain the security and confidentiality of deliveries</li>
              <li>Follow all local laws and regulations</li>
              <li>Provide accurate delivery updates and communicate clearly</li>
              <li>Respect pickup and delivery timeframes</li>
              <li>Maintain a professional demeanor with all users</li>
            </ul>
          </div>
          
          <div className="flex items-start gap-3 mb-6">
            <button
              onClick={() => setTermsAccepted(!termsAccepted)}
              className={`w-5 h-5 border-2 rounded flex-shrink-0 mt-0.5 transition-all ${
                termsAccepted 
                  ? 'bg-orange-600 border-orange-600' 
                  : 'border-gray-300 hover:border-orange-600'
              }`}
            >
              {termsAccepted && (
                <svg className="w-3 h-3 text-white m-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
              )}
            </button>
            <label className="text-sm text-gray-600 cursor-pointer" onClick={() => setTermsAccepted(!termsAccepted)}>
              I have read and agree to the <span className="text-orange-600 hover:underline">Sendr Delivery Terms</span> and <span className="text-orange-600 hover:underline">Code of Conduct</span>
            </label>
          </div>
          
          <button
            onClick={() => showScreen('submit')}
            disabled={!termsAccepted}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Continue
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const SubmitScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white px-6 py-5">
      <div className="max-w-md mx-auto">
        <Header showBack />
        <ProgressBar step={5} totalSteps={5} />
        
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
              {[
                "Driver's License uploaded",
                "NIN number provided", 
                "Live selfie captured",
                "Terms accepted"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <svg width="16" height="16" className="text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                  </svg>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
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
            onClick={() => showScreen('pending')}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Submit for Review
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const PendingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white px-6 py-5">
      <div className="max-w-md mx-auto">
        <Header />
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="text-center mb-6">
            <svg width="64" height="64" className="mx-auto mb-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Verification Submitted</h1>
            <p className="text-gray-600">Your documents are being reviewed by our team</p>
          </div>
          
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
              </svg>
              Pending Verification
            </span>
          </div>
          
          <div className="space-y-4 mb-6">
            {[
              { title: "Documents Uploaded", status: "completed", time: "Completed just now" },
              { title: "Under Review", status: "current", time: "Typically takes 12-24 hours" },
              { title: "Approved", status: "pending", time: "You'll receive an email notification" }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.status === 'completed' ? 'bg-green-500 text-white' :
                  item.status === 'current' ? 'bg-orange-500 text-white' :
                  'bg-gray-300 text-gray-500'
                }`}>
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                    {item.status === 'completed' ? (
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    ) : item.status === 'current' ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                    ) : (
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    )}
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-700 font-medium text-center">
              📧 We'll send you an email once verification is complete
            </p>
          </div>
          
          <button
            onClick={() => showScreen('verified')}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all mb-3 flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            View as Verified (Demo)
          </button>
          
          <button
            onClick={() => setCurrentScreen('welcome')}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Back to Home
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const VerifiedScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white px-6 py-5">
      <div className="max-w-md mx-auto">
        <Header showBack />
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-semibold">
              {name ? name.charAt(0).toUpperCase() : 'JD'}
            </div>
            <div className="text-xl font-semibold text-gray-900 mb-1">{name || 'John Doe'}</div>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
              Verified Traveler
            </span>
          </div>
          
          <div className="grid gap-4 mb-6">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                ),
                title: "Identity Verified",
                subtitle: "Driver's License & NIN confirmed"
              },
              {
                icon: (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </>
                ),
                title: "Delivery Zone",
                subtitle: "Lagos - Abuja - Kano"
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                ),
                title: "Trust Score",
                subtitle: "New Traveler"
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                ),
                title: "Earnings",
                subtitle: "₦0 total earned"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {item.icon}
                </svg>
                <div>
                  <div className="font-medium text-sm text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mb-6">
            <button
              onClick={() => alert('Starting delivery flow... (This would navigate to the main delivery dashboard)')}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Start Delivering
            </button>
          </div>
          
          <button
            onClick={() => alert('Edit profile functionality... (This would open profile editing form)')}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );

  // Screen routing
  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'identity-verification':
        return <IdentityVerificationScreen />;
      case 'license-upload':
        return <LicenseUploadScreen />;
      case 'nin-input':
        return <NINInputScreen />;
      // case 'selfie-capture':
      //   return <SelfieScreen />;
      case 'terms':
        return <TermsScreen />;
      case 'submit':
        return <SubmitScreen />;
      case 'pending':
        return <PendingScreen />;
      case 'verified':
        return <VerifiedScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="font-inter bg-gradient-to-br from-orange-50 to-white min-h-screen">
      {renderScreen()}
    </div>
  );
};

export default TravelerDashboard;