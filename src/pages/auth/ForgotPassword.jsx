import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { authApi } from '../../api/auth.api';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid registered email address'),
});

export function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Reset Password</h2>
        <p className="text-xs text-slate-400 mt-1">
          Enter your registered email and we'll send you an instant reset link.
        </p>
      </div>

      {isSubmitted ? (
        <div className="space-y-4 text-center py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Reset instructions sent</h4>
            <p className="text-xs text-slate-400 mt-1">
              We sent a verification link to <span className="text-blue-400 font-mono">{submittedEmail}</span>.
            </p>
          </div>
          <Link to="/login" className="inline-block mt-4">
            <Button size="sm" variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Registered Email"
            type="email"
            placeholder="rahul@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5 font-semibold text-sm"
            isLoading={isLoading}
          >
            Send Reset Link
          </Button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
export default ForgotPassword;
