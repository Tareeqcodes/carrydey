'use client';
import { AlertCircle } from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'cash_on_pickup', label: 'Cash', sub: 'On pickup' },
  { id: 'pay_now', label: 'Card', sub: 'Pay now' },
];

export default function PaymentSection({
  paymentMethod,
  onPaymentMethodChange,
  errors,
}) {
  return (
    <section>
      <p className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-widest mb-3">
        Payment
      </p>
      <div className="flex gap-2">
        {PAYMENT_METHODS.map(({ id, label, sub }) => {
          const on = paymentMethod === id;
          return (
            <button
              key={id}
              onClick={() => onPaymentMethodChange(id)}
              className="flex-1 py-3 rounded-xl text-center transition-all border"
              style={{
                background: on ? '#00C896' : 'rgba(0,0,0,0.05)',
                borderColor: on ? '#00C896' : 'rgba(0,0,0,0.1)',
              }}
            >
              <p
                className={`text-sm font-bold ${on ? 'text-black' : 'text-black dark:text-white'}`}
              >
                {label}
              </p>
              <p
                className={`text-[10px] mt-0.5 ${on ? 'text-black/70' : 'text-black/40 dark:text-white/40'}`}
              >
                {sub}
              </p>
            </button>
          );
        })}
      </div>
      {errors?.paymentMethod && (
        <div className="flex items-center gap-1.5 mt-2">
          <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-400">{errors.paymentMethod}</p>
        </div>
      )}
    </section>
  );
}
