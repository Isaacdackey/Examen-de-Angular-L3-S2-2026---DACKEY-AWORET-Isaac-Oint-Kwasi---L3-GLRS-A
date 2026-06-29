export enum UserRole {
  CLIENT = 'CLIENT',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN'
}

export interface User {
  id?: number;
  username: string;
  email: string;
  phoneNumber: string;
  role: 'CLIENT' | 'AGENT' | 'ADMIN' | string;
  token?: string;
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface RegisterRequest {
  phoneNumber: string;
  email: string;
  password: string;
  role?: 'CLIENT' | 'AGENT';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}


export interface ResetPasswordRequest {
  phoneNumber: string;
  newPassword: string;
  confirmPassword: string;
}


export interface UpdateProfileRequest {
  email?: string;
  username?: string;
  phoneNumber?: string;
}
