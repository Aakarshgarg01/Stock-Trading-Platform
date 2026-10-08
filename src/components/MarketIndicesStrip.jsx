import { useMarketStore } from '../store/useMarketStore';
import { formatNumber, formatPercent } from '../utils/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../utils/cn';

export function MarketIndicesStrip() {
  const indices = useMarketStore((state) => state.indices);
  const indexList = Object.values(indices);

  if (indexList.length === 0) return null;

  return (
    <div className="w-full bg-[#0E121B] border-b border-slate-800/80 px-4 py-2 overflow-x-auto select-none no-scrollbar">
      <div className="flex items-center gap-6 min-w-max">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Market Live
        </span>
        <div className="h-3 w-[1px] bg-slate-800" />

        {indexList.map((idx) => {
          const isUp = (idx.change || 0) >= 0;
          return (
            <div
              key={idx.symbol}
              className={cn(
                'flex items-center gap-2 text-xs transition-colors px-2 py-0.5 rounded',
                idx.tickDirection === 'UP' && 'bg-emerald-500/10',
                idx.tickDirection === 'DOWN' && 'bg-rose-500/10'
              )}
            >
              <span className="font-semibold text-slate-200">{idx.name || idx.symbol}</span>
              <span className="font-mono tabular-nums text-slate-100 font-medium">
                {formatNumber(idx.ltp)}
              </span>
              <span
                className={cn(
                  'flex items-center text-[11px] font-mono font-medium',
                  isUp ? 'text-emerald-400' : 'text-rose-400'
                )}
              >
                {isUp ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                {formatNumber(idx.change, 2)} ({formatPercent(idx.changePercent)})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
