'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/Authcontext';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function LoginFormContent() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [sent, setSent] = useState(false);
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
     
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, role, name);
    setSent(true);
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle(role);
  };

  const getWelcomeText = () => {
    if (role === 'sender') {
      return {
        title: 'Join as Sender',
        subtitle: 'Send packages with trusted travelers'
      };
    } else if (role === 'traveler') {
      return {
        title: 'Join as Traveler',
        subtitle: 'Earn money while traveling'
      };
    }
    return {
      title: 'Welcome Back',
      subtitle: 'Sign in to your account'
    };
  };

  const welcomeText = getWelcomeText();

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
            <h1 className="text-xl font-semibold text-gray-500">Create Account</h1>
          <h2 className="text-sm font-semibold text-gray-500">
            {welcomeText.title}
          </h2>
        </div>
      </div>
            
      <div className="max-w-md text-justify rounded-xl bg-white p-10 shadow-xl">
        {sent ? (
          <p className="text-green-600 text-sm font-light text-center">
            Magic link sent! Check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm py-5">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-gray-300 p-2 mt-2 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
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
            </div>
            
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
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 cursor-pointer transition"
        >
          <Image
            src="/google.svg"
            alt='Google-image'
            width={25}
            height={25}
          />
          Google
        </button>
      </div>
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}