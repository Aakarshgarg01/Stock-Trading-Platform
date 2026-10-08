import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuthStore } from '../../store/useAuthStore';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function Login() {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isExpired = searchParams.get('expired') === 'true';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'rahul.sharma@example.com',
      password: 'password123',
    },
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      // Handled in store
    }
  };

  const handleDemoFill = () => {
    setValue('email', 'rahul.sharma@example.com');
    setValue('password', 'password123');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Sign in to your account</h2>
        <p className="text-xs text-slate-400 mt-1">
          Access your demat holdings, positions, and live charts.
        </p>
      </div>

      {isExpired && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-xs">
          Your session has expired. Please sign in again.
        </div>
      )}

      {/* Demo Credentials Quick-Fill Banner */}
      <div className="flex items-center justify-between p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl text-xs">
        <div>
          <span className="font-semibold text-blue-400 block">Demo Account Ready</span>
          <span className="text-[11px] text-slate-400">Pre-funded test Demat portfolio</span>
        </div>
        <Button
          size="xs"
          variant="outline"
          leftIcon={<Sparkles className="w-3 h-3 text-blue-400" />}
          onClick={handleDemoFill}
        >
          Auto Fill
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@domain.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="flex justify-end mt-1.5">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full py-2.5 font-semibold text-sm"
          isLoading={isLoading}
          leftIcon={<LogIn className="w-4 h-4" />}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center pt-2 border-t border-slate-800">
        <p className="text-xs text-slate-400">
          Don't have an ApexTrader Demat account?{' '}
          <Link to="/signup" className="font-semibold text-blue-400 hover:text-blue-300">
            Open Account
          </Link>
        </p>
      </div>
    </div>
  );
}
export default Login;
