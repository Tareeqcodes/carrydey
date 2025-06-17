'use client';
import { useAuth } from "@/context/Authcontext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Role() {
  const { user } = useAuth();

  return (
    <>
    {user ? (
        <div className="mb-5 space-y-6">
          <Link 
            href="/"
            className="flex items-center text-gray-600 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Link>
          <div>
          <h1 className="text-xl font-semibold text-gray-500">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
          </div>
        </div>
    ) : (
          <div className="mb-5 space-y-6">
          <Link 
            href="/"
            className="flex items-center text-gray-600 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Link>
          <div>
          <h1 className="text-xl font-semibold text-gray-500">Create Account</h1>
          <p className="text-gray-600">Join as a sender</p>
          </div>
        </div> 
    )}
    </>
  )
}
