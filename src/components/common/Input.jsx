import React, { forwardRef, useId } from 'react';

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
    'aria-label': ariaLabel,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`space-y-1.5 text-right ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[#d1cece]">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9d9797] pointer-events-none" aria-hidden="true">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          ref={ref}
          type={type}
          aria-label={label ? undefined : ariaLabel}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
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
        <p id={errorId} role="alert" className="text-xs text-red-400 mt-1">{error}</p>
      ) : helperText ? (
        <p id={helperId} className="text-[11px] text-[#9d9797] mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
