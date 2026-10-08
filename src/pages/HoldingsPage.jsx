import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart,
  Search,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { useMarketStore } from '../store/useMarketStore';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { OrderModal } from '../components/OrderModal';
import { formatINR, formatPercent, getPnLColorClass } from '../utils/formatters';
import { cn } from '../utils/cn';

export function HoldingsPage() {
  const navigate = useNavigate();
  const { holdings } = usePortfolioStore();
  const prices = useMarketStore((state) => state.prices);

  const [searchQuery, setSearchQuery] = useState('');
  const [orderModalStock, setOrderModalStock] = useState(null);
  const [orderSide, setOrderSide] = useState('BUY');

  // Compute live holdings data
  const enrichedHoldings = holdings.map((h) => {
    const live = prices[h.symbol] || {};
    const ltp = live.ltp || h.ltp || h.avgPrice;
    const prevClose = live.prevClose || h.prevClose || h.avgPrice;

    const investedVal = h.quantity * h.avgPrice;
    const currentVal = h.quantity * ltp;
    const totalPnL = currentVal - investedVal;
    const totalPnLPercent = investedVal > 0 ? (totalPnL / investedVal) * 100 : 0;

    const dayChange = (ltp - prevClose) * h.quantity;
    const dayChangePercent = prevClose ? ((ltp - prevClose) / prevClose) * 100 : 0;

    return {
      ...h,
      ltp,
      investedVal,
      currentVal,
      totalPnL,
      totalPnLPercent,
      dayChange,
      dayChangePercent,
    };
  });

  const filteredHoldings = enrichedHoldings.filter((h) =>
    h.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Overall totals
  const totalInvested = enrichedHoldings.reduce((acc, h) => acc + h.investedVal, 0);
  const totalCurrent = enrichedHoldings.reduce((acc, h) => acc + h.currentVal, 0);
  const overallPnL = totalCurrent - totalInvested;
  const overallPnLPercent = totalInvested > 0 ? (overallPnL / totalInvested) * 100 : 0;

  const totalDayPnL = enrichedHoldings.reduce((acc, h) => acc + h.dayChange, 0);
  const totalDayPnLPercent = totalInvested > 0 ? (totalDayPnL / totalInvested) * 100 : 0;

  const handleAction = (symbol, side) => {
    setOrderModalStock(symbol);
    setOrderSide(side);
  };

  const columns = [
    {
      key: 'symbol',
      label: 'Instrument',
      sortable: true,
      render: (val) => (
        <div
          className="cursor-pointer group"
          onClick={() => navigate(`/stock/${val}`)}
        >
          <span className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
            {val}
          </span>
          <span className="text-[10px] text-slate-500 block uppercase font-mono">
            CNC • Equity
          </span>
        </div>
      ),
    },
    {
      key: 'quantity',
      label: 'Qty',
      sortable: true,
      align: 'right',
      render: (val) => <span className="font-mono text-slate-200">{val}</span>,
    },
    {
      key: 'avgPrice',
      label: 'Avg. Cost',
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
      key: 'currentVal',
      label: 'Current Value',
      sortable: true,
      align: 'right',
      render: (val) => <span className="font-mono font-semibold text-slate-100">{formatINR(val)}</span>,
    },
    {
      key: 'dayChange',
      label: "Day's P&L",
      sortable: true,
      align: 'right',
      render: (val, row) => (
        <div className={cn('font-mono font-medium', getPnLColorClass(val))}>
          <div>{formatINR(val, true)}</div>
          <div className="text-[10px]">{formatPercent(row.dayChangePercent)}</div>
        </div>
      ),
    },
    {
      key: 'totalPnL',
      label: 'Total P&L',
      sortable: true,
      align: 'right',
      render: (val, row) => (
        <div className={cn('font-mono font-bold', getPnLColorClass(val))}>
          <div>{formatINR(val, true)}</div>
          <div className="text-[10px] font-normal">{formatPercent(row.totalPnLPercent)}</div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="xs"
            variant="success"
            title="Buy more shares"
            onClick={() => handleAction(row.symbol, 'BUY')}
          >
            Add
          </Button>
          <Button
            size="xs"
            variant="danger"
            title="Sell holdings"
            onClick={() => handleAction(row.symbol, 'SELL')}
          >
            Exit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Holdings Portfolio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Long-term delivery equity assets held in your Demat account.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <Input
            placeholder="Search stock in holdings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="text-xs"
          />
        </div>
      </div>

      {/* Portfolio Performance Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs text-slate-400 block font-medium">Total Invested</span>
          <span className="text-xl font-bold font-mono text-slate-100 tabular-nums">
            {formatINR(totalInvested)}
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-xs text-slate-400 block font-medium">Current Valuation</span>
          <span className="text-xl font-bold font-mono text-slate-100 tabular-nums">
            {formatINR(totalCurrent)}
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-xs text-slate-400 block font-medium">Day's Gain/Loss</span>
          <div className={cn('text-xl font-bold font-mono tabular-nums', getPnLColorClass(totalDayPnL))}>
            {formatINR(totalDayPnL, true)}
            <span className="text-xs font-normal ml-1">({formatPercent(totalDayPnLPercent)})</span>
          </div>
        </Card>

        <Card className="p-4">
          <span className="text-xs text-slate-400 block font-medium">Overall Profit/Loss</span>
          <div className={cn('text-xl font-bold font-mono tabular-nums', getPnLColorClass(overallPnL))}>
            {formatINR(overallPnL, true)}
            <span className="text-xs font-normal ml-1">({formatPercent(overallPnLPercent)})</span>
          </div>
        </Card>
      </div>

      {/* Holdings Table */}
      {filteredHoldings.length === 0 ? (
        <EmptyState
          icon={PieChart}
          title="No holdings found"
          description="You do not currently own shares of any stock in your demat portfolio."
          actionText="Buy Stocks from Watchlist"
          onAction={() => navigate('/watchlist')}
        />
      ) : (
        <Table columns={columns} data={filteredHoldings} rowKey="symbol" />
      )}

      {/* Order Modal */}
      {orderModalStock && (
        <OrderModal
          isOpen={!!orderModalStock}
          onClose={() => setOrderModalStock(null)}
          symbol={orderModalStock}
          initialSide={orderSide}
        />
      )}
    </div>
  );
}
export default HoldingsPage;
