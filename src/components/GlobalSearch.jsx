import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, TrendingDown, Building2 } from 'lucide-react';
import { stocksApi } from '../api/stocks.api';
import { useDebounce } from '../hooks/useDebounce';
import { formatINR, formatPercent } from '../utils/formatters';
import { cn } from '../utils/cn';

export function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 200);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
      loadSuggestions('');
    }
  }, [isOpen]);

  useEffect(() => {
    loadSuggestions(debouncedQuery);
  }, [debouncedQuery]);

  const loadSuggestions = async (q) => {
    setIsLoading(true);
    try {
      const res = await stocksApi.search(q);
      setResults(res.data || []);
      setSelectedIndex(0);
    } catch (e) {
      console.error('Stock search error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (stock) => {
    if (!stock) return;
    onClose();
    navigate(`/stock/${stock.symbol}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl bg-[#121721] border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/60">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search stocks (e.g. RELIANCE, TCS, INFY) or sector..."
            className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-200 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/40 p-2">
          {isLoading && results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">Searching market...</div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching instruments found for "{query}"
            </div>
          ) : (
            results.map((stock, idx) => {
              const isSelected = idx === selectedIndex;
              const isUp = (stock.ltp - (stock.prevClose || stock.ltp)) >= 0;
              const changePercent = stock.prevClose
                ? ((stock.ltp - stock.prevClose) / stock.prevClose) * 100
                : 0;

              return (
                <div
                  key={stock.symbol}
                  onClick={() => handleSelect(stock)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-lg cursor-pointer transition-colors',
                    isSelected ? 'bg-blue-600/15 border border-blue-500/30' : 'hover:bg-slate-800/50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 text-sm">
                          {stock.symbol}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                          {stock.exchange || 'NSE'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate max-w-[240px]">
                        {stock.name} • {stock.sector}
                      </p>
                    </div>
                  </div>

                  <div className="text-right tabular-nums">
                    <div className="font-mono text-sm font-semibold text-slate-100">
                      {formatINR(stock.ltp)}
                    </div>
                    <div
                      className={cn(
                        'flex items-center justify-end text-xs font-mono font-medium',
                        isUp ? 'text-emerald-400' : 'text-rose-400'
                      )}
                    >
                      {isUp ? (
                        <TrendingUp className="w-3 h-3 mr-0.5" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-0.5" />
                      )}
                      {formatPercent(changePercent)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/40 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 bg-slate-800 rounded mr-1">↑</kbd>
              <kbd className="px-1 py-0.5 bg-slate-800 rounded mr-1">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded mr-1">↵</kbd> Select
            </span>
          </div>
          <span>ApexTrader NSE/BSE Engine</span>
        </div>
      </div>
    </div>
  );
}
