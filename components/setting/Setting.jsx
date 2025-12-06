import React from 'react'

export default function Setting() {
  return (
     <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#3A0A21]">Settings</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Language</h3>
              <select className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3A0A21]/30 transition-all">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Theme</h3>
              <div className="flex space-x-3">
                {["Light", "Dark", "Auto"].map((theme) => (
                  <button
                    key={theme}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium hover:bg-gray-50 hover:border-[#3A0A21] hover:text-[#3A0A21] transition-all duration-300"
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
  )
}
