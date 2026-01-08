import { AlertCircle } from 'lucide-react';
export default function InlineError({ text, className = '' }) {
  return (
    <div className={`flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg ${className}`}>
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{text}</span>
    </div>
  );
}