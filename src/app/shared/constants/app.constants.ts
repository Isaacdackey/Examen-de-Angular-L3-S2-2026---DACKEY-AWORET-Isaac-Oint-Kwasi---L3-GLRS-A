export const APP_CONSTANTS = {
  APP_NAME: 'BadWallet',
  APP_VERSION: '1.0.0',
  
  ROLES: {
    CLIENT: 'CLIENT',
    AGENT: 'AGENT',
    ADMIN: 'ADMIN'
  },
  
  TRANSACTION_TYPES: {
    DEPOT: 'DEPOT',
    RETRAIT: 'RETRAIT',
    TRANSFERT_ENVOI: 'TRANSFERT_ENVOI',
    TRANSFERT_RECEPTION: 'TRANSFERT_RECEPTION',
    PAIEMENT_FACTURE: 'PAIEMENT_FACTURE'
  },
  
  SERVICES: {
    ISM: 'ISM',
    WOYAFAL: 'WOYAFAL',
    RAPIDO: 'RAPIDO'
  },
  
  CURRENCY: {
    CODE: 'XOF',
    SYMBOL: 'CFA',
    LOCALE: 'fr-SN'
  },
  
  PHONE: {
    COUNTRY_CODE: '221',
    PATTERN: /^\+221[0-9]{9}$/
  },
  
  VALIDATION: {
    MIN_AMOUNT: 1,
    MAX_AMOUNT: 10000000,
    MIN_PASSWORD_LENGTH: 6,
    MAX_PASSWORD_LENGTH: 30
  },
  
  MESSAGES: {
    SUCCESS: {
      LOGIN: 'Connexion reussie',
      REGISTER: 'Inscription reussie',
      DEPOSIT: 'Depot effectue avec succes',
      WITHDRAW: 'Retrait effectue avec succes',
      TRANSFER: 'Transfert effectue avec succes',
      PAYMENT: 'Paiement effectue avec succes'
    },
    ERROR: {
      LOGIN: 'Echec de la connexion',
      REGISTER: 'Echec de l\'inscription',
      INSUFFICIENT_FUNDS: 'Solde insuffisant',
      INVALID_PHONE: 'Numero de telephone invalide',
      INVALID_AMOUNT: 'Montant invalide'
    }
  },
  
  DATE_FORMATS: {
    SHORT: 'dd/MM/yyyy',
    LONG: 'dd MMMM yyyy',
    FULL: 'dd MMMM yyyy HH:mm',
    TIME: 'HH:mm'
  },
  
  ROUTES: {
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    TRANSACTIONS: '/transactions',
    TRANSFER: '/transfer',
    BILLS: '/bills',
    BILLS_CURRENT: '/bills/current',
    BILLS_HISTORY: '/bills/history',
    ADMIN_WALLETS: '/admin/wallets',
    ADMIN_WALLETS_CREATE: '/admin/wallets/create',
    ADMIN_WALLETS_SEARCH: '/admin/wallets/search',
    ADMIN_DEPOSIT: '/admin/wallets/deposit',
    ADMIN_WITHDRAW: '/admin/wallets/withdraw'
  }
};