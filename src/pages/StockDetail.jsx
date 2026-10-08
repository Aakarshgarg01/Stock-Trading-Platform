import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Share2,
  BarChart2,
  Activity,
  Layers,
  Info,
} from 'lucide-react';
import { stocksApi } from '../api/stocks.api';
import { useLivePrice } from '../hooks/useLivePrice';
import { useWatchlist } from '../hooks/useWatchlist';
import { StockChart } from '../components/StockChart';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { OrderModal } from '../components/OrderModal';
import { Loader } from '../components/Loader';
import { formatINR, formatNumber, formatPercent, getPnLColorClass } from '../utils/formatters';
import { STOCKS_MAP, POPULAR_STOCKS } from '../constants/stocks';
import { cn } from '../utils/cn';

export function StockDetail() {
  const { symbol: rawSymbol } = useParams();
  const symbol = (rawSymbol || 'RELIANCE').toUpperCase();
  const navigate = useNavigate();

  const [stockInfo, setStockInfo] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [range, setRange] = useState('1D');
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [isLoadingInfo, setIsLoadingInfo] = useState(true);

  // Quick Order Modal
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderSide, setOrderSide] = useState('BUY');

  // Watchlist integration
  const { activeWatchlist, addStock, removeStock } = useWatchlist();
  const isInWatchlist = activeWatchlist?.symbols?.includes(symbol);

  // Live streaming price
  const live = useLivePrice(symbol);

  // Load stock info & initial candles
  useEffect(() => {
    let mounted = true;
    async function fetchStock() {
      setIsLoadingInfo(true);
      try {
        const res = await stocksApi.getStock(symbol);
        if (mounted) {
          setStockInfo(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setIsLoadingInfo(false);
      }
    }
    fetchStock();
    return () => {
      mounted = false;
    };
  }, [symbol]);

  // Load chart history when symbol or timeframe changes
  useEffect(() => {
    let mounted = true;
    async function fetchHistory() {
      setIsLoadingChart(true);
      try {
        const res = await stocksApi.getStockHistory(symbol, range);
        if (mounted) {
          setHistoryData(res.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setIsLoadingChart(false);
      }
    }
    fetchHistory();
    return () => {
      mounted = false;
    };
  }, [symbol, range]);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      removeStock(symbol);
    } else {
      addStock(symbol);
    }
  };

  const handleOpenOrder = (side) => {
    setOrderSide(side);
    setIsOrderModalOpen(true);
  };

  if (isLoadingInfo && !stockInfo) {
    return <Loader text={`Loading ${symbol} market data...`} />;
  }

  const effectiveStock = stockInfo || STOCKS_MAP[symbol] || POPULAR_STOCKS[0];
  const ltp = live.ltp || effectiveStock.ltp;
  const prevClose = live.prevClose || effectiveStock.prevClose;
  const change = ltp - prevClose;
  const changePercent = prevClose ? (change / prevClose) * 100 : 0;
  const isUp = change >= 0;

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
                {symbol}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-slate-800 text-slate-400">
                {effectiveStock.exchange || 'NSE'} • EQ
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                {effectiveStock.sector}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{effectiveStock.name}</p>
          </div>
        </div>

        {/* Action Controls & Watchlist Toggle */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleWatchlistToggle}
            leftIcon={
              isInWatchlist ? (
                <BookmarkCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <Bookmark className="w-4 h-4 text-slate-400" />
              )
            }
          >
            {isInWatchlist ? 'Watchlisted' : 'Watchlist'}
          </Button>
          <Button
            size="sm"
            variant="success"
            className="px-5 font-bold"
            onClick={() => handleOpenOrder('BUY')}
          >
            BUY
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="px-5 font-bold"
            onClick={() => handleOpenOrder('SELL')}
          >
            SELL
          </Button>
        </div>
      </div>

      {/* Real-time Ticker Snapshot Bar */}
      <div
        className={cn(
          'p-4 rounded-xl border border-slate-800 bg-[#121721] flex flex-wrap items-center justify-between gap-4 transition-colors',
          live.flashClass
        )}
      >
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-3xl font-extrabold text-slate-100 tabular-nums">
            {formatINR(ltp)}
          </span>
          <span
            className={cn(
              'flex items-center text-sm font-mono font-bold',
              isUp ? 'text-emerald-400' : 'text-rose-400'
            )}
          >
            {isUp ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {formatINR(change, true)} ({formatPercent(changePercent)})
          </span>
        </div>

        {/* Mini stats badges */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">Open</span>
            <span className="text-slate-200">{formatINR(effectiveStock.open || ltp)}</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">High</span>
            <span className="text-emerald-400">{formatINR(live.high || effectiveStock.high || ltp)}</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">Low</span>
            <span className="text-rose-400">{formatINR(live.low || effectiveStock.low || ltp)}</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">Volume</span>
            <span className="text-slate-200">{formatNumber(live.volume || effectiveStock.volume || 100000, 0)}</span>
          </div>
        </div>
      </div>

      {/* Chart & Key Statistics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Chart (2 cols) */}
        <div className="lg:col-span-2 min-h-[460px]">
          <StockChart
            symbol={symbol}
            historyData={historyData}
            currentRange={range}
            onRangeChange={setRange}
            isLoading={isLoadingChart}
          />
        </div>

        {/* Key Statistics & Fundamentals (1 col) */}
        <div className="space-y-6">
          <Card title="Key Statistics" subtitle="NSE Trading Session Metrics">
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Previous Close</span>
                <span className="font-mono font-medium text-slate-200">
                  {formatINR(prevClose)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Day's Range</span>
                <span className="font-mono font-medium text-slate-200">
                  {formatINR(live.low || effectiveStock.low)} - {formatINR(live.high || effectiveStock.high)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">52 Week High</span>
                <span className="font-mono font-medium text-emerald-400">
                  {formatINR(effectiveStock.week52High || ltp * 1.15)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">52 Week Low</span>
                <span className="font-mono font-medium text-rose-400">
                  {formatINR(effectiveStock.week52Low || ltp * 0.85)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Market Capitalization</span>
                <span className="font-mono font-medium text-slate-200">
                  {effectiveStock.marketCap || '₹5.4 Lakh Cr'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">P/E Ratio (TTM)</span>
                <span className="font-mono font-medium text-slate-200">
                  {effectiveStock.pe || '24.5'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Tick Size</span>
                <span className="font-mono font-medium text-slate-200">₹0.05</span>
              </div>
            </div>
          </Card>

          {/* Quick Trade Trigger Card */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-slate-900/60 border-blue-500/20 p-5">
            <h3 className="text-sm font-bold text-slate-100 mb-1">Direct Execution</h3>
            <p className="text-xs text-slate-400 mb-4">
              Place instant market orders or set limit price bracket orders.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="success"
                className="w-full font-bold"
                onClick={() => handleOpenOrder('BUY')}
              >
                Buy {symbol}
              </Button>
              <Button
                variant="danger"
                className="w-full font-bold"
                onClick={() => handleOpenOrder('SELL')}
              >
                Sell {symbol}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        symbol={symbol}
        initialSide={orderSide}
      />
    </div>
  );
}
export default StockDetail;
