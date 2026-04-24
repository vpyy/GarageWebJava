export interface User {
  userId?: number;
  id?: number;
  username: string;
  email?: string;
  role: 'Admin' | 'Customer';
  name?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
  confirmPassword: string;
}

export interface LoginResponse {
  userId: number;
  username: string;
  email?: string;
  role: 'Admin' | 'Customer';
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
