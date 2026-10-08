import { forwardRef } from 'react';
import { cn } from '../utils/cn';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    prefix,
    suffix,
    id,
    className,
    containerClassName,
    disabled = false,
    ...props
  },
  ref
) {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className={cn('w-full flex flex-col space-y-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-slate-400 dark:text-slate-300 select-none flex items-center justify-between"
        >
          <span>{label}</span>
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-slate-500">
            {leftIcon}
          </div>
        )}
        {prefix && (
          <span className="absolute left-3 text-sm font-medium text-slate-400 select-none">
            {prefix}
          </span>
        )}

        <input
          id={inputId}
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full bg-slate-900/60 dark:bg-[#121721] border border-slate-700/80 dark:border-slate-800 text-slate-100 placeholder-slate-500 text-sm rounded-lg px-3.5 py-2 transition-all duration-150',
            'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
            'disabled:opacity-50 disabled:bg-slate-950/40 disabled:cursor-not-allowed',
            leftIcon && 'pl-9',
            prefix && 'pl-8',
            rightIcon && 'pr-9',
            suffix && 'pr-8',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
            className
          )}
          {...props}
        />

        {suffix && (
          <span className="absolute right-3 text-xs font-semibold text-slate-400 select-none uppercase">
            {suffix}
          </span>
        )}
        {rightIcon && (
          <div className="absolute right-3 flex items-center pointer-events-none text-slate-500">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
});
