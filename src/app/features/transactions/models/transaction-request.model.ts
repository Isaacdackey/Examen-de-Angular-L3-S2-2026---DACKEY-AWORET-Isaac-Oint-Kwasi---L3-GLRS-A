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

export interface PayFacturesRequest {
  phoneNumber: string;
  serviceName: string;
  factureReferences: string[];
}