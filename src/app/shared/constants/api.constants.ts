export const API_CONSTANTS = {
  BASE_URL: 'http://localhost:8080',
  
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh'
    },
    
    WALLETS: {
      BASE: '/api/wallets',
      BY_PHONE: (phone: string) => `/api/wallets/${phone}`,
      BALANCE: (phone: string) => `/api/wallets/${phone}/balance`,
      DEPOSIT: (id: number) => `/api/wallets/${id}/deposit`,
      WITHDRAW: '/api/wallets/withdraw',
      TRANSFER: '/api/wallets/transfer',
      PAY: '/api/wallets/pay',
      PAY_FACTURES: '/api/wallets/pay-factures',
      TRANSACTIONS: (phone: string) => `/api/wallets/${phone}/transactions`
    },
    
    FACTURES: {
      BASE: '/api/external/factures',
      CURRENT: (walletCode: string) => `/api/external/factures/${walletCode}/current`,
      PERIODE: (walletCode: string) => `/api/external/factures/${walletCode}/periode`
    }
  },
  
  PAGINATION: {
    DEFAULT_PAGE: 0,
    DEFAULT_SIZE: 10,
    PAGE_SIZES: [5, 10, 20, 50, 100]
  },
  
  HEADERS: {
    AUTHORIZATION: 'Authorization',
    CONTENT_TYPE: 'Content-Type',
    ACCEPT: 'Accept',
    X_USER_ROLE: 'X-User-Role'
  },
  
  STORAGE_KEYS: {
    TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    USER_ROLE: 'user_role',
    THEME: 'theme_preference',
    LANGUAGE: 'language_preference'
  }
};