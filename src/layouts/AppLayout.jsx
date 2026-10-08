import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { MobileNav } from '../components/MobileNav';
import { MarketIndicesStrip } from '../components/MarketIndicesStrip';
import { useMarketStore } from '../store/useMarketStore';
import { usePortfolioStore } from '../store/usePortfolioStore';

export function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const initMarketData = useMarketStore((state) => state.initMarketData);
  const fetchAll = usePortfolioStore((state) => state.fetchAll);

  useEffect(() => {
    initMarketData();
    fetchAll();
  }, [initMarketData, fetchAll]);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Real-time Indices Strip */}
      <MarketIndicesStrip />

      {/* Top Navigation */}
      <Navbar onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />

      {/* Main Workspace */}
      <div className="flex-1 flex w-full">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Scrollable Main Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 overflow-y-auto max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Bottom Nav for mobile */}
      <MobileNav />
    </div>
  );
}
