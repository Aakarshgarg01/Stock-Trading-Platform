import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { useLivePrice } from '../hooks/useLivePrice';
import { formatINR } from '../utils/formatters';
import { ORDER_SIDES, ORDER_TYPES, PRODUCT_TYPES } from '../constants/orderTypes';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { cn } from '../utils/cn';

const orderSchema = z.object({
  side: z.enum(['BUY', 'SELL']),
  orderType: z.enum(['MARKET', 'LIMIT']),
  product: z.enum(['CNC', 'MIS']),
  quantity: z.coerce.number().int().positive('Quantity must be at least 1'),
  price: z.coerce.number().positive('Price must be greater than 0'),
});

export function OrderModal({ isOpen, onClose, symbol, initialSide = 'BUY' }) {
  const live = useLivePrice(symbol);
  const { funds, placeOrder } = usePortfolioStore();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      side: initialSide,
      orderType: 'MARKET',
      product: 'CNC',
      quantity: 1,
      price: live?.ltp || 100,
    },
  });

  const side = watch('side');
  const orderType = watch('orderType');
  const product = watch('product');
  const quantity = watch('quantity') || 0;
  const price = watch('price') || 0;

  useEffect(() => {
    if (isOpen) {
      setIsConfirming(false);
      reset({
        side: initialSide,
        orderType: 'MARKET',
        product: 'CNC',
        quantity: 1,
        price: live?.ltp || 100,
      });
    }
  }, [isOpen, initialSide, live?.ltp, reset]);

  // If MARKET order, keep price in sync with live LTP
  useEffect(() => {
    if (orderType === 'MARKET' && live?.ltp) {
      setValue('price', live.ltp);
    }
  }, [live?.ltp, orderType, setValue]);

  const effectivePrice = orderType === 'MARKET' ? (live?.ltp || price) : price;
  const estimatedTotal = (Number(quantity) || 0) * (Number(effectivePrice) || 0);
  const marginRequired = product === 'MIS' ? estimatedTotal * 0.2 : estimatedTotal; // 5x leverage on intraday
  const availableFunds = funds.availableBalance || 0;
  const hasSufficientFunds = side === 'SELL' || availableFunds >= marginRequired;

  const onFormSubmit = (data) => {
    if (side === 'BUY' && !hasSufficientFunds) {
      return;
    }
    // Proceed to confirmation step
    setIsConfirming(true);
  };

  const executeOrder = async () => {
    setIsSubmitting(true);
    try {
      await placeOrder({
        symbol,
        side,
        orderType,
        product,
        quantity: Number(quantity),
        price: Number(effectivePrice),
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${side} ${symbol}`}
      subtitle={`NSE Equity • LTP: ${formatINR(live?.ltp || 0)}`}
      maxWidth="max-w-md"
    >
      {!isConfirming ? (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* BUY / SELL Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/80 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setValue('side', 'BUY')}
              className={cn(
                'py-2 rounded-md font-semibold text-xs tracking-wider transition-all select-none',
                side === 'BUY'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              BUY
            </button>
            <button
              type="button"
              onClick={() => setValue('side', 'SELL')}
              className={cn(
                'py-2 rounded-md font-semibold text-xs tracking-wider transition-all select-none',
                side === 'SELL'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              SELL
            </button>
          </div>

          {/* Product Type (CNC vs MIS) */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400 font-medium">Product:</span>
            <div className="flex items-center gap-2">
              <label className={cn(
                'px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors',
                product === 'CNC'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400'
              )}>
                <input
                  type="radio"
                  value="CNC"
                  {...register('product')}
                  className="sr-only"
                />
                Longterm (CNC)
              </label>
              <label className={cn(
                'px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors',
                product === 'MIS'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400'
              )}>
                <input
                  type="radio"
                  value="MIS"
                  {...register('product')}
                  className="sr-only"
                />
                Intraday (MIS 5x)
              </label>
            </div>
          </div>

          {/* Order Type (Market vs Limit) */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Order Type:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setValue('orderType', 'MARKET')}
                className={cn(
                  'px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors',
                  orderType === 'MARKET'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400'
                )}
              >
                Market
              </button>
              <button
                type="button"
                onClick={() => setValue('orderType', 'LIMIT')}
                className={cn(
                  'px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors',
                  orderType === 'LIMIT'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400'
                )}
              >
                Limit
              </button>
            </div>
          </div>

          {/* Quantity & Price Fields */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Input
              label="Quantity"
              type="number"
              min="1"
              step="1"
              error={errors.quantity?.message}
              {...register('quantity')}
            />
            <Input
              label={orderType === 'MARKET' ? 'Market Price' : 'Limit Price'}
              type="number"
              step="0.05"
              disabled={orderType === 'MARKET'}
              prefix="₹"
              error={errors.price?.message}
              {...register('price')}
            />
          </div>

          {/* Margin & Funds Calculation Box */}
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Required Margin:</span>
              <span className="font-mono text-slate-200 font-semibold">{formatINR(marginRequired)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Available Cash:</span>
              <span className="font-mono text-slate-200">{formatINR(availableFunds)}</span>
            </div>

            {side === 'BUY' && !hasSufficientFunds && (
              <div className="flex items-center gap-1.5 text-rose-400 font-medium pt-1 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Insufficient funds to place this order</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            type="submit"
            variant={side === 'BUY' ? 'success' : 'danger'}
            className="w-full py-2.5 font-semibold"
            disabled={side === 'BUY' && !hasSufficientFunds}
          >
            Review {side} Order
          </Button>
        </form>
      ) : (
        /* Step 2: Confirmation Step */
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs text-slate-400">Action</span>
              <span className={cn('text-xs font-bold px-2 py-0.5 rounded', side === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400')}>
                {side}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Instrument</span>
              <span className="text-xs font-semibold text-slate-200">{symbol}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Quantity</span>
              <span className="text-xs font-mono font-medium text-slate-200">{quantity} shares</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Order & Product</span>
              <span className="text-xs font-mono text-slate-200">{orderType} • {product}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 pt-2">
              <span className="text-xs font-medium text-slate-300">Estimated Total</span>
              <span className="text-sm font-bold font-mono text-slate-100">{formatINR(marginRequired)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="w-1/2"
              onClick={() => setIsConfirming(false)}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button
              variant={side === 'BUY' ? 'success' : 'danger'}
              className="w-1/2"
              isLoading={isSubmitting}
              onClick={executeOrder}
            >
              Confirm {side}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
