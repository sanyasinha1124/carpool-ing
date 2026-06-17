 
// ============================================================
// FILE: src/app/app.component.ts
// ============================================================
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    @if (auth.isLoggedIn()) {
      <nav class="navbar">
        <div class="nav-brand" routerLink="/dashboard">
          <span class="nav-logo">🚗</span>
          <span class="nav-title">CarpoolApp</span>
        </div>
 
        <div class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            🔍 Find Ride
          </a>
          @if (auth.currentUser()?.role === 'driver' || auth.currentUser()?.role === 'admin') {
            <a routerLink="/rides/create" routerLinkActive="active" class="nav-link">
              ➕ Offer Ride
            </a>
          }
          <a routerLink="/bookings" routerLinkActive="active" class="nav-link">
            📋 Bookings
          </a>
        </div>
 
        <div class="nav-user">
          <a routerLink="/profile" class="nav-avatar" [title]="auth.currentUser()?.email || ''">
            {{ auth.currentUser()?.firstName?.charAt(0) }}{{ auth.currentUser()?.lastName?.charAt(0) }}
          </a>
          <div class="nav-user-info">
            <span class="nav-name">{{ auth.currentUser()?.firstName }}</span>
            <span class="nav-role">{{ auth.currentUser()?.role }}</span>
          </div>
          <button class="nav-logout" (click)="auth.logout()">Logout</button>
        </div>
      </nav>
    }
 
    <div [class.with-nav]="auth.isLoggedIn()">
      <router-outlet />
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; margin: 0; padding: 0; }
 
    /* ── Navbar ── */
    .navbar {
      position: sticky; top: 0; z-index: 100;
      background: #fff;
      border-bottom: 1px solid #E5E7EB;
      padding: 0 32px;
      height: 64px;
      display: flex; align-items: center;
      gap: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }
 
    .nav-brand {
      display: flex; align-items: center; gap: 8px;
      cursor: pointer; text-decoration: none; flex-shrink: 0;
    }
    .nav-logo  { font-size: 1.4rem; }
    .nav-title { font-size: 1.1rem; font-weight: 800; color: #0D9488; letter-spacing: -0.3px; }
 
    .nav-links {
      display: flex; align-items: center; gap: 4px; flex: 1;
    }
    .nav-link {
      padding: 8px 14px; border-radius: 8px;
      text-decoration: none; font-size: 0.88rem;
      font-weight: 500; color: #4B5563;
      transition: all 0.2s; white-space: nowrap;
    }
    .nav-link:hover { background: #F3F4F6; color: #111827; }
    .nav-link.active { background: #F0FDFA; color: #0D9488; font-weight: 600; }
 
    .nav-user {
      display: flex; align-items: center; gap: 10px; flex-shrink: 0;
    }
    .nav-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, #0D9488, #0a7c71);
      color: #fff; font-size: 0.8rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      text-decoration: none; transition: transform 0.2s;
    }
    .nav-avatar:hover { transform: scale(1.05); }
    .nav-user-info {
      display: flex; flex-direction: column;
    }
    .nav-name { font-size: 0.85rem; font-weight: 600; color: #111827; }
    .nav-role { font-size: 0.72rem; color: #0D9488; font-weight: 500; text-transform: capitalize; }
    .nav-logout {
      padding: 6px 14px; border-radius: 8px;
      border: 1.5px solid #E5E7EB; background: transparent;
      color: #6B7280; font-size: 0.82rem; font-weight: 500;
      cursor: pointer; transition: all 0.2s; font-family: inherit;
    }
    .nav-logout:hover { border-color: #EF4444; color: #EF4444; background: #FEE2E2; }
 
    .with-nav { /* no extra padding needed, each page handles its own */ }
 
    @media (max-width: 768px) {
      .navbar { padding: 0 16px; gap: 12px; }
      .nav-user-info { display: none; }
      .nav-link { padding: 8px 10px; font-size: 0.82rem; }
    }
  `]
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}