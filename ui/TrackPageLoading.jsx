'use client';

const TrackPageLoading = () => {
  const bars = [
    { height: '100%', delay: '0ms'   },
    { height: '70%',  delay: '120ms' },
    { height: '100%', delay: '240ms' },
    { height: '55%',  delay: '360ms' },
    { height: '80%',  delay: '480ms' },
  ];

  const skeletons = [
    { width: '75%',  delay: '0ms'   },
    { width: '90%',  delay: '150ms' },
    { width: '55%',  delay: '300ms' },
  ];

  return (
    <>
      <style>{`
        @keyframes bounce-bar {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.35); }
        }
      `}</style>

      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl px-8 py-9 w-[300px] border border-gray-100">

          {/* Bars */}
          <div className="flex items-end justify-center gap-1.5 mb-6" style={{ height: 36 }}>
            {bars.map((b, i) => (
              <span
                key={i}
                style={{
                  width: 6,
                  height: b.height,
                  background: '#3A0A21',
                  borderRadius: 3,
                  transformOrigin: 'bottom',
                  animationDelay: b.delay,
                  animation: 'bounce-bar 0.9s ease-in-out infinite',
                }}
              />
            ))}
          </div>

          {/* Text */}
          <p className="text-[17px] font-semibold text-gray-900 text-center mb-1">
            Loading dashboard
          </p>
          {/* <p className="text-[13px] text-gray-400 text-center mb-6">
            Fetching your deliveries…
          </p> */}

          {/* Skeleton lines */}
          {/* <div className="flex flex-col gap-2.5">
            {skeletons.map((s, i) => (
              <div key={i} className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full animate-pulse"
                  style={{
                    width: s.width,
                    background: '#e8e0e3',
                    animationDelay: s.delay,
                  }}
                />
              </div>
            ))}
          </div> */}

        </div>
      </div>
    </>
  );
};

export default TrackPageLoading;