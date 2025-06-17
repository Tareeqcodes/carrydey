'use client';
import { useState } from 'react';
// import { useAuth } from '@/context/Authcontext';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
   const [sent, setSent] = useState(false);
  // const [userRole, setUserRole] = useState('');
  // const { user, login, loginWithGoogle } = useAuth();
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   await login(email);
  //   setSent(true);
  // };
  
  // const handleGoogleLogin = async () => {
  //   await loginWithGoogle();
  // };
  
  return (
    <div className="flex flex-col min-h-screen items-justify justify-center bg-gray-50 px-4">
      <div className="flex flex-col mb-5 space-y-6 pl-10">
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
      <div className="max-w-md text-justify rounded-xl bg-white p-10 shadow-xl">

        {sent ? (
          <p className="text-green-600 text-sm font-light text-center">Magic link sent! Check your inbox.</p>
        ) : (
          <form  className="space-y-4">
            <label className="text-sm py-5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-gray-300 p-2 mt-2 focus:border-indigo-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="w-full rounded-xl cursor-pointer bg-indigo-600 my-5 p-2 text-white hover:bg-indigo-700"
            >
              Send Login Link
            </button>
          </form>
        )}
        <div className="my-4 text-center text-gray-500 relative">
          <hr className="absolute top-3 w-full border-t border-b-gray-100" />
          <span className="relative text-xs bg-white px-3">Or continue with</span>
        </div>
        
          <button
            // onClick={handleGoogleLogin}
            className="w-full border border-gray-300 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 cursor-pointer transition"
          >
            <Image
              src="/google.svg"
              alt='Google-image'
              width={25}
              height={25}
            />Google
          </button>
      </div>
    </div>
  );
}