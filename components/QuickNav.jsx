'use client';
import { Search, MessageCircle, History } from 'lucide-react';

export default function QuickNav() {
  return (
    <>
    
     <div className="bg-white rounded-2xl p-6 mt-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4 text-gray-900">Quick Tools</h3>
          <div className="grid grid-cols-3 gap-4">
            
            <button className="text-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto">
                <MessageCircle size={20} className="text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Messages</span>
            </button>
            <button className="text-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto">
                <History size={20} className="text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">History</span>
            </button>
          </div>
        </div>
       
    </>
  )
}
