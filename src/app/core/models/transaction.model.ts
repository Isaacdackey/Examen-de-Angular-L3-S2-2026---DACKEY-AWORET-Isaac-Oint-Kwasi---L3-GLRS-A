export enum TransactionType {
  DEPOT = 'DEPOT',
  RETRAIT = 'RETRAIT',
  TRANSFERT_ENVOI = 'TRANSFERT_ENVOI',
  TRANSFERT_RECEPTION = 'TRANSFERT_RECEPTION',
  PAIEMENT_FACTURE = 'PAIEMENT_FACTURE'
}


export interface Transaction {
  id: number;
  walletId: number;           
  type: TransactionType;      
  amount: number;             
  fees: number;               
  description: string;        
  targetPhone?: string;       
  createdAt: string;         
}


export interface TransactionResponse {
  id: number;
  type: TransactionType;
  amount: number;
  fees: number;
  description: string;
  targetPhone: string | null;
  createdAt: string;
}


export interface DepositRequest {
  amount: number;
  paymentMethod?: 'CASH' | 'CREDIT_CARD' | 'BANK_TRANSFER';
}


export interface WithdrawRequest {
  phoneNumber: string;
  amount: number;
}


export interface TransferRequest {
  senderPhone: string;
  receiverPhone: string;
  amount: number;
}


export interface PayRequest {
  phoneNumber: string;
  serviceName: string;
  amount: number;
}


export interface TransactionStats {
  totalDeposits: number;
  totalWithdrawals: number;
  totalTransfers: number;
  totalPayments: number;
  monthlySpending: number;
  monthlyIncome: number;
  averageTransaction: number;
}
