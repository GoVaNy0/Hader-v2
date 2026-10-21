import React from 'react';

export default function Card({
  children,
  variant = 'feature', // 'feature' | 'glowing-inset' | 'deep' | 'muted' | 'void'
  className = '',
  padding = 'p-5 md:p-6',
  ...props
}) {
  const variantClasses = {
    feature: 'bg-[#1a1624] border border-white/[0.07] rounded-2xl hover:border-white/[0.12] transition-colors',
    'glowing-inset': 'card-glowing-inset bg-transparent rounded-3xl',
    deep: 'bg-[#1b1728] border border-[#3e3a46]/40 rounded-3xl',
    muted: 'bg-[#2c2834] border border-[#3e3a46] rounded-2xl',
    void: 'bg-[#0e0918] border border-[#3e3a46] rounded-2xl'
  };

  return (
    <div
      className={`relative overflow-hidden ${variantClasses[variant] || variantClasses.feature} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
