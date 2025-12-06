import React from 'react'

export default function Notification() {
  return (
    <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#3A0A21]">Notifications</h2>
          <div className="space-y-4">
            {[
              { label: "Package Updates", desc: "Get notified about package status changes" },
              { label: "Payment Alerts", desc: "Notifications about payments and billing" },
              { label: "Marketing", desc: "Promotional offers and updates" },
              { label: "Security", desc: "Login alerts and security notifications" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.label}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={idx < 2} />
                    <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3A0A21]"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
  )
}
