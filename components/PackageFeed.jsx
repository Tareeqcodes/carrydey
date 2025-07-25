"use client";
import { Package } from "lucide-react";

export default function PackageFeed() {
  return (
    <>
      <div className='space-y-4 pt-4'> 
          <h3 className='text-lg font-semibold text-gray-900'>
            Latest Packages
          </h3>

        <div className='space-y-3 pt-2'>
          <>
            <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center'>
                    <Package size={16} className='text-white' />
                  </div>
                  <div>
                    <p className='font-medium'>Electronics Package</p>
                    <p className='text-sm text-gray-600'>John Doe • ⭐ 4.8</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='font-semibold text-green-600'>₦15,000</p>
                  <p className='text-xs text-gray-600'>2.5kg • Medium</p>
                </div>
              </div>
              <div className='flex items-center justify-between text-sm text-gray-600'>
                <span>📍 Lagos → Abuja • By June 15</span>
                <button className='text-blue-600 font-medium hover:text-blue-700'>
                  Accept
                </button>
              </div>
            </div>

            <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center'>
                    <Package size={16} className='text-white' />
                  </div>
                  <div>
                    <p className='font-medium'>Documents & Books</p>
                    <p className='text-sm text-gray-600'>
                      Sarah Ahmed • ⭐ 4.9
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='font-semibold text-green-600'>₦8,000</p>
                  <p className='text-xs text-gray-600'>1.0kg • Small</p>
                </div>
              </div>
              <div className='flex items-center justify-between text-sm text-gray-600'>
                <span>📍 Abuja → Port Harcourt • By June 18</span>
                <button className='text-blue-600 font-medium hover:text-blue-700'>
                  Accept
                </button>
              </div>
            </div>
          </>
        </div>
      </div>
    </>
  );
}
