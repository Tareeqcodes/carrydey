import { ArrowRight, ShieldCheck } from "lucide-react"

export default function IntroPage({onNext}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white px-4 py-5">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="text-center mb-6">
            <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-orange-600" />
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
            onClick={onNext}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Begin Verification
             <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
