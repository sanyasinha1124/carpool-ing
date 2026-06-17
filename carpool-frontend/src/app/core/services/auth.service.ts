// src/app/core/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { User, AuthResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:3000/api/auth';

  currentUser = signal<User | null>(null);
  isLoggedIn  = signal<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromStorage();
  }

  register(data: {
    email: string; password: string;
    firstName: string; lastName: string;
    phone?: string; role: string;
  }) {
    return this.http.post<User>(`${this.api}/register`, data);
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.api}/login`, { email, password })
      .pipe(tap(res => {
        localStorage.setItem('token', res.accessToken);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.currentUser.set(res.user);
        this.isLoggedIn.set(true);
      }));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getMe() {
    return this.http.get<User>(`${this.api}/me`);
  }

  private loadFromStorage() {
    const token = localStorage.getItem('token');
    const user  = localStorage.getItem('user');
    if (token && user) {
      this.currentUser.set(JSON.parse(user));
      this.isLoggedIn.set(true);
    }
  }
}