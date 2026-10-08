import { Outlet, Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck, Zap, Activity } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 group mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-100">
            Apex<span className="text-blue-500">Trader</span>
          </span>
        </Link>
        <p className="text-xs text-slate-400 font-medium">
          Ultra-low latency institutional trading for Indian Markets
        </p>
      </div>

      {/* Main Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-[#121721] py-8 px-6 sm:px-8 shadow-2xl rounded-2xl border border-slate-800/80 backdrop-blur-md">
          <Outlet />
        </div>

        {/* Security badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 256-Bit SSL Encrypted
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-blue-500" /> SEBI Registered Brokerage Mock
          </span>
        </div>
      </div>
    </div>
  );
}
