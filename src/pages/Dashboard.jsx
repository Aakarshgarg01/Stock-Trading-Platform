import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  ChevronRight,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { useMarketStore } from '../store/useMarketStore';
import { formatINR, formatPercent, getPnLColorClass } from '../utils/formatters';
import { OrderModal } from '../components/OrderModal';
import { POPULAR_STOCKS } from '../constants/stocks';
import { cn } from '../utils/cn';

export function Dashboard() {
  const navigate = useNavigate();
  const { holdings, positions, funds, isLoading } = usePortfolioStore();
  const prices = useMarketStore((state) => state.prices);

  const [orderModalStock, setOrderModalStock] = useState(null);
  const [orderSide, setOrderSide] = useState('BUY');

  // Compute live portfolio metrics
  const totalInvestment = holdings.reduce(
    (acc, h) => acc + h.quantity * h.avgPrice,
    0
  );

  const currentHoldingsValue = holdings.reduce((acc, h) => {
    const liveLtp = prices[h.symbol]?.ltp || h.ltp || h.avgPrice;
    return acc + h.quantity * liveLtp;
  }, 0);

  const totalPnL = currentHoldingsValue - totalInvestment;
  const totalPnLPercent = totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

  const dayPnL = holdings.reduce((acc, h) => {
    const live = prices[h.symbol] || {};
    const liveLtp = live.ltp || h.ltp || h.avgPrice;
    const prevClose = live.prevClose || h.prevClose || h.avgPrice;
    return acc + h.quantity * (liveLtp - prevClose);
  }, 0);
  const dayPnLPercent = totalInvestment > 0 ? (dayPnL / totalInvestment) * 100 : 0;

  // Compute Top Gainers and Losers across stocks
  const allStocksWithLive = POPULAR_STOCKS.map((stock) => {
    const live = prices[stock.symbol] || {};
    const ltp = live.ltp || stock.ltp;
    const prevClose = live.prevClose || stock.prevClose;
    const change = ltp - prevClose;
    const changePercent = prevClose ? (change / prevClose) * 100 : 0;
    return {
      ...stock,
      ltp,
      change,
      changePercent,
    };
  });

  const sortedGainers = [...allStocksWithLive].sort((a, b) => b.changePercent - a.changePercent).slice(0, 4);
  const sortedLosers = [...allStocksWithLive].sort((a, b) => a.changePercent - b.changePercent).slice(0, 4);

  const handleQuickOrder = (symbol, side) => {
    setOrderModalStock(symbol);
    setOrderSide(side);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Market Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time portfolio overview, P&L analytics, and market movers.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link to="/funds">
            <Button size="sm" variant="outline" leftIcon={<Wallet className="w-3.5 h-3.5" />}>
              Add Funds
            </Button>
          </Link>
          <Link to="/watchlist">
            <Button size="sm" variant="primary" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Explore Watchlist
            </Button>
          </Link>
        </div>
      </div>

      {/* Portfolio Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Portfolio Value */}
        <Card className="p-5 relative overflow-hidden bg-gradient-to-br from-[#121721] to-[#161D2B]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Portfolio Value</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-slate-100 tabular-nums">
            {formatINR(currentHoldingsValue + (funds.availableBalance || 0))}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/60">
            <span>Invested:</span>
            <span className="font-mono font-medium text-slate-300">{formatINR(totalInvestment)}</span>
          </div>
        </Card>

        {/* Day P&L */}
        <Card className="p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's P&L</span>
            <div className={cn('p-2 rounded-lg', dayPnL >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400')}>
              {dayPnL >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </div>
          </div>
          <div className={cn('font-mono text-2xl font-bold tabular-nums', getPnLColorClass(dayPnL))}>
            {formatINR(dayPnL, true)}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-800/60">
            <span className="text-slate-400">Day Return:</span>
            <span className={cn('font-mono font-semibold', getPnLColorClass(dayPnL))}>
              {formatPercent(dayPnLPercent)}
            </span>
          </div>
        </Card>

        {/* Overall Total P&L */}
        <Card className="p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total P&L</span>
            <div className={cn('p-2 rounded-lg', totalPnL >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400')}>
              {totalPnL >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            </div>
          </div>
          <div className={cn('font-mono text-2xl font-bold tabular-nums', getPnLColorClass(totalPnL))}>
            {formatINR(totalPnL, true)}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-800/60">
            <span className="text-slate-400">Total ROI:</span>
            <span className={cn('font-mono font-semibold', getPnLColorClass(totalPnL))}>
              {formatPercent(totalPnLPercent)}
            </span>
          </div>
        </Card>

        {/* Available Trading Margin */}
        <Card className="p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Available Cash</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-slate-100 tabular-nums">
            {formatINR(funds.availableBalance || 0)}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/60">
            <span>Used Margin:</span>
            <span className="font-mono font-medium text-slate-300">{formatINR(funds.usedMargin || 0)}</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Holdings Snapshot + Market Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings Summary (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Portfolio Holdings Summary"
            subtitle={`${holdings.length} Active Demat stocks`}
            actions={
              <Link to="/holdings" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider pb-2">
                    <th className="pb-2.5">Stock</th>
                    <th className="pb-2.5 text-right">Qty</th>
                    <th className="pb-2.5 text-right">Avg. Price</th>
                    <th className="pb-2.5 text-right">LTP</th>
                    <th className="pb-2.5 text-right">Cur. Value</th>
                    <th className="pb-2.5 text-right">P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {holdings.slice(0, 5).map((h) => {
                    const live = prices[h.symbol] || {};
                    const ltp = live.ltp || h.ltp || h.avgPrice;
                    const curVal = h.quantity * ltp;
                    const pnl = curVal - (h.quantity * h.avgPrice);
                    const pnlPercent = ((ltp - h.avgPrice) / h.avgPrice) * 100;

                    return (
                      <tr
                        key={h.symbol}
                        onClick={() => navigate(`/stock/${h.symbol}`)}
                        className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                      >
                        <td className="py-3">
                          <span className="font-bold text-slate-100 hover:text-blue-400 transition-colors">
                            {h.symbol}
                          </span>
                        </td>
                        <td className="py-3 text-right font-mono text-slate-300">{h.quantity}</td>
                        <td className="py-3 text-right font-mono text-slate-300">{formatINR(h.avgPrice)}</td>
                        <td className="py-3 text-right font-mono font-semibold text-slate-100">{formatINR(ltp)}</td>
                        <td className="py-3 text-right font-mono text-slate-200">{formatINR(curVal)}</td>
                        <td className={cn('py-3 text-right font-mono font-semibold', getPnLColorClass(pnl))}>
                          <div>{formatINR(pnl, true)}</div>
                          <div className="text-[10px] font-normal">{formatPercent(pnlPercent)}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Intraday Positions Preview */}
          <Card
            title="Open Positions"
            subtitle={`${positions.length} Active Intraday Contracts`}
            actions={
              <Link to="/positions" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium">
                View Positions <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            {positions.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">No open intraday positions.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {positions.map((pos) => {
                  const live = prices[pos.symbol] || {};
                  const ltp = live.ltp || pos.ltp || pos.avgPrice;
                  const pnl = pos.side === 'BUY'
                    ? (ltp - pos.avgPrice) * pos.quantity
                    : (pos.avgPrice - ltp) * pos.quantity;

                  return (
                    <div
                      key={pos.id}
                      onClick={() => navigate(`/stock/${pos.symbol}`)}
                      className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-200">{pos.symbol}</span>
                        <Badge variant={pos.side === 'BUY' ? 'success' : 'danger'} size="sm">
                          {pos.side}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-slate-400 flex justify-between mt-1">
                        <span>Qty: {pos.quantity}</span>
                        <span className="font-mono">Avg: {formatINR(pos.avgPrice)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase">P&L</span>
                        <span className={cn('text-xs font-mono font-bold', getPnLColorClass(pnl))}>
                          {formatINR(pnl, true)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right Col: Top Gainers & Top Losers */}
        <div className="space-y-6">
          {/* Top Gainers */}
          <Card title="Top Gainers (NIFTY)" subtitle="Highest percentage gainers today">
            <div className="space-y-2.5">
              {sortedGainers.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/stock/${stock.symbol}`)}
                >
                  <div>
                    <div className="font-bold text-xs text-slate-100 group-hover:text-blue-400 transition-colors">
                      {stock.symbol}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                      {stock.name}
                    </div>
                  </div>
                  <div className="text-right tabular-nums">
                    <div className="font-mono text-xs font-semibold text-slate-100">
                      {formatINR(stock.ltp)}
                    </div>
                    <div className="font-mono text-xs font-semibold text-emerald-400 flex items-center justify-end">
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                      {formatPercent(stock.changePercent)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Losers */}
          <Card title="Top Losers (NIFTY)" subtitle="Stocks with major declines today">
            <div className="space-y-2.5">
              {sortedLosers.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/stock/${stock.symbol}`)}
                >
                  <div>
                    <div className="font-bold text-xs text-slate-100 group-hover:text-blue-400 transition-colors">
                      {stock.symbol}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                      {stock.name}
                    </div>
                  </div>
                  <div className="text-right tabular-nums">
                    <div className="font-mono text-xs font-semibold text-slate-100">
                      {formatINR(stock.ltp)}
                    </div>
                    <div className="font-mono text-xs font-semibold text-rose-400 flex items-center justify-end">
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                      {formatPercent(stock.changePercent)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

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
export default Dashboard;
