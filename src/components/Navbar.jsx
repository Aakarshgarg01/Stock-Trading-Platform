import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Wallet,
  Sun,
  Moon,
  Bell,
  User,
  LogOut,
  TrendingUp,
  Menu,
  X,
  Shield,
  Layers,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { useThemeStore } from '../store/useThemeStore';
import { formatINR } from '../utils/formatters';
import { GlobalSearch } from './GlobalSearch';
import { cn } from '../utils/cn';

export function Navbar({ onMobileMenuToggle }) {
  const { user, logout } = useAuthStore();
  const { funds } = usePortfolioStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Keyboard shortcut Ctrl+K or '/' to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0B0E14]/90 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          {/* Left: Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-slate-100 leading-none">
                  Apex<span className="text-blue-500">Trader</span>
                </span>
                <span className="text-[9px] font-semibold text-slate-400 tracking-wider uppercase">
                  NSE • BSE Real-Time
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Global Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-lg transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                <span>Search stocks, F&O, indices...</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500 bg-slate-950/60 px-1.5 py-0.5 rounded border border-slate-800">
                <span>Ctrl</span>
                <span>K</span>
              </div>
            </button>
          </div>

          {/* Right: Quick Stats, Theme & User */}
          <div className="flex items-center gap-3">
            {/* Mobile Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-slate-100 rounded-lg"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Quick Funds Badge */}
            <Link
              to="/funds"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 rounded-lg transition-colors"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-slate-400 uppercase leading-none">Available</span>
                <span className="text-xs font-mono font-semibold text-slate-200 tabular-nums">
                  {formatINR(funds.availableBalance || 0)}
                </span>
              </div>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-lg transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-400" />
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-300 font-semibold text-xs">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'TR'}
                </div>
                <span className="hidden lg:inline text-xs font-medium text-slate-300 max-w-[100px] truncate">
                  {user?.name?.split(' ')[0] || 'Trader'}
                </span>
              </button>

              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-[#121721] border border-slate-800 rounded-xl shadow-2xl py-1 z-50 text-xs animate-in fade-in duration-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800/80">
                    <p className="font-semibold text-slate-100">{user?.name || 'Rahul Sharma'}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email || 'trader@example.com'}</p>
                    <span className="inline-block mt-1 text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active Demat / Trading
                    </span>
                  </div>

                  <Link
                    to="/settings"
                    className="flex items-center gap-2.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Profile & Settings</span>
                  </Link>

                  <Link
                    to="/funds"
                    className="flex items-center gap-2.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                  >
                    <Wallet className="w-3.5 h-3.5 text-slate-400" />
                    <span>Funds & Margin</span>
                  </Link>

                  <div className="border-t border-slate-800/80 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
