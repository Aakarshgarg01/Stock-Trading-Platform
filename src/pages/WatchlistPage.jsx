import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Search,
  ExternalLink,
  ShoppingBag,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';
import { useLivePrice } from '../hooks/useLivePrice';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { OrderModal } from '../components/OrderModal';
import { GlobalSearch } from '../components/GlobalSearch';
import { formatINR, formatPercent } from '../utils/formatters';
import { cn } from '../utils/cn';

function WatchlistStockItem({ item, onRemove, onBuy, onSell }) {
  const navigate = useNavigate();
  const live = useLivePrice(item.symbol);

  const ltp = live.ltp || item.ltp;
  const change = live.change ?? item.change;
  const changePercent = live.changePercent ?? item.changePercent;
  const isUp = (change || 0) >= 0;

  return (
    <div
      className={cn(
        'group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-800/80 bg-[#121721] hover:border-slate-700 hover:bg-[#151c28] transition-all duration-150 gap-3 cursor-pointer',
        live.flashClass
      )}
      onClick={() => navigate(`/stock/${item.symbol}`)}
    >
      {/* Left: Symbol & Company */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          {item.symbol.slice(0, 2)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-100 group-hover:text-blue-400 transition-colors">
              {item.symbol}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-400">
              {item.exchange || 'NSE'}
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-xs">
            {item.name}
          </p>
        </div>
      </div>

      {/* Middle: Key stats (Volume / 52W range) */}
      <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
        <div>
          <span className="text-[10px] uppercase text-slate-500 block">Day Range</span>
          <span className="font-mono text-slate-300">
            {formatINR(live.low || item.low || 0)} - {formatINR(live.high || item.high || 0)}
          </span>
        </div>
      </div>

      {/* Right: Live Price & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-4">
        <div className="text-right tabular-nums">
          <div className="font-mono text-base font-bold text-slate-100">
            {formatINR(ltp)}
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
            {formatINR(change, true)} ({formatPercent(changePercent)})
          </div>
        </div>

        {/* Quick action buttons (Buy/Sell/Remove) */}
        <div
          className="flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="xs"
            variant="success"
            onClick={() => onBuy(item.symbol)}
            title="Buy this stock"
          >
            B
          </Button>
          <Button
            size="xs"
            variant="danger"
            onClick={() => onSell(item.symbol)}
            title="Sell this stock"
          >
            S
          </Button>
          <button
            onClick={() => onRemove(item.symbol)}
            className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
            title="Remove from watchlist"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function WatchlistPage() {
  const {
    watchlists,
    activeWatchlist,
    activeWatchlistId,
    items,
    setActiveWatchlist,
    removeStock,
    createWatchlist,
  } = useWatchlist();

  const [filterQuery, setFilterQuery] = useState('');
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isNewWatchlistModalOpen, setIsNewWatchlistModalOpen] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');

  // Order modal state
  const [orderSymbol, setOrderSymbol] = useState(null);
  const [orderSide, setOrderSide] = useState('BUY');

  const handleCreateWatchlist = async (e) => {
    e.preventDefault();
    if (!newWatchlistName.trim()) return;
    await createWatchlist(newWatchlistName.trim());
    setNewWatchlistName('');
    setIsNewWatchlistModalOpen(false);
  };

  const filteredItems = items.filter(
    (item) =>
      item.symbol.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.name?.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and Watchlists selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Live Watchlist
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time streaming prices with tick-level green/red flashes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<PlusCircle className="w-4 h-4 text-slate-400" />}
            onClick={() => setIsNewWatchlistModalOpen(true)}
          >
            New List
          </Button>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddStockOpen(true)}
          >
            Add Symbol
          </Button>
        </div>
      </div>

      {/* Watchlist Tabs Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar gap-4">
        <div className="flex items-center gap-2">
          {watchlists.map((wl) => {
            const isActive = wl.id === activeWatchlistId;
            return (
              <button
                key={wl.id}
                onClick={() => setActiveWatchlist(wl.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all select-none',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800'
                )}
              >
                {wl.name}
                <span className="ml-1.5 opacity-60">({wl.symbols?.length || 0})</span>
              </button>
            );
          })}
        </div>

        {/* Local Filter Input */}
        <div className="w-48 sm:w-64">
          <Input
            placeholder="Filter list..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            leftIcon={<Search className="w-3.5 h-3.5" />}
            className="py-1 text-xs"
          />
        </div>
      </div>

      {/* Stocks List */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title="Watchlist is empty"
          description="Add your favorite stocks to track live prices and quick-trade."
          actionText="Add Symbol Now"
          onAction={() => setIsAddStockOpen(true)}
        />
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <WatchlistStockItem
              key={item.symbol}
              item={item}
              onRemove={(sym) => removeStock(sym)}
              onBuy={(sym) => {
                setOrderSymbol(sym);
                setOrderSide('BUY');
              }}
              onSell={(sym) => {
                setOrderSymbol(sym);
                setOrderSide('SELL');
              }}
            />
          ))}
        </div>
      )}

      {/* Add Symbol Modal (GlobalSearch) */}
      <GlobalSearch
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
      />

      {/* New Watchlist Modal */}
      <Modal
        isOpen={isNewWatchlistModalOpen}
        onClose={() => setIsNewWatchlistModalOpen(false)}
        title="Create New Watchlist"
        subtitle="Organize stocks by sector, strategy, or index."
      >
        <form onSubmit={handleCreateWatchlist} className="space-y-4">
          <Input
            label="Watchlist Name"
            placeholder="e.g. Banking Stocks, Breakouts..."
            value={newWatchlistName}
            onChange={(e) => setNewWatchlistName(e.target.value)}
            required
            autoFocus
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="secondary"
              onClick={() => setIsNewWatchlistModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Watchlist
            </Button>
          </div>
        </form>
      </Modal>

      {/* Order Placement Modal */}
      {orderSymbol && (
        <OrderModal
          isOpen={!!orderSymbol}
          onClose={() => setOrderSymbol(null)}
          symbol={orderSymbol}
          initialSide={orderSide}
        />
      )}
    </div>
  );
}
export default WatchlistPage;
