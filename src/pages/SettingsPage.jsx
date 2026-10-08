import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  User,
  Shield,
  Sun,
  Moon,
  Lock,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Mail,
  Phone,
  CreditCard,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { mockDb } from '../mocks/mockDb';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import toast from 'react-hot-toast';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Enter current password'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
  });

export function SettingsPage() {
  const { user, updateProfile } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { fetchAll } = usePortfolioStore();

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || 'Rahul Sharma');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '+91 98765 43210');
  const [defaultProduct, setDefaultProduct] = useState(user?.preferences?.defaultProduct || 'CNC');
  const [orderConfirmations, setOrderConfirmations] = useState(
    user?.preferences?.orderConfirmations ?? true
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile({
      name: profileName,
      phone: profilePhone,
      preferences: {
        ...user?.preferences,
        defaultProduct,
        orderConfirmations,
      },
    });
  };

  const onChangePassword = async (data) => {
    setIsUpdatingPassword(true);
    try {
      await new Promise((res) => setTimeout(res, 500));
      toast.success('Password updated successfully');
      reset();
    } catch (e) {
      toast.error('Failed to change password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleResetMockData = () => {
    if (window.confirm('Reset all mock orders, positions, and funds back to initial sample state?')) {
      mockDb.resetAll();
      fetchAll();
      toast.success('Mock trading sandbox reset to initial state');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
          Account & Preferences
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your demat personal details, appearance, and trading preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Details */}
        <Card title="Demat Profile" subtitle="SEBI verified investor identity">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input
              label="Legal Name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
            />
            <Input
              label="Email Address"
              value={user?.email || 'rahul@example.com'}
              disabled
              leftIcon={<Mail className="w-4 h-4" />}
              helperText="Verified registered trading email"
            />
            <Input
              label="Phone Number"
              value={profilePhone}
              onChange={(e) => setProfilePhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
            />
            <Input
              label="PAN Number"
              value={user?.pan || 'ABCDE1234F'}
              disabled
              leftIcon={<CreditCard className="w-4 h-4" />}
              helperText="Income Tax linked PAN"
            />

            <Button type="submit" variant="primary" size="sm" className="mt-2">
              Save Profile Changes
            </Button>
          </form>
        </Card>

        {/* Display & Trading Settings */}
        <div className="space-y-6">
          {/* Appearance */}
          <Card title="Interface & Theme" subtitle="Customize terminal display styling">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                  {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">
                    {theme === 'dark' ? 'Dark Terminal Mode' : 'Light Clean Mode'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    High-contrast color scheme for charts and tables.
                  </p>
                </div>
              </div>
              <Button size="xs" variant="outline" onClick={toggleTheme}>
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </Button>
            </div>
          </Card>

          {/* Trading Preferences */}
          <Card title="Order Preferences" subtitle="Execution guardrails and defaults">
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div>
                  <h4 className="font-semibold text-slate-200">Confirmation Dialog</h4>
                  <p className="text-[11px] text-slate-400">
                    Show confirmation review step before routing orders.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={orderConfirmations}
                  onChange={(e) => setOrderConfirmations(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div>
                  <h4 className="font-semibold text-slate-200">Default Product Type</h4>
                  <p className="text-[11px] text-slate-400">
                    Preselect CNC (delivery) or MIS (intraday)
                  </p>
                </div>
                <select
                  value={defaultProduct}
                  onChange={(e) => setDefaultProduct(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2.5 py-1 text-xs"
                >
                  <option value="CNC">CNC (Delivery)</option>
                  <option value="MIS">MIS (Intraday)</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Security / Password */}
        <Card title="Security" subtitle="Update your account password">
          <form onSubmit={handleSubmit(onChangePassword)} className="space-y-3.5">
            <Input
              label="Current Password"
              type="password"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.currentPassword?.message}
              {...register('currentPassword')}
            />
            <Input
              label="New Password"
              type="password"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />
            <Input
              label="Confirm New Password"
              type="password"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.confirmNewPassword?.message}
              {...register('confirmNewPassword')}
            />

            <Button
              type="submit"
              variant="outline"
              size="sm"
              isLoading={isUpdatingPassword}
              className="mt-2"
            >
              Update Password
            </Button>
          </form>
        </Card>

        {/* Sandbox Mock Database Reset */}
        <Card title="Mock Environment" subtitle="Manage client-side simulated state">
          <div className="space-y-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300">
              ApexTrader is currently operating in mock simulator mode with local persistent storage. You can restore the original sample portfolio at any time.
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-rose-400 hover:text-rose-300 hover:border-rose-500/50"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={handleResetMockData}
            >
              Reset Sample Portfolio Data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
export default SettingsPage;
