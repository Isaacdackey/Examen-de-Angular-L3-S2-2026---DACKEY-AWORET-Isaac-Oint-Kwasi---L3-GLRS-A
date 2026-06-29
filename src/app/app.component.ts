import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './layouts/header/header.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { AuthService } from './auth/services/auth.service';
import { BalanceStore } from './core/services/balance-store.service';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    ToastComponent,
    LoaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'BadWallet Web Dashboard';
  
  private authService = inject(AuthService);
  private balanceStore = inject(BalanceStore);
  private loadingService = inject(LoadingService);
  private router = inject(Router);
  
  isAuthenticated = false;
  isSidebarCollapsed = false;
  currentYear = new Date().getFullYear();
  
  constructor() {
    this.authService.isAuthenticated$.subscribe({
      next: (isAuth) => {
        this.isAuthenticated = isAuth;
        if (isAuth) {
          const user = this.authService.getCurrentUser();
          if (user?.phoneNumber) {
            this.balanceStore.setCurrentPhone(user.phoneNumber);
          }
        }
      }
    });
    
    effect(() => {
      if (this.loadingService.isLoading()) {
        console.log('Chargement en cours...');
      }
    });
  }
  
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
        this.updatePageTitle();
      }
    });
    
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      if (user?.phoneNumber) {
        this.balanceStore.setCurrentPhone(user.phoneNumber);
      }
    }
  }
  
  private updatePageTitle(): void {
    const route = this.router.url;
    let pageTitle = 'BadWallet';
    
    switch (true) {
      case route.includes('/dashboard'):
        pageTitle = 'Tableau de bord - BadWallet';
        break;
      case route.includes('/transfer'):
        pageTitle = 'Transfert - BadWallet';
        break;
      case route.includes('/transactions'):
        pageTitle = 'Historique - BadWallet';
        break;
      case route.includes('/bills'):
        pageTitle = 'Factures - BadWallet';
        break;
      case route.includes('/admin/wallets/create'):
        pageTitle = 'Creer un portefeuille - BadWallet';
        break;
      case route.includes('/admin/wallets'):
        pageTitle = 'Gestion des portefeuilles - BadWallet';
        break;
      case route.includes('/login'):
        pageTitle = 'Connexion - BadWallet';
        break;
      case route.includes('/register'):
        pageTitle = 'Inscription - BadWallet';
        break;
      default:
        pageTitle = 'BadWallet';
    }
    
    document.title = pageTitle;
  }
  
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
  
  isAgent(): boolean {
    return this.authService.hasRole('AGENT') || this.authService.hasRole('ADMIN');
  }
  
  isClient(): boolean {
    return this.authService.hasRole('CLIENT');
  }
}