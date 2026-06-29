import { WalletResponse } from '../../../core/models/wallet.model';

export interface WalletCreateRequest {
  phoneNumber: string;
  email: string;
  initialBalance: number;
  code: string;
  currency?: string;
}

export interface WalletUpdateRequest {
  phoneNumber?: string;
  email?: string;
  balance?: number;
}

export interface WalletSearchRequest {
  phoneNumber: string;
}

export interface DepositRequest {
  walletId: number;
  amount: number;
  paymentMethod?: string;
}

export interface WithdrawRequest {
  phoneNumber: string;
  amount: number;
}

export interface WalletListResponse {
  content: WalletResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}