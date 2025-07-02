'use client'
import { motion } from "framer-motion"
import { Bell, Plus } from 'lucide-react';

export default function ContentLoading() {
  return (
    <>
      <section>
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <motion.div 
                className="h-8 bg-gray-200 rounded-lg w-48 mb-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div 
                className="h-5 bg-gray-100 rounded w-32"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              />
            </div>
            
            <div className="flex items-center space-x-3">
              {/* User Type Badge Loading */}
              <motion.div 
                className="px-3 py-1 rounded-full bg-gray-100 w-16 h-6"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
              />
              
              {/* Notifications Loading */}
              <div className="relative">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Bell size={24} className="text-gray-400" />
                </motion.div>
                <motion.div 
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gray-300 rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.9 }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Component Loading - Mimicking both traveler and default versions */}
      <div className="px-4">
        <motion.div 
          className="relative bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-500/30 rounded-3xl p-8 mt-8 overflow-hidden pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative circles - same as original */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-4 -mb-4"></div>
          
          <div className="relative z-10">
            {/* Title Loading */}
            <motion.div 
              className="h-8 bg-white/20 rounded-lg w-64 mb-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Subtitle Loading */}
            <motion.div 
              className="h-5 bg-white/10 rounded w-80 mb-6"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            
            {/* Button Loading */}
            <motion.div 
              className="bg-white/20 rounded-xl w-44 h-12 flex items-center justify-center space-x-2"
              animate={{ 
                scale: [1, 1.02, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Plus size={20} className="text-white/50" />
              </motion.div>
              <motion.div 
                className="h-4 bg-white/30 rounded w-20"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 1.2 }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
