import { apiService } from './api';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '@/types/auth';

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Hash password on client side (matching current implementation)
    const hashedPassword = await this.hashPassword(credentials.password);
    
    const response = await apiService.post<LoginResponse>('/Auth/login', {
      username: credentials.username,
      password: hashedPassword,
    });

    return response;
  }

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const hashedPassword = await this.hashPassword(data.password);
    
    const response = await apiService.post<LoginResponse>('/Auth/register', {
      username: data.username,
      password: hashedPassword,
      email: data.email,
    });

    return response;
  }

  async getCurrentUser(): Promise<User> {
    return await apiService.get<User>('/Auth/me');
  }

  async refreshToken(): Promise<{ token: string }> {
    return await apiService.post<{ token: string }>('/Auth/refresh');
  }

  async logout(): Promise<void> {
    await apiService.post('/Auth/logout');
  }

  private async hashPassword(password: string): Promise<string> {
    // Using Web Crypto API for SHA-256 hashing (matching current implementation)
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
}

export const authService = new AuthService();