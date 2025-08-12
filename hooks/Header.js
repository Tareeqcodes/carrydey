'use client'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

  export default function Header({ title, showBack }) {
    return (
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center space-x-4 cursor-pointer">
        {showBack && 
         <Link href="/dashboard">
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
         </Link>
        }
        <h1>{title}</h1>
      </div>
    )
  }
  