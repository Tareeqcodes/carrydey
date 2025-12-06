'use client';
import { Suspense, useState } from 'react';
import { useAuth } from '@/hooks/Authcontext';
import Image from 'next/image';

function LoginFormContent() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email);
    setSent(true);
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 sm:p-10 space-y-6">
        <div className="text-center mb-4">
          <Image
            src="/ringo-logo.svg"
            alt="RINGO Logo"
            width={60}
            height={60}
            className="mx-auto mb-2"
          />
        </div>

        {sent ? (
          <div className="text-center">
            <p className="text-green-600 text-sm font-medium">
              ✅ Magic link sent! Check your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-gray-600 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 text-white font-medium py-3 text-sm hover:bg-indigo-700 transition-all duration-200"
            >
              Send Login Link
            </button>
          </form>
        )}

        <div className="relative text-center my-4">
          <div className="absolute inset-x-0 top-1/2 border-t border-gray-200"></div>
          <span className="relative bg-white px-3 text-xs text-gray-400">
            Or continue with
          </span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-100 transition-all"
        >
          <Image src="/google.svg" alt="Google icon" width={22} height={22} />
          <span className="text-sm font-medium text-gray-700">
            Continue with Google
          </span>
        </button>

        <p className="text-center text-xs text-gray-400 pt-4">
          By continuing, you agree to ’s{' '}
          <span className="text-indigo-600 cursor-pointer hover:underline">
            Terms
          </span>{' '}
          &{' '}
          <span className="text-indigo-600 cursor-pointer hover:underline">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-gray-600">Loading...</div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
