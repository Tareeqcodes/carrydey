'use client';
import { Suspense, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/Authcontext';
import { Mail, Loader2 } from 'lucide-react';

function LoginFormContent() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, loginWithFacebook, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email);
    setSent(true);
    setLoading(false);
  };
  const handleGoogleLogin = async () => {
    setLoading(true);
    await loginWithGoogle();
    setLoading(false);
  };
  const handleFacebookLogin = async () => {
    setLoading(true);
    await loginWithFacebook();
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-32 flex items-center justify-center bg-white dark:bg-black px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00C896]/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#00E5AD]/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-black/5 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl p-8 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-black dark:text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-black/50 dark:text-white/50">
              Sign in to your Carrydey account
            </p>
          </div>

          {sent ? (
            <div className="space-y-4 text-center">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl"
                style={{
                  background: 'rgba(0,200,150,0.1)',
                  border: '1px solid rgba(0,200,150,0.2)',
                }}
              >
                <Mail className="w-8 h-8 text-[#00C896]" />
              </div>
              <div>
                <p className="text-black dark:text-white font-semibold mb-1">
                  Check your email
                </p>
                <p className="text-sm text-black/50 dark:text-white/50">
                  We've sent a magic link to
                  <br />
                  <span className="text-[#00C896] font-medium">{email}</span>
                </p>
              </div>
              <p className="text-xs text-black/40 dark:text-white/40 pt-2">
                Didn't receive it? Check your spam folder or{' '}
                <button
                  onClick={() => setSent(false)}
                  className="text-[#00C896] hover:text-[#00E5AD] cursor-pointer font-medium transition-colors"
                >
                  try again
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-black/70 dark:text-white/70 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3.5 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:border-[#00C896] focus:outline-none transition-all duration-300"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-[#00C896] to-[#00E5AD] text-black font-bold py-3.5 text-sm hover:from-[#00E5AD] hover:to-[#00C896] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-[#00C896]/20"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                  </span>
                ) : (
                  'Send Magic Link'
                )}
              </button>
            </form>
          )}

          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-black/0 via-black/10 dark:via-white/10 to-black/0" />
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-black px-3 text-xs text-black/40 dark:text-white/40 font-medium uppercase tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full border border-black/10 dark:border-white/10 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 disabled:opacity-50 group"
            >
              <Image
                src="/google.svg"
                alt="Google icon"
                width={20}
                height={20}
              />
              <span className="text-sm font-semibold text-black dark:text-white group-hover:text-[#00C896] transition-colors">
                Google
              </span>
            </button>
            <button
              onClick={handleFacebookLogin}
              disabled={loading}
              className="w-full border border-black/10 dark:border-white/10 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 disabled:opacity-50 group"
            >
              <Image
                src="/facebook.svg"
                alt="Facebook icon"
                width={20}
                height={20}
              />
              <span className="text-sm font-semibold text-black dark:text-white group-hover:text-[#00C896] transition-colors">
                Facebook
              </span>
            </button>
          </div>

          <p className="text-center text-xs text-black/40 dark:text-white/40 leading-relaxed">
            By continuing, you agree to Carrydey's{' '}
            <Link
              href="/terms"
              className="text-[#00C896] hover:text-[#00E5AD] font-semibold transition-colors"
            >
              Terms
            </Link>{' '}
            &{' '}
            <Link
              href="/privacy"
              className="text-[#00C896] hover:text-[#00E5AD] font-semibold transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
          <div className="text-black/50 dark:text-white/50">Loading...</div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
