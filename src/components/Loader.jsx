import { cn } from '../utils/cn';
import { Loader2 } from 'lucide-react';

export function Loader({ text = 'Loading market data...', className, fullScreen = false }) {
  const content = (
    <div className={cn('flex flex-col items-center justify-center p-8 space-y-3', className)}>
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      {text && <p className="text-xs font-medium text-slate-400">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0E14]/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-800/60',
        className
      )}
      {...props}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="w-full rounded-lg border border-slate-800/80 bg-[#121721] p-4 space-y-3">
      <div className="flex gap-4 pb-3 border-b border-slate-800">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-2">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
