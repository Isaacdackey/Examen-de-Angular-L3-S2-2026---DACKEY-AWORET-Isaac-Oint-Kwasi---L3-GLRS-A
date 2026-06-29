export interface FactureResponse {
  id: number;
  reference: string;
  walletCode: string;
  serviceName: string;
  montant: number;
  payee: boolean;
  dateFacture: string;
  datePaiement: string | null;
}

export interface FactureFilter {
  serviceName?: string;
  startDate?: string;
  endDate?: string;
  payee?: boolean;
}

export interface PayFacturesRequest {
  phoneNumber: string;
  serviceName: string;
  factureReferences: string[];
}

export interface PayRequest {
  phoneNumber: string;
  serviceName: string;
  amount: number;
}

export interface FactureSummary {
  serviceName: string;
  total: number;
  paid: number;
  unpaid: number;
  totalAmount: number;
  unpaidAmount: number;
}