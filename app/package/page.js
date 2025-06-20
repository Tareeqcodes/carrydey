'use client'
import Header from '@/components/Header'
import { MapPin, Calendar } from 'lucide-react'

export default function page() {
  return (
   <div className="min-h-screen bg-gray-50">
         <Header title="Post Package" showBack />
         
         <div className="p-4 space-y-6">
           <div className="bg-white rounded-2xl p-6 shadow-sm">
             <h2 className="text-xl font-semibold mb-6">Package Details</h2>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Package Title</label>
                 <input 
                   type="text" 
                   placeholder="e.g., Electronics Package"
                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                 <textarea 
                   placeholder="Describe your package contents"
                   rows="3"
                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                   <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                     <option>Small</option>
                     <option>Medium</option>
                     <option>Large</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                   <input 
                     type="number" 
                     placeholder="2.5"
                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   />
                 </div>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                 <div className="relative">
                   <MapPin size={20} className="absolute left-3 top-3 text-gray-400" />
                   <input 
                     type="text" 
                     placeholder="Enter pickup address"
                     className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   />
                 </div>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Location</label>
                 <div className="relative">
                   <MapPin size={20} className="absolute left-3 top-3 text-gray-400" />
                   <input 
                     type="text" 
                     placeholder="Enter delivery address"
                     className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   />
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                   <div className="relative">
                     <Calendar size={20} className="absolute left-3 top-3 text-gray-400" />
                     <input 
                       type="date" 
                       className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Reward (₦)</label>
                   <input 
                     type="number" 
                     placeholder="15000"
                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   />
                 </div>
               </div>
             </div>
             
             <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-blue-700 transition-colors">
               Post Package
             </button>
           </div>
         </div>
          <div className="h-20"></div>
       </div>
  )
}
