import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  authService = inject(AuthService);
  isCollapsed = false;
  
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  
  isAgent(): boolean {
    return this.authService.hasRole('AGENT') || this.authService.hasRole('ADMIN');
  }
  
  isClient(): boolean {
    return this.authService.hasRole('CLIENT');
  }
  
  getCurrentUser() {
    return this.authService.getCurrentUser();
  }
}