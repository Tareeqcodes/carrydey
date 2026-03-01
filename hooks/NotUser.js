'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function NotUser() {
  const router = useRouter();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        .notuser-bg {
          background-color: #faf9f7;
          background-image:
            radial-gradient(ellipse 80% 60% at 60% -10%, rgba(58,10,33,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 10% 100%, rgba(58,10,33,0.05) 0%, transparent 60%);
        }

        .lock-ring {
          position: relative;
          width: 96px;
          height: 96px;
        }

        .lock-ring::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1.5px solid rgba(58,10,33,0.15);
          animation: ring-pulse 3s ease-in-out infinite;
        }

        .lock-ring::after {
          content: '';
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          border: 1px solid rgba(58,10,33,0.06);
          animation: ring-pulse 3s ease-in-out infinite 0.6s;
        }

        @keyframes ring-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.5; }
        }

        .shimmer-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(58,10,33,0.12), transparent);
        }

        .btn-primary {
          position: relative;
          overflow: hidden;
        }

        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(58,10,33,0.25);
        }

        .btn-secondary:hover {
          background: rgba(58,10,33,0.04);
          transform: translateY(-1px);
        }

        .btn-primary, .btn-secondary {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .eyebrow {
          letter-spacing: 0.18em;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          color: rgba(58,10,33,0.35);
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: rgba(58,10,33,0.4);
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
        }

        .dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(58,10,33,0.25);
        }
      `}</style>

      <div
        className="notuser-bg min-h-screen flex items-center justify-center px-6"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <motion.div
          className="w-full max-w-xs"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >

          {/* Lock icon */}
          <motion.div
            className="flex justify-center mb-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="lock-ring flex items-center justify-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(58,10,33,0.06)' }}
              >
                {/* Custom lock SVG — cleaner than lucide at this size */}
                <svg width="26" height="28" viewBox="0 0 26 28" fill="none">
                  <rect x="3" y="13" width="20" height="14" rx="3.5" stroke="#3A0A21" strokeWidth="1.6" fill="none"/>
                  <path d="M8 13V9a5 5 0 0 1 10 0v4" stroke="#3A0A21" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                  <circle cx="13" cy="20" r="2" fill="#3A0A21" opacity="0.7"/>
                  <line x1="13" y1="22" x2="13" y2="24" stroke="#3A0A21" strokeWidth="1.6" strokeLinecap="round" opacity="0.7"/>
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Text block */}
          <motion.div
            className="text-center mb-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            <p className="eyebrow mb-4">Members only</p>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '2rem',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: '#1a1a1a',
                fontWeight: 400,
              }}
            >
              You're one step
              <br />
              <em style={{ color: '#3A0A21' }}>away from sending</em>
            </h1>
          </motion.div>

          <motion.p
            className="text-center mb-10"
            style={{ fontSize: '13px', color: '#888', lineHeight: 1.6 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            Sign in to confirm your delivery and choose a courier. It only takes a minute.
          </motion.p>

          {/* Divider */}
          <motion.div
            className="shimmer-line mb-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          />

          {/* Buttons */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <button
              onClick={() => router.push('/login')}
              className="btn-primary w-full py-4 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: '#3A0A21' }}
            >
              Sign in to continue
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              onClick={() => router.push('/login')}
              className="btn-secondary w-full py-4 rounded-2xl text-sm font-medium flex items-center justify-center gap-2"
              style={{ color: '#3A0A21', border: '1.5px solid rgba(58,10,33,0.18)', background: 'transparent' }}
            >
              Create a free account
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="flex items-center justify-center gap-3 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.55 }}
          >
            <span className="trust-badge">Free to join</span>
            <span className="dot" />
            <span className="trust-badge">No credit card</span>
            <span className="dot" />
            <span className="trust-badge">2 min setup</span>
          </motion.div>

        </motion.div>
      </div>
    </>
  );
}