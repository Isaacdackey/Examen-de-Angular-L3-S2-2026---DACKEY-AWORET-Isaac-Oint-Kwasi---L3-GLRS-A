import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './auth/guards/auth.guard';
import { agentGuard, clientGuard } from './core/guards/role.guard';

export const routes: Routes = [
  
  {
    path: 'login',
    loadComponent: () => 
      import('./auth/components/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => 
      import('./auth/components/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },
  

  {
    path: 'dashboard',
    loadComponent: () => 
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard, clientGuard]
  },
  {
    path: 'transactions',
    loadComponent: () => 
      import('./features/transactions/components/history/history.component').then(m => m.HistoryComponent),
    canActivate: [authGuard, clientGuard]
  },
  {
    path: 'transfer',
    loadComponent: () => 
      import('./features/transactions/components/transfer/transfer.component').then(m => m.TransferComponent),
    canActivate: [authGuard, clientGuard]
  },
  {
    path: 'bills',
    loadComponent: () => 
      import('./features/billing/components/current-bills/current-bills.component').then(m => m.CurrentBillsComponent),
    canActivate: [authGuard, clientGuard]
  },
  {
    path: 'bills/current',
    loadComponent: () => 
      import('./features/billing/components/current-bills/current-bills.component').then(m => m.CurrentBillsComponent),
    canActivate: [authGuard, clientGuard]
  },
  {
    path: 'bills/history',
    loadComponent: () => 
      import('./features/billing/components/bills-history/bills-history.component').then(m => m.BillsHistoryComponent),
    canActivate: [authGuard, clientGuard]
  },

  {
    path: 'admin/wallets',
    loadComponent: () => 
      import('./features/wallet-management/components/wallet-list/wallet-list.component').then(m => m.WalletListComponent),
    canActivate: [authGuard, agentGuard]
  },
  {
    path: 'admin/wallets/create',
    loadComponent: () => 
      import('./features/wallet-management/components/wallet-create/wallet-create.component').then(m => m.WalletCreateComponent),
    canActivate: [authGuard, agentGuard]
  },
  {
    path: 'admin/wallets/search',
    loadComponent: () => 
      import('./features/wallet-management/components/wallet-search/wallet-search.component').then(m => m.WalletSearchComponent),
    canActivate: [authGuard, agentGuard]
  },
  {
    path: 'admin/wallets/:id/deposit',
    loadComponent: () => 
      import('./features/transactions/components/deposit/deposit.component').then(m => m.DepositComponent),
    canActivate: [authGuard, agentGuard]
  },
  {
    path: 'admin/wallets/withdraw',
    loadComponent: () => 
      import('./features/transactions/components/withdraw/withdraw.component').then(m => m.WithdrawComponent),
    canActivate: [authGuard, agentGuard]
  },
  

  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];