import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import cartSlice from './slices/cartSlice';
import uiSlice from './slices/uiSlice';

// Load auth state từ localStorage ngay khi khởi tạo store
// Kiểm tra token expired trước khi load
const loadAuthFromStorage = () => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return undefined;
        }
        // Có refreshToken → load user, api interceptor sẽ tự refresh
      }

      return {
        user: JSON.parse(userStr),
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    }
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  return undefined;
};

const preloadedAuth = loadAuthFromStorage();

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    ui: uiSlice,
  },
  preloadedState: preloadedAuth ? { auth: preloadedAuth } : undefined,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
