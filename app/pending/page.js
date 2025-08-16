'use client'
import Header from '@/components/ui/Header';


export default function PendingVerification() {
  return (
    <>
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
    </>
  )
}
