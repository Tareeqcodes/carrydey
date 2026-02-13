'use client';
import { useBrandColors } from '@/hooks/BrandColors';

export default function StickyConfirmBar({ isValid, loading, onConfirm }) {
  const { brandColors } = useBrandColors();

  return (
    <div className="pb-28 bg-white border-t border-gray-200 p-4 max-w-3xl mx-auto">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onConfirm}
          disabled={!isValid || loading}
          className="group px-8 py-3 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all text-lg min-w-[200px]"
          style={{
            background: isValid && !loading
              ? `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)`
              : undefined,
          }}
          onMouseEnter={(e) => {
            if (isValid && !loading) {
              e.currentTarget.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {loading ? 'Creating Delivery...' : 'Confirm & Continue'}
        </button>
      </div>
    </div>
  );
}