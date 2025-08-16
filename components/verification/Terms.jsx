'use client'
import { ChevronRight, Check } from "lucide-react";
const Terms = ({ verificationData, updateVerificationData, onNext, loading, error }) => {
    const handleTermsToggle = () => {
        updateVerificationData({ termsAccepted: !verificationData.termsAccepted });
    };

    return (
        <>
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
                    onClick={handleTermsToggle}
                    disabled={loading}
                    className={`w-5 h-5 border-2 rounded flex-shrink-0 mt-0.5 transition-all ${
                        verificationData.termsAccepted 
                            ? 'bg-orange-600 border-orange-600' 
                            : 'border-gray-300 hover:border-orange-600'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    {verificationData.termsAccepted && (
                       <Check className="w-4 h-4 text-white m-auto" />
                    )}
                </button>
                <label 
                    className={`text-sm text-gray-600 ${loading ? 'cursor-default' : 'cursor-pointer'}`} 
                    onClick={!loading ? handleTermsToggle : undefined}
                >
                    I have read and agree to the <span className="text-orange-600 hover:underline">Sendr Delivery Terms</span> and <span className="text-orange-600 hover:underline">Code of Conduct</span>
                </label>
            </div>
            
            {error && (
                <div className="bg-red-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-red-700 font-medium">⚠️ {error}</p>
                </div>
            )}
            
            <button
                onClick={onNext}
                disabled={!verificationData.termsAccepted || loading}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
                Continue 
                 <ChevronRight className="w-4 h-4" />
            </button>
        </>
    );
};

export default Terms;