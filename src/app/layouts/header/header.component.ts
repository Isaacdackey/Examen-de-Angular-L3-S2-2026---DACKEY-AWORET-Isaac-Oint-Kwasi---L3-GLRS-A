import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BalanceStore } from '../../core/services/balance-store.service';
import { AuthService } from '../../auth/services/auth.service';
import { XofPipe } from '../../shared/pipes/xof.pipe';
import { PhoneFormatPipe } from '../../shared/pipes/phone-format.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, XofPipe, PhoneFormatPipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  balanceStore = inject(BalanceStore);
  authService = inject(AuthService);
  private router = inject(Router);
  
  isMobileMenuOpen = false;
  
  logout() {
    this.authService.logout();
  }
  
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  
  getCurrentUser() {
    return this.authService.getCurrentUser();
  }
  
  isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}