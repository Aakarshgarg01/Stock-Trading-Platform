import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '../components/Button';

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-500 flex items-center justify-center mb-4 border border-blue-500/20">
        <Compass className="w-8 h-8 animate-spin-slow" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">404 - Page Not Found</h1>
      <p className="text-xs text-slate-400 mt-2 max-w-sm mb-6">
        The trading page or financial instrument you are trying to access does not exist or has been delisted.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}
export default NotFound;
