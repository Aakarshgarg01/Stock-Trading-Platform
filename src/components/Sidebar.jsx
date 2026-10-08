import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bookmark,
  ClipboardList,
  Layers,
  PieChart,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { cn } from '../utils/cn';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/watchlist', label: 'Watchlist', icon: Bookmark },
  { to: '/orders', label: 'Orders', icon: ClipboardList },
  { to: '/positions', label: 'Positions', icon: Layers },
  { to: '/holdings', label: 'Holdings', icon: PieChart },
  { to: '/funds', label: 'Funds', icon: Wallet },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onMobileClose }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 lg:top-14 z-40 h-full lg:h-[calc(100vh-3.5rem)] bg-[#0B0E14] border-r border-slate-800/80 transition-all duration-200 flex flex-col justify-between select-none',
          isCollapsed ? 'w-16' : 'w-60',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group',
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Collapse Toggle (Desktop only) */}
        <div className="hidden lg:flex items-center justify-between p-3 border-t border-slate-800/60">
          {!isCollapsed && (
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>NSE / BSE Connected</span>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg ml-auto"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
}
