import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bookmark,
  ClipboardList,
  PieChart,
  Wallet,
} from 'lucide-react';
import { cn } from '../utils/cn';

const MOBILE_NAV_ITEMS = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/watchlist', label: 'Watchlist', icon: Bookmark },
  { to: '/orders', label: 'Orders', icon: ClipboardList },
  { to: '/holdings', label: 'Holdings', icon: PieChart },
  { to: '/funds', label: 'Funds', icon: Wallet },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#0B0E14]/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1 select-none">
      <div className="flex items-center justify-around">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-[10px] font-medium transition-colors',
                  isActive
                    ? 'text-blue-500 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                )
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
