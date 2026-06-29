import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, RegisterRequest } from '../../core/models/user.model';

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      phoneNumber: string;
      email: string;
      role: string;
      username: string;
    };
    token: string;
  };
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/api/auth`;
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  constructor() {
    this.loadStoredUser();
  }
  
  private loadStoredUser() {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user_data');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (e) {
        this.logout();
      }
    }
  }
  
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.handleAuthResponse({
            user: response.data.user,
            token: response.data.token
          });
        }
      })
    );
  }
  
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.handleAuthResponse({
            user: response.data.user,
            token: response.data.token
          });
        }
      })
    );
  }
  
  private handleAuthResponse(authData: { user: any; token: string }) {
    const user: User = {
      id: authData.user.id,
      phoneNumber: authData.user.phoneNumber,
      email: authData.user.email,
      role: authData.user.role,
      username: authData.user.username
    };
    
    localStorage.setItem('auth_token', authData.token);
    localStorage.setItem('user_data', JSON.stringify(user));
    localStorage.setItem('user_role', user.role);
    
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }
  
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_role');
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    this.router.navigate(['/login']);
  }
  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
  
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
  
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
  
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }
}