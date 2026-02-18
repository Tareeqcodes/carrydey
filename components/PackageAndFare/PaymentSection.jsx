'use client';
import { AlertCircle } from 'lucide-react';
import { useBrandColors } from '@/hooks/BrandColors';

const PAYMENT_METHODS = [
  { id: 'cash_on_pickup', label: 'Cash',  sub: 'On pickup' },
  { id: 'pay_now',        label: 'Card',  sub: 'Pay now'   },
];

export default function PaymentSection({ paymentMethod, onPaymentMethodChange, errors }) {
  const { brandColors } = useBrandColors();

  return (
    <section>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Payment</p>

      {/* Chips */}
      <div className="flex gap-2">
        {PAYMENT_METHODS.map(({ id, label, sub }) => {
          const on = paymentMethod === id;
          return (
            <button
              key={id}
              onClick={() => onPaymentMethodChange(id)}
              className="flex-1 py-3 rounded-xl text-center transition-all"
              style={{ background: on ? brandColors.primary : '#f3f4f6' }}
            >
              <p className={`text-sm font-bold ${on ? 'text-white' : 'text-gray-700'}`}>
                {label}
              </p>
              <p className={`text-[10px] mt-0.5 ${on ? 'text-white/70' : 'text-gray-400'}`}>
                {sub}
              </p>
            </button>
          );
        })}
      </div>

      {/* Error */}
      {errors?.paymentMethod && (
        <div className="flex items-center gap-1.5 mt-2">
          <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-400">{errors.paymentMethod}</p>
        </div>
      )}
    </section>
  );
}