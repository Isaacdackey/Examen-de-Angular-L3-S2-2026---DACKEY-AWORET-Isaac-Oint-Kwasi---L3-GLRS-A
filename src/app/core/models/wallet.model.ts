import { Transaction } from './transaction.model';

export interface Wallet {
  id: number;
  code: string;           
  phoneNumber: string;    
  email: string;          
  balance: number;        
  currency: string;       
  createdAt: string;      
  transactions?: Transaction[]; 
}

export interface WalletCreateRequest {
  phoneNumber: string;
  email: string;
  initialBalance: number;
  code: string;
  currency?: string;
}

export interface WalletResponse {
  id: number;
  code: string;
  phoneNumber: string;
  email: string;
  balance: number;
  currency: string;
  createdAt: string;
}

export interface WalletSearchResponse {
  id: number;
  code: string;
  phoneNumber: string;
  email: string;
  balance: number;
  currency: string;
  createdAt: string;
}

export interface WalletUpdateRequest {
  phoneNumber?: string;
  email?: string;
  balance?: number;
}

export interface TransactionResponse {
  id: number;
  type: string;
  amount: number;
  fees: number;
  description: string;
  targetPhone: string | null;
  createdAt: string;
}