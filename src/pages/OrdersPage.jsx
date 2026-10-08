import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Edit2,
  XCircle,
  CheckCircle2,
  Clock,
  Search,
  AlertTriangle,
} from 'lucide-react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Tabs } from '../components/Tabs';
import { Badge } from '../components/Badge';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { ModifyOrderModal } from '../components/ModifyOrderModal';
import { formatINR, formatDateTime } from '../utils/formatters';
import { cn } from '../utils/cn';

export function OrdersPage() {
  const navigate = useNavigate();
  const { orders, cancelOrder } = usePortfolioStore();

  const [activeTab, setActiveTab] = useState('OPEN');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderToModify, setSelectedOrderToModify] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const openOrders = orders.filter((o) => o.status === 'OPEN');
  const executedOrders = orders.filter((o) => o.status === 'EXECUTED');
  const cancelledOrders = orders.filter((o) => o.status === 'CANCELLED' || o.status === 'REJECTED');

  const tabs = [
    { id: 'OPEN', label: 'Open Orders', count: openOrders.length },
    { id: 'EXECUTED', label: 'Executed', count: executedOrders.length },
    { id: 'CANCELLED', label: 'Cancelled', count: cancelledOrders.length },
  ];

  const currentList =
    activeTab === 'OPEN'
      ? openOrders
      : activeTab === 'EXECUTED'
      ? executedOrders
      : cancelledOrders;

  const filteredOrders = currentList.filter(
    (o) =>
      o.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;
    setIsCancelling(true);
    try {
      await cancelOrder(orderToCancel.id);
      setOrderToCancel(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCancelling(false);
    }
  };

  const columns = [
    {
      key: 'symbol',
      label: 'Instrument',
      sortable: true,
      render: (val, row) => (
        <div
          className="cursor-pointer group"
          onClick={() => navigate(`/stock/${row.symbol}`)}
        >
          <span className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
            {row.symbol}
          </span>
          <span className="text-[10px] text-slate-500 block uppercase font-mono">
            {row.product} • {row.orderType}
          </span>
        </div>
      ),
    },
    {
      key: 'side',
      label: 'Side',
      render: (val) => (
        <Badge variant={val === 'BUY' ? 'success' : 'danger'} size="sm">
          {val}
        </Badge>
      ),
    },
    {
      key: 'quantity',
      label: 'Quantity',
      sortable: true,
      align: 'right',
      render: (val) => <span className="font-mono text-slate-200">{val}</span>,
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      align: 'right',
      render: (val, row) => (
        <span className="font-mono text-slate-100 font-semibold">
          {formatINR(row.executedPrice || val)}
        </span>
      ),
    },
    {
      key: 'placedAt',
      label: 'Time',
      sortable: true,
      render: (val) => (
        <span className="text-xs text-slate-400 font-mono">
          {formatDateTime(val)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        if (val === 'OPEN') {
          return (
            <Badge variant="warning" dot size="sm">
              Open
            </Badge>
          );
        }
        if (val === 'EXECUTED') {
          return (
            <Badge variant="success" dot size="sm">
              Completed
            </Badge>
          );
        }
        return (
          <Badge variant="neutral" size="sm">
            Cancelled
          </Badge>
        );
      },
    },
    ...(activeTab === 'OPEN'
      ? [
          {
            key: 'actions',
            label: 'Actions',
            align: 'right',
            render: (_, row) => (
              <div className="flex items-center justify-end gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  leftIcon={<Edit2 className="w-3 h-3 text-blue-400" />}
                  onClick={() => setSelectedOrderToModify(row)}
                >
                  Modify
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                  leftIcon={<XCircle className="w-3 h-3" />}
                  onClick={() => setOrderToCancel(row)}
                >
                  Cancel
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Order Book
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track, modify, and review your order execution lifecycle.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <Input
            placeholder="Search order ID, symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="text-xs"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Table */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={`No ${activeTab.toLowerCase()} orders`}
          description={
            activeTab === 'OPEN'
              ? 'You have no pending orders waiting in the market orderbook.'
              : `No orders found in the ${activeTab.toLowerCase()} category.`
          }
        />
      ) : (
        <Table columns={columns} data={filteredOrders} rowKey="id" />
      )}

      {/* Modify Modal */}
      {selectedOrderToModify && (
        <ModifyOrderModal
          isOpen={!!selectedOrderToModify}
          onClose={() => setSelectedOrderToModify(null)}
          order={selectedOrderToModify}
        />
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!orderToCancel}
        onClose={() => setOrderToCancel(null)}
        title="Cancel Order"
        subtitle="This action will withdraw the order from the exchange."
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>
              Are you sure you want to cancel order for {orderToCancel?.quantity} {orderToCancel?.symbol} @ {formatINR(orderToCancel?.price)}?
            </span>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="secondary"
              onClick={() => setOrderToCancel(null)}
              disabled={isCancelling}
            >
              Keep Order
            </Button>
            <Button
              variant="danger"
              isLoading={isCancelling}
              onClick={handleConfirmCancel}
            >
              Cancel Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default OrdersPage;
