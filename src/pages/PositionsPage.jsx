import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowRight, Search, AlertCircle, XCircle } from 'lucide-react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { useMarketStore } from '../store/useMarketStore';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { formatINR, formatPercent, getPnLColorClass } from '../utils/formatters';
import { cn } from '../utils/cn';

export function PositionsPage() {
  const navigate = useNavigate();
  const { positions, placeOrder } = usePortfolioStore();
  const prices = useMarketStore((state) => state.prices);

  const [searchQuery, setSearchQuery] = useState('');
  const [positionToExit, setPositionToExit] = useState(null);
  const [isExiting, setIsExiting] = useState(false);

  // Compute live position valuations
  const enrichedPositions = positions.map((pos) => {
    const live = prices[pos.symbol] || {};
    const ltp = live.ltp || pos.ltp || pos.avgPrice;
    const prevClose = live.prevClose || pos.prevClose || pos.avgPrice;

    const pnl =
      pos.side === 'BUY'
        ? (ltp - pos.avgPrice) * pos.quantity
        : (pos.avgPrice - ltp) * pos.quantity;

    const pnlPercent = ((ltp - pos.avgPrice) / pos.avgPrice) * 100 * (pos.side === 'BUY' ? 1 : -1);

    const dayChange = (ltp - prevClose) * (pos.side === 'BUY' ? 1 : -1);
    const dayChangePercent = prevClose ? ((ltp - prevClose) / prevClose) * 100 : 0;

    return {
      ...pos,
      ltp,
      pnl,
      pnlPercent,
      dayChange,
      dayChangePercent,
    };
  });

  const filteredPositions = enrichedPositions.filter((p) =>
    p.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnrealizedPnL = enrichedPositions.reduce((acc, p) => acc + p.pnl, 0);

  const handleConfirmExit = async () => {
    if (!positionToExit) return;
    setIsExiting(true);
    try {
      // Placing counter market order to exit
      const exitSide = positionToExit.side === 'BUY' ? 'SELL' : 'BUY';
      await placeOrder({
        symbol: positionToExit.symbol,
        side: exitSide,
        orderType: 'MARKET',
        product: positionToExit.product,
        quantity: positionToExit.quantity,
        price: positionToExit.ltp,
      });
      setPositionToExit(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExiting(false);
    }
  };

  const columns = [
    {
      key: 'product',
      label: 'Product',
      render: (val) => (
        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
          {val}
        </span>
      ),
    },
    {
      key: 'symbol',
      label: 'Instrument',
      sortable: true,
      render: (val) => (
        <span
          onClick={() => navigate(`/stock/${val}`)}
          className="font-bold text-slate-100 hover:text-blue-400 transition-colors cursor-pointer"
        >
          {val}
        </span>
      ),
    },
    {
      key: 'quantity',
      label: 'Net Qty',
      sortable: true,
      align: 'right',
      render: (val, row) => (
        <span className={cn('font-mono font-semibold', row.side === 'BUY' ? 'text-emerald-400' : 'text-rose-400')}>
          {row.side === 'BUY' ? `+${val}` : `-${val}`}
        </span>
      ),
    },
    {
      key: 'avgPrice',
      label: 'Avg. Price',
      sortable: true,
      align: 'right',
      render: (val) => <span className="font-mono text-slate-300">{formatINR(val)}</span>,
    },
    {
      key: 'ltp',
      label: 'LTP',
      sortable: true,
      align: 'right',
      render: (val) => <span className="font-mono font-bold text-slate-100">{formatINR(val)}</span>,
    },
    {
      key: 'pnl',
      label: 'P&L (Unrealized)',
      sortable: true,
      align: 'right',
      render: (val, row) => (
        <div className={cn('font-mono font-bold', getPnLColorClass(val))}>
          <div>{formatINR(val, true)}</div>
          <div className="text-[10px] font-normal">{formatPercent(row.pnlPercent)}</div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      align: 'right',
      render: (_, row) => (
        <Button
          size="xs"
          variant="outline"
          className="hover:border-rose-500 hover:text-rose-400"
          onClick={() => setPositionToExit(row)}
        >
          Exit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Positions (F&O / MIS)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time open intraday contracts and unrealized gain/loss.
          </p>
        </div>

        {/* Quick summary badge */}
        <div className="flex items-center gap-4 p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-400 block font-semibold">Total P&L</span>
            <span className={cn('text-base font-bold font-mono', getPnLColorClass(totalUnrealizedPnL))}>
              {formatINR(totalUnrealizedPnL, true)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="w-64">
          <Input
            placeholder="Search symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="text-xs"
          />
        </div>
      </div>

      {/* Table */}
      {filteredPositions.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No open positions"
          description="You currently have no open intraday (MIS) or derivative positions."
          actionText="Find Stocks in Watchlist"
          onAction={() => navigate('/watchlist')}
        />
      ) : (
        <Table columns={columns} data={filteredPositions} rowKey="id" />
      )}

      {/* Exit Position Modal */}
      <Modal
        isOpen={!!positionToExit}
        onClose={() => setPositionToExit(null)}
        title={`Square Off ${positionToExit?.symbol}`}
        subtitle={`Square-off ${positionToExit?.quantity} shares at prevailing market price`}
      >
        <div className="space-y-4">
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Position:</span>
              <span className="text-slate-200 font-semibold">{positionToExit?.side} {positionToExit?.quantity} Qty</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Current LTP:</span>
              <span className="font-mono text-slate-200">{formatINR(positionToExit?.ltp || 0)}</span>
            </div>
            <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-1.5">
              <span>Net P&L upon exit:</span>
              <span className={cn('font-mono font-bold', getPnLColorClass(positionToExit?.pnl || 0))}>
                {formatINR(positionToExit?.pnl || 0, true)}
              </span>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="secondary"
              onClick={() => setPositionToExit(null)}
              disabled={isExiting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={isExiting}
              onClick={handleConfirmExit}
            >
              Confirm Square Off
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default PositionsPage;
