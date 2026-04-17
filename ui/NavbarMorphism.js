'use client';
const shimmer =
  'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-lg';

export default function NavbarMorphism() {
  return (
    <>
      {/* ── Desktop skeleton (md+) ── */}
      <nav className="hidden md:flex w-full fixed top-0 left-0 right-0 z-50 items-center justify-between h-16 px-6 bg-white dark:bg-black border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-black dark:text-white tracking-tight">
            Carrydey
          </span>
        </div>
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
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 bg-white dark:bg-black border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-black dark:text-white tracking-tight">
            Carrydey
          </span>
        </div>
        <div
          className={`${shimmer} h-8 w-16`}
          style={{ animationDelay: '80ms' }}
        />
      </div>

      {/* ── Mobile bottom nav skeleton ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div
          className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-black/10 dark:border-white/10"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
        >
          <div className="flex items-center justify-around px-2 pt-1 pb-1">
            {[0, 80, 160].map((delay) => (
              <div
                key={delay}
                className="flex flex-col items-center justify-center flex-1 py-2 px-1 gap-1.5"
              >
                <div
                  className={`${shimmer} w-11 h-11 rounded-2xl`}
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

      <div className="md:hidden h-14" />
      <div className="hidden md:block h-16" />
    </>
  );
}
