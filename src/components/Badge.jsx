import { cn } from '../utils/cn';

const variants = {
  success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  neutral: 'bg-slate-800 text-slate-300 border border-slate-700/60',
};

const dotColors = {
  success: 'bg-emerald-400',
  danger: 'bg-rose-400',
  warning: 'bg-amber-400',
  info: 'bg-blue-400',
  neutral: 'bg-slate-400',
};

export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className,
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full select-none',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full mr-1.5 shrink-0',
            dotColors[variant]
          )}
        />
      )}
      {children}
    </span>
  );
}
