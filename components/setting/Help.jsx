import React from 'react'

export default function Help() {
  return (
    <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#3A0A21]">Help & Support</h2>
          <div className="space-y-4">
            {[
              { title: "FAQ", desc: "Find answers to common questions" },
              { title: "Contact Support", desc: "Get help from our support team" },
              { title: "Report an Issue", desc: "Let us know about any problems" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md cursor-pointer transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
  )
}
