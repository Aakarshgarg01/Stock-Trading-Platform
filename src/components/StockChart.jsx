import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
import { useThemeStore } from '../store/useThemeStore';
import { TIMEFRAMES } from '../constants/orderTypes';
import { BarChart3, LineChart as LineIcon } from 'lucide-react';
import { cn } from '../utils/cn';

export function StockChart({
  symbol,
  historyData = [],
  currentRange = '1D',
  onRangeChange,
  isLoading = false,
}) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);

  const [chartType, setChartType] = useState('candlestick'); // 'candlestick' | 'line'
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const isDark = theme === 'dark';
    const bgColor = isDark ? '#121721' : '#FFFFFF';
    const textColor = isDark ? '#94A3B8' : '#475569';
    const gridColor = isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(226, 232, 240, 0.8)';

    // Cleanup previous chart instance if exists
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: bgColor },
        textColor: textColor,
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: isDark ? '#1E293B' : '#E2E8F0',
        scaleMargins: {
          top: 0.1,
          bottom: 0.25,
        },
      },
      timeScale: {
        borderColor: isDark ? '#1E293B' : '#E2E8F0',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: true,
      handleScale: true,
    });

    chartRef.current = chart;

    // Volume histogram on bottom
    const volumeSeries = chart.addHistogramSeries({
      color: '#3B82F6',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // overlay
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
    volumeSeriesRef.current = volumeSeries;

    // Main Price series
    let mainSeries;
    if (chartType === 'candlestick') {
      mainSeries = chart.addCandlestickSeries({
        upColor: '#10B981',
        downColor: '#F43F5E',
        borderUpColor: '#10B981',
        borderDownColor: '#F43F5E',
        wickUpColor: '#10B981',
        wickDownColor: '#F43F5E',
      });
    } else {
      mainSeries = chart.addAreaSeries({
        topColor: 'rgba(59, 130, 246, 0.4)',
        bottomColor: 'rgba(59, 130, 246, 0.02)',
        lineColor: '#3B82F6',
        lineWidth: 2,
      });
    }
    seriesRef.current = mainSeries;

    // Handle Resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight || 420,
        });
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(chartContainerRef.current);
    handleResize();

    return () => {
      resizeObserver.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [theme, chartType]);

  // Update data when historyData changes
  useEffect(() => {
    if (!seriesRef.current || !volumeSeriesRef.current || historyData.length === 0) return;

    try {
      if (chartType === 'candlestick') {
        const candleData = historyData.map((d) => ({
          time: d.time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }));
        seriesRef.current.setData(candleData);
      } else {
        const lineData = historyData.map((d) => ({
          time: d.time,
          value: d.close || d.value,
        }));
        seriesRef.current.setData(lineData);
      }

      // Volume series data
      const volData = historyData.map((d) => ({
        time: d.time,
        value: d.volume,
        color: (d.close >= d.open) ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)',
      }));
      volumeSeriesRef.current.setData(volData);

      chartRef.current?.timeScale().fitContent();
    } catch (e) {
      console.warn('Error setting chart data:', e);
    }
  }, [historyData, chartType]);

  return (
    <div className="flex flex-col h-full w-full bg-[#121721] rounded-xl border border-slate-800/80 overflow-hidden">
      {/* Chart Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/40 gap-3">
        {/* Timeframe selector */}
        <div className="flex items-center bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.value}
              onClick={() => onRangeChange && onRangeChange(tf.value)}
              className={cn(
                'px-3 py-1 rounded text-xs font-semibold transition-all select-none',
                currentRange === tf.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              )}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Chart type toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950/60 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setChartType('candlestick')}
              title="Candlestick Chart"
              className={cn(
                'p-1.5 rounded transition-all',
                chartType === 'candlestick'
                  ? 'bg-slate-800 text-blue-400'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('line')}
              title="Area Line Chart"
              className={cn(
                'p-1.5 rounded transition-all',
                chartType === 'line'
                  ? 'bg-slate-800 text-blue-400'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              <LineIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative flex-1 w-full min-h-[380px]">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#121721]/60 backdrop-blur-[1px]">
            <span className="text-xs font-medium text-slate-400 animate-pulse">
              Loading chart candles...
            </span>
          </div>
        )}
        <div ref={chartContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
