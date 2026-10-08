import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuthStore } from '../../store/useAuthStore';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number'),
    pan: z
      .string()
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Enter a valid PAN (e.g. ABCDE1234F)'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export function Signup() {
  const { signup, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      pan: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await signup(data);
      navigate('/dashboard');
    } catch (err) {
      // Handled in store
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Open Demat & Trading Account</h2>
        <p className="text-xs text-slate-400 mt-1">
          Zero brokerage on equity delivery. Instant KYC setup.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <Input
          label="Full Legal Name"
          placeholder="Rahul Sharma"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="rahul@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Mobile Number"
            placeholder="9876543210"
            prefix="+91"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <Input
            label="PAN Card Number"
            placeholder="ABCDE1234F"
            leftIcon={<CreditCard className="w-4 h-4" />}
            error={errors.pan?.message}
            {...register('pan', {
              onChange: (e) => setValue('pan', e.target.value.toUpperCase()),
            })}
          />
        </div>

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5 font-semibold text-sm"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account
          </Button>
        </div>
      </form>

      <div className="text-center pt-2 border-t border-slate-800">
        <p className="text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
export default Signup;
