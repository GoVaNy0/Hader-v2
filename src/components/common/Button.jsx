import React from 'react';

export default function Button({
  children,
  variant = 'ember', // 'ember' | 'ghost-outline' | 'frosted-ghost' | 'muted' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconPosition = 'start', // 'start' | 'end'
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5'
  };

  const variantClasses = {
    ember: 'btn-ember text-white shadow-[0_4px_14px_rgba(253,137,37,0.25)]',
    'ghost-outline': 'btn-ghost-outline border border-[#e5e7eb] text-white hover:bg-white/5',
    'frosted-ghost': 'btn-frosted-ghost bg-[#0d0a19]/40 border border-white/10 text-[#d1cece] hover:text-white',
    muted: 'bg-[#2c2834] hover:bg-[#3e3a46] text-[#d1cece] hover:text-white border border-[#3e3a46] rounded-lg',
    danger: 'bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 rounded-lg'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${
        sizeClasses[size] || sizeClasses.md
      } ${variantClasses[variant] || variantClasses.ember} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      ) : (
        <>
          {Icon && iconPosition === 'start' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'end' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}
