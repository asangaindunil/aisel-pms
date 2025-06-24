export interface LoginCredentials {
  username: string;
  password: string;
}

export interface JWTPayload {
  userId: number;
  username: string;
  role: 'admin' | 'user';
  iat?: number;
  exp?: number;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
  createdAt: string;
}