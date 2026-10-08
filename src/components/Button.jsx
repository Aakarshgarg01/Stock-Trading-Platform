import { forwardRef } from 'react';
import { cn } from '../utils/cn';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/20 active:bg-blue-700 focus-visible:ring-blue-500',
  secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 active:bg-slate-900 focus-visible:ring-slate-500 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100',
  success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/20 active:bg-emerald-700 focus-visible:ring-emerald-500',
  danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/20 active:bg-rose-700 focus-visible:ring-rose-500',
  outline: 'border border-slate-700 bg-transparent hover:bg-slate-800/60 text-slate-300 active:bg-slate-800 focus-visible:ring-slate-400',
  ghost: 'bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 focus-visible:ring-slate-400',
};

const sizes = {
  xs: 'px-2 py-1 text-xs gap-1 rounded',
  sm: 'px-3 py-1.5 text-xs font-medium gap-1.5 rounded-md',
  md: 'px-4 py-2 text-sm font-medium gap-2 rounded-lg',
  lg: 'px-5 py-2.5 text-base font-semibold gap-2.5 rounded-lg',
};

export const Button = forwardRef(function Button(
  {
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    type = 'button',
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0B0E14]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
});
