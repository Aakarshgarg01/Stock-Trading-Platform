import { useAuthStore } from '../store/useAuthStore';

export function useAuth() {
  const { user, token, isAuthenticated, isLoading, error, login, signup, logout, checkAuth, updateProfile } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    checkAuth,
    updateProfile,
  };
}
