'use client';
import { motion } from 'framer-motion';

const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'linear',
  },
};

const SkeletonBlock = ({ className = '' }) => (
  <motion.div
    animate={shimmer.animate}
    transition={shimmer.transition}
    className={`rounded-xl ${className}`}
    style={{
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
      backgroundSize: '400% 100%',
    }}
  />
);

const ProfileSkeleton = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row min-h-[600px]">

      {/* Left panel skeleton */}
      <div
        className="lg:w-2/5 xl:w-1/3 flex flex-col justify-between p-8 lg:p-12"
        style={{ borderRight: '1px solid rgba(0,0,0,0.06)' }}
      >
        {/* Avatar */}
        <div className="flex flex-col items-start gap-6 py-6 lg:py-0 lg:mt-16">
          <SkeletonBlock className="w-28 h-28 lg:w-36 lg:h-36 !rounded-3xl" />
          <div className="flex flex-col gap-3 w-full">
            <SkeletonBlock className="h-8 w-48" />
            <SkeletonBlock className="h-4 w-36" />
            <div className="flex gap-2 mt-1">
              <SkeletonBlock className="h-6 w-16 !rounded-full" />
              <SkeletonBlock className="h-6 w-20 !rounded-full" />
            </div>
          </div>
        </div>

        {/* Security badge skeleton */}
        <div className="hidden lg:flex items-center gap-3 mt-12">
          <SkeletonBlock className="w-8 h-8" />
          <div className="flex flex-col gap-1.5">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-2.5 w-32" />
          </div>
        </div>
      </div>

      {/* Right panel skeleton */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 lg:p-12 xl:p-16">

        {/* Section header */}
        <div className="mb-8 lg:mb-10 flex flex-col gap-2">
          <SkeletonBlock className="h-3 w-28" />
          <SkeletonBlock className="h-7 w-48" />
        </div>

        {/* Fields card */}
        <div
          className="rounded-3xl p-6 lg:p-8 mb-6"
          style={{
            background: 'rgba(0,0,0,0.02)',
            border: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex items-start gap-4 py-5 ${i < 2 ? 'border-b' : ''}`}
              style={{ borderColor: 'rgba(0,0,0,0.05)' }}
            >
              <SkeletonBlock className="w-9 h-9 shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <SkeletonBlock className="h-2.5 w-16" />
                <SkeletonBlock className="h-4 w-40" />
              </div>
            </div>
          ))}
        </div>

        {/* Toggle skeleton */}
        <div
          className="rounded-3xl px-6 py-5 mb-6 flex items-center justify-between"
          style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}
        >
          <div className="flex flex-col gap-2">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-3 w-40" />
          </div>
          <SkeletonBlock className="h-7 w-14 !rounded-full shrink-0" />
        </div>

        {/* Button skeleton */}
        <SkeletonBlock className="h-14 w-full !rounded-2xl" />
      </div>
    </div>
  );
};

export default ProfileSkeleton;