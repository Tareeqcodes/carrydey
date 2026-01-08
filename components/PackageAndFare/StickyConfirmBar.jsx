'use client';

export default function StickyConfirmBar({ isValid, loading, onConfirm }) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 max-w-3xl mx-auto">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onConfirm}
          disabled={!isValid || loading}
          className="group px-8 py-3 bg-[#3A0A21] hover:bg-[#4A0A31] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all text-lg min-w-[200px]"
        >
          {loading ? 'Creating Delivery...' : 'Confirm & Continue'}
        </button>
      </div>
    </div>
  );
}
