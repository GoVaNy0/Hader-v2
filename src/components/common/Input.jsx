import React, { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    endAdornment,
    type = 'text',
    className = '',
    containerClassName = '',
    id,
    ...props
  },
  ref
) {
  const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  return (
    <div className={`space-y-1.5 text-right ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[#d1cece]">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9d9797] pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          ref={ref}
          type={type}
          className={`w-full bg-[#1b1728] border ${
            error ? 'border-red-500/80 focus:border-red-400' : 'border-[#3e3a46] focus:border-[#fd8925]'
          } rounded-lg text-sm text-white placeholder-[#9d9797] py-2.5 transition-colors outline-none focus:ring-1 focus:ring-[#fd8925]/30 ${
            Icon ? 'pr-10' : 'pr-3.5'
          } ${endAdornment ? 'pl-11' : 'pl-3.5'} ${className}`}
          {...props}
        />

        {endAdornment && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
            {endAdornment}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-[#9d9797] mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
