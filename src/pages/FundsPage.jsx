import { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  History,
  ShieldCheck,
} from 'lucide-react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { Table } from '../components/Table';
import { formatINR, formatDateTime } from '../utils/formatters';

const PRESET_AMOUNTS = [10000, 25000, 50000, 100000];

export function FundsPage() {
  const { funds, addFunds, withdrawFunds } = usePortfolioStore();

  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const [depositAmount, setDepositAmount] = useState(25000);
  const [depositMode, setDepositMode] = useState('UPI');
  const [isSubmittingDeposit, setIsSubmittingDeposit] = useState(false);

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);

  const available = funds.availableBalance || 0;
  const used = funds.usedMargin || 0;
  const total = funds.totalBalance || (available + used);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositAmount || depositAmount <= 0) return;
    setIsSubmittingDeposit(true);
    try {
      await addFunds(Number(depositAmount), depositMode);
      setIsAddFundsOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingDeposit(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return;
    setIsSubmittingWithdraw(true);
    try {
      await withdrawFunds(Number(withdrawAmount), 'HDFC Bank (•••• 8921)');
      setIsWithdrawOpen(false);
      setWithdrawAmount('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingWithdraw(false);
    }
  };

  const columns = [
    {
      key: 'type',
      label: 'Type',
      render: (val) => (
        <Badge variant={val === 'DEPOSIT' ? 'success' : 'danger'} size="sm">
          {val === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
        </Badge>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      render: (val, row) => (
        <span className={`font-mono font-bold ${row.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-slate-100'}`}>
          {row.type === 'DEPOSIT' ? `+${formatINR(val)}` : `-${formatINR(val)}`}
        </span>
      ),
    },
    {
      key: 'mode',
      label: 'Payment Method',
      render: (val) => <span className="text-xs text-slate-300">{val}</span>,
    },
    {
      key: 'referenceId',
      label: 'Reference ID',
      render: (val) => <span className="font-mono text-xs text-slate-400">{val}</span>,
    },
    {
      key: 'timestamp',
      label: 'Date & Time',
      render: (val) => <span className="font-mono text-xs text-slate-400">{formatDateTime(val)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <Badge variant={val === 'SUCCESS' ? 'success' : 'warning'} dot size="sm">
          {val === 'SUCCESS' ? 'Completed' : 'Pending'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Funds & Margins
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Deposit trading collateral, request payouts, and check transaction records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<ArrowUpRight className="w-4 h-4" />}
            onClick={() => setIsWithdrawOpen(true)}
          >
            Withdraw
          </Button>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<ArrowDownLeft className="w-4 h-4" />}
            onClick={() => setIsAddFundsOpen(true)}
          >
            Add Funds
          </Button>
        </div>
      </div>

      {/* Margins Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-5 bg-gradient-to-br from-blue-900/20 via-[#121721] to-[#121721] border-blue-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Available for Trading</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-slate-100 tabular-nums">
            {formatINR(available)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Free cash margin ready for fresh orders and positions.
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Used Margin</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">Blocked</span>
          </div>
          <div className="font-mono text-3xl font-bold text-slate-300 tabular-nums">
            {formatINR(used)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Margin locked in open intraday MIS positions & limit brackets.
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Cash Balance</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="font-mono text-3xl font-bold text-slate-100 tabular-nums">
            {formatINR(total)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Total ledger funds verified by clearing corporation.
          </p>
        </Card>
      </div>

      {/* Transaction History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100">Transaction History</h2>
          <span className="text-xs text-slate-400 font-mono">
            {funds.transactions?.length || 0} Recent Operations
          </span>
        </div>

        <Table columns={columns} data={funds.transactions || []} rowKey="id" />
      </div>

      {/* Add Funds Modal */}
      <Modal
        isOpen={isAddFundsOpen}
        onClose={() => setIsAddFundsOpen(false)}
        title="Add Funds to Demat Account"
        subtitle="Zero payment gateway charges. Instant bank credit."
      >
        <form onSubmit={handleDeposit} className="space-y-4">
          <Input
            label="Deposit Amount"
            type="number"
            min="100"
            step="100"
            prefix="₹"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            required
          />

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setDepositAmount(amt)}
                className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700/60"
              >
                +{formatINR(amt)}
              </button>
            ))}
          </div>

          {/* Payment Method selector */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-medium text-slate-400 block">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDepositMode('UPI')}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  depositMode === 'UPI'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                onClick={() => setDepositMode('Net Banking')}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  depositMode === 'Net Banking'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Net Banking</span>
              </button>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-3">
            <Button
              variant="secondary"
              onClick={() => setIsAddFundsOpen(false)}
              disabled={isSubmittingDeposit}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmittingDeposit}
            >
              Deposit {formatINR(depositAmount || 0)}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Withdraw Funds Modal */}
      <Modal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        title="Withdraw Funds"
        subtitle="Funds will be transferred to your registered primary bank account."
      >
        <form onSubmit={handleWithdraw} className="space-y-4">
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs flex justify-between">
            <span className="text-slate-400">Available to Withdraw:</span>
            <span className="font-mono font-bold text-slate-100">{formatINR(available)}</span>
          </div>

          <Input
            label="Withdrawal Amount"
            type="number"
            min="100"
            max={available}
            step="100"
            prefix="₹"
            placeholder="5000"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            required
          />

          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/40 text-xs flex items-center gap-3">
            <Building className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <p className="font-semibold text-slate-200">HDFC Bank Ltd.</p>
              <p className="text-[11px] text-slate-400 font-mono">A/C: ••••••••• 8921 • IFSC: HDFC0000128</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-3">
            <Button
              variant="secondary"
              onClick={() => setIsWithdrawOpen(false)}
              disabled={isSubmittingWithdraw}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!withdrawAmount || Number(withdrawAmount) > available}
              isLoading={isSubmittingWithdraw}
            >
              Confirm Payout
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
export default FundsPage;
