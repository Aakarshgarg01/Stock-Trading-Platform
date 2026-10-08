import { cn } from '../utils/cn';

export function Card({
  children,
  className,
  title,
  subtitle,
  actions,
  padding = true,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-[#121721] border border-slate-800/80 rounded-xl overflow-hidden shadow-sm transition-all duration-150',
        onClick && 'cursor-pointer hover:border-slate-700/80 hover:bg-[#151c28]',
        className
      )}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60 bg-slate-900/20">
          <div>
            {title && <h3 className="text-sm font-semibold text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(padding ? 'p-5' : '')}>{children}</div>
    </div>
  );
}
