import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null, // Don't auto-load token from localStorage
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = action.payload;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('cart'); // Clear cart on logout
    },
    clearError: state => {
      state.error = null;
    },
    loadUserFromStorage: state => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const isExpired = payload.exp * 1000 < Date.now();

          if (isExpired) {
            // Token expired nhưng vẫn load user vào state
            // api.ts interceptor sẽ tự refresh khi gọi API
            // Nếu không có refreshToken thì sẽ logout
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              return;
            }
            // Giữ user trong state, token sẽ được refresh khi gọi API đầu tiên
            const user = JSON.parse(userStr);
            state.user = user;
            state.token = token; // token cũ, sẽ bị replace sau khi refresh
            state.isAuthenticated = true;
            return;
          }

          const user = JSON.parse(userStr);
          state.user = user;
          state.token = token;
          state.isAuthenticated = true;
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  loadUserFromStorage,
} = authSlice.actions;

export default authSlice.reducer;
