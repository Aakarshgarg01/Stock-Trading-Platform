import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppRoutes } from './routes/AppRoutes';
import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const initTheme = useThemeStore((state) => state.initTheme);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    initTheme();
    checkAuth();
  }, [initTheme, checkAuth]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#121721',
            color: '#F8FAFC',
            border: '1px solid #1E293B',
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#121721',
            },
          },
          error: {
            iconTheme: {
              primary: '#F43F5E',
              secondary: '#121721',
            },
          },
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
