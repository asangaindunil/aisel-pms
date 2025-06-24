export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob: string;
}

export interface UpdatePatientData extends Partial<CreatePatientData> {
  id: number;
}

export interface User {
  isDisabled: boolean;
  id: number;
  username: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}