import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { formatINR } from '../utils/formatters';

export function ModifyOrderModal({ isOpen, onClose, order }) {
  const { modifyOrder } = usePortfolioStore();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      setQuantity(order.quantity);
      setPrice(order.price);
    }
  }, [order]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!order) return;
    setIsSubmitting(true);
    try {
      await modifyOrder(order.id, {
        quantity: Number(quantity),
        price: Number(price),
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Modify Order #${order.id.slice(-6)}`}
      subtitle={`${order.side} ${order.symbol} (${order.orderType})`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <Input
            label="Limit Price"
            type="number"
            step="0.05"
            prefix="₹"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs flex justify-between text-slate-300">
          <span>New Total Value:</span>
          <span className="font-mono font-semibold text-slate-100">
            {formatINR((Number(quantity) || 0) * (Number(price) || 0))}
          </span>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="w-1/2" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="w-1/2" isLoading={isSubmitting}>
            Update Order
          </Button>
        </div>
      </form>
    </Modal>
  );
}
