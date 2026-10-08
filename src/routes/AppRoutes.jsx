import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { Loader } from '../components/Loader';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Lazy-loaded pages
const Login = lazy(() => import('../pages/auth/Login'));
const Signup = lazy(() => import('../pages/auth/Signup'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const WatchlistPage = lazy(() => import('../pages/WatchlistPage'));
const StockDetail = lazy(() => import('../pages/StockDetail'));
const OrdersPage = lazy(() => import('../pages/OrdersPage'));
const PositionsPage = lazy(() => import('../pages/PositionsPage'));
const HoldingsPage = lazy(() => import('../pages/HoldingsPage'));
const FundsPage = lazy(() => import('../pages/FundsPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const NotFound = lazy(() => import('../pages/NotFound'));

export function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader fullScreen text="Initializing ApexTrader..." />}>
        <Routes>
          {/* Public Auth Routes */}
          <Route
            element={
              <PublicRoute>
                <AuthLayout />
              </PublicRoute>
            }
          >
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Protected App Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/stock/:symbol" element={<StockDetail />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/positions" element={<PositionsPage />} />
            <Route path="/holdings" element={<HoldingsPage />} />
            <Route path="/funds" element={<FundsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
