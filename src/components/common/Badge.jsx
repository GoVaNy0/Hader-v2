import React from 'react';

export default function Badge({
  children,
  variant = 'default', // 'default' | 'success' | 'warning' | 'danger' | 'ember' | 'electric' | 'pill'
  size = 'sm', // 'xs' | 'sm' | 'md'
  icon: Icon,
  className = '',
  ...props
}) {
  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2'
  };

  const variantClasses = {
    default: 'bg-white/[0.06] text-[#d1cece] border border-white/10',
    success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    danger: 'bg-red-500/15 text-red-300 border border-red-500/30',
    ember: 'bg-[#ff492c]/15 text-[#fd8925] border border-[#ff492c]/30',
    electric: 'bg-[#077ac7]/15 text-sky-300 border border-[#077ac7]/30',
    pill: 'bg-white text-[#48556a] font-medium border border-transparent shadow-sm'
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${
        sizeClasses[size] || sizeClasses.sm
      } ${variantClasses[variant] || variantClasses.default} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
