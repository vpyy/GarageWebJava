import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor — gắn JWT vào mọi request, tự logout nếu expired
    this.api.interceptors.request.use(
      config => {
        const state = store.getState();
        const token = state.auth.token;

        if (token) {
          // Kiểm tra token expired trước khi gửi
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp * 1000 < Date.now()) {
              // Token expired — không gửi request, redirect về login
              store.dispatch(logout());
              window.location.href = '/auth/login';
              return Promise.reject(new Error('Token expired'));
            }
          } catch {
            // Token malformed — logout
            store.dispatch(logout());
            window.location.href = '/auth/login';
            return Promise.reject(new Error('Invalid token'));
          }
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async error => {
        const originalRequest = error.config;
        const status = error.response?.status;

        // Kiểm tra token hiện tại có expired không
        const isTokenExpired = () => {
          try {
            const token = store.getState().auth.token;
            if (!token) return false;
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
          } catch {
            return false;
          }
        };

        // 401 hoặc 403 với token expired → thử refresh
        const shouldRefresh =
          (status === 401 || status === 403) &&
          !originalRequest._retry &&
          isTokenExpired();

        if (shouldRefresh) {
          originalRequest._retry = true;
          const refreshToken = localStorage.getItem('refreshToken');

          if (refreshToken) {
            try {
              const res = await axios.post(
                (process.env.REACT_APP_API_BASE_URL || '/api') +
                  '/auth/refresh',
                { refreshToken },
                { headers: { 'Content-Type': 'application/json' } }
              );
              const newToken = res.data.accessToken;
              const newRefresh = res.data.refreshToken;

              // Lưu token mới
              store.dispatch({
                type: 'auth/loginSuccess',
                payload: {
                  user: store.getState().auth.user,
                  token: newToken,
                },
              });
              if (newRefresh) {
                localStorage.setItem('refreshToken', newRefresh);
              }

              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.api(originalRequest);
            } catch {
              // Refresh thất bại → logout
              store.dispatch(logout());
              localStorage.removeItem('refreshToken');
              toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
              window.location.href = '/auth/login';
              return Promise.reject(error);
            }
          }

          // Không có refresh token → logout
          store.dispatch(logout());
          toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
          window.location.href = '/auth/login';
          return Promise.reject(error);
        }

        // 401 không phải do expired → logout
        if (status === 401 && !originalRequest._retry) {
          store.dispatch(logout());
          toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
          window.location.href = '/auth/login';
        } else if (status === 403) {
          toast.error('Bạn không có quyền truy cập');
        } else if (status >= 500) {
          toast.error('Lỗi server, vui lòng thử lại sau');
        } else if (error.code === 'ECONNABORTED') {
          toast.error('Kết nối timeout, vui lòng thử lại');
        } else if (!error.response) {
          toast.error('Không thể kết nối đến server');
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.patch<T>(url, data, config);
    return response.data;
  }

  // File upload
  async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    };

    const response = await this.api.post<T>(url, formData, config);
    return response.data;
  }

  // Download file
  async downloadFile(url: string, filename: string): Promise<void> {
    const response = await this.api.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}

export const apiService = new ApiService();
