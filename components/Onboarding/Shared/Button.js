import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2';
  
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-sm',
    large: 'px-6 py-3 text-base'
  };
  
  const variantClasses = {
    primary: 'bg-[#3A0A21] text-white hover:opacity-90 disabled:opacity-50',
    secondary: 'bg-white text-[#3A0A21] border border-[#3A0A21] hover:bg-gray-50 disabled:opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
    success: 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 disabled:opacity-50'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${widthClass}
        ${className}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {children}
        </>
      ) : children}
    </button>
  );
};

export default Button;