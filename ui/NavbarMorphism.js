'use client';

const shimmer =
  'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-lg';

export default function NavbarMorphism() {
  return (
    <>
      {/* ── Desktop skeleton (md+) ── */}
      <nav className="hidden md:flex w-full fixed top-0 left-0 right-0 z-50 items-center justify-between h-16 px-6 bg-white dark:bg-black border-b border-black/10 dark:border-white/10">
        <span className="text-lg font-bold text-black dark:text-white tracking-tight">
          Carrydey
        </span>
        <div className="flex items-center gap-2">
          <div
            className={`${shimmer} h-8 w-16`}
            style={{ animationDelay: '0ms' }}
          />
          <div
            className={`${shimmer} h-8 w-16`}
            style={{ animationDelay: '80ms' }}
          />
          <div
            className={`${shimmer} h-8 w-14`}
            style={{ animationDelay: '160ms' }}
          />
          <div
            className={`${shimmer} ml-3 h-8 w-20`}
            style={{ animationDelay: '240ms' }}
          />
        </div>
      </nav>

      {/* ── Mobile top bar skeleton ── */}
      {/* Right side is empty — no bell, no login shimmer during auth load */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 bg-white dark:bg-black border-b border-black/10 dark:border-white/10">
        <span className="text-base font-bold text-black dark:text-white tracking-tight">
          Carrydey
        </span>
        <div
          className={`${shimmer} h-8 w-16`}
          style={{ animationDelay: '80ms' }}
        />
      </div>

      {/* ── Mobile bottom tab bar skeleton — floating pill ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div
          className="flex justify-center"
          style={{
            paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
            paddingTop: '8px',
          }}
        >
          <div
            className="flex items-center justify-around bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl rounded-[28px] px-2"
            style={{
              width: 'calc(100% - 32px)',
              border: '0.5px solid rgba(0,0,0,0.08)',
              boxShadow:
                '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            {[0, 80, 160].map((delay) => (
              <div
                key={delay}
                className="flex flex-col items-center justify-center flex-1 py-2.5 px-1 gap-1.5"
              >
                <div
                  className={`${shimmer} w-14 h-8 rounded-full`}
                  style={{ animationDelay: `${delay}ms` }}
                />
                <div
                  className={`${shimmer} h-2 w-8 rounded`}
                  style={{ animationDelay: `${delay + 40}ms` }}
                />
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="md:hidden h-24" />
      <div className="hidden md:block h-16" />
    </>
  );
}
