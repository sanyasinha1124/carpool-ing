
// ============================================================
// FILE: src/app/features/profile/profile.component.ts
// ============================================================
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/models';
 
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, MatProgressSpinnerModule],
  template: `
    <div class="profile-page">
 
      @if (!user()) {
        <div class="loading-center"><mat-spinner /></div>
      }
 
      @if (user()) {
        <!-- Hero -->
        <div class="profile-hero">
          <div class="avatar-ring">
            <div class="avatar">
              {{ user()!.firstName.charAt(0) }}{{ user()!.lastName.charAt(0) }}
            </div>
          </div>
          <div class="hero-info">
            <h2>{{ user()!.firstName }} {{ user()!.lastName }}</h2>
            <span class="role-badge" [class]="user()!.role">
              {{ roleLabel(user()!.role) }}
            </span>
            <div class="hero-stats">
              <div class="hstat">
                <strong>{{ user()!.rating || 0 }}</strong>
                <span>Rating</span>
              </div>
              <div class="hstat-div"></div>
              <div class="hstat">
                <strong>{{ user()!.totalRatings || 0 }}</strong>
                <span>Reviews</span>
              </div>
              <div class="hstat-div"></div>
              <div class="hstat">
                <strong>{{ user()!.isActive ? 'Active' : 'Inactive' }}</strong>
                <span>Status</span>
              </div>
            </div>
          </div>
        </div>
 
        <!-- Info Card -->
        <div class="info-card">
          <h4>Account Details</h4>
 
          <div class="info-row">
            <div class="info-icon">✉️</div>
            <div class="info-content">
              <label>Email Address</label>
              <p>{{ user()!.email }}</p>
            </div>
          </div>
 
          <div class="info-row">
            <div class="info-icon">📱</div>
            <div class="info-content">
              <label>Phone Number</label>
              <p>{{ user()!.phone || 'Not provided' }}</p>
            </div>
          </div>
 
          <div class="info-row">
            <div class="info-icon">🎭</div>
            <div class="info-content">
              <label>Account Type</label>
              <p>{{ roleLabel(user()!.role) }}</p>
            </div>
          </div>
 
          <div class="info-row">
            <div class="info-icon">📅</div>
            <div class="info-content">
              <label>Member Since</label>
              <p>{{ user()!.createdAt | date:'MMMM d, yyyy' }}</p>
            </div>
          </div>
        </div>
 
        <!-- Quick Actions -->
        <div class="actions-card">
          <h4>Quick Actions</h4>
          <div class="action-links">
            <a routerLink="/dashboard" class="action-link teal">
              <span>🔍</span> Find a Ride
            </a>
            @if (user()!.role === 'driver' || user()!.role === 'admin') {
              <a routerLink="/rides/create" class="action-link coral">
                <span>🚗</span> Post a Ride
              </a>
            }
            <a routerLink="/bookings" class="action-link grey">
              <span>📋</span> My Bookings
            </a>
          </div>
        </div>
 
        <!-- Logout -->
        <button class="logout-btn" (click)="auth.logout()">
          🚪 Sign Out
        </button>
      }
 
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .profile-page {
      max-width: 640px; margin: 0 auto;
      padding: 32px 24px; min-height: 100vh;
      background: #FAFAF9;
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }
    .loading-center { display: flex; justify-content: center; padding: 60px; }
 
    /* Hero */
    .profile-hero {
      background: linear-gradient(160deg, #0D9488, #0a7c71);
      border-radius: 20px; padding: 32px;
      display: flex; align-items: center; gap: 24px;
      margin-bottom: 20px; color: #fff;
    }
    .avatar-ring {
      padding: 3px;
      background: rgba(255,255,255,0.3);
      border-radius: 50%; flex-shrink: 0;
    }
    .avatar {
      width: 72px; height: 72px; border-radius: 50%;
      background: rgba(255,255,255,0.2);
      font-size: 1.6rem; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
    }
    .hero-info h2 { font-size: 1.4rem; font-weight: 800; margin-bottom: 8px; }
    .role-badge {
      display: inline-block; padding: 3px 14px;
      border-radius: 20px; font-size: 0.75rem;
      font-weight: 700; margin-bottom: 14px;
    }
    .role-badge.driver { background: rgba(249,115,22,0.2); color: #FED7AA; border: 1px solid rgba(249,115,22,0.3); }
    .role-badge.rider  { background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.3); }
    .role-badge.admin  { background: rgba(99,102,241,0.2); color: #C7D2FE; border: 1px solid rgba(99,102,241,0.3); }
 
    .hero-stats { display: flex; align-items: center; gap: 0; }
    .hstat { text-align: center; padding: 0 16px; }
    .hstat:first-child { padding-left: 0; }
    .hstat strong { display: block; font-size: 1.1rem; font-weight: 800; color: #F97316; }
    .hstat span   { font-size: 0.75rem; color: rgba(255,255,255,0.7); }
    .hstat-div { width: 1px; height: 30px; background: rgba(255,255,255,0.2); }
 
    /* Info Card */
    .info-card, .actions-card {
      background: #fff; border-radius: 16px;
      padding: 24px; margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      border: 1px solid #F3F4F6;
    }
    .info-card h4, .actions-card h4 {
      font-size: 0.9rem; font-weight: 700;
      color: #374151; text-transform: uppercase;
      letter-spacing: 0.5px; margin-bottom: 16px;
    }
 
    .info-row {
      display: flex; align-items: flex-start; gap: 14px;
      padding: 12px 0; border-bottom: 1px solid #F3F4F6;
    }
    .info-row:last-child { border-bottom: none; padding-bottom: 0; }
    .info-icon { font-size: 1.1rem; margin-top: 2px; flex-shrink: 0; width: 24px; text-align: center; }
    .info-content label { display: block; font-size: 0.75rem; color: #9CA3AF; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
    .info-content p { font-size: 0.92rem; color: #111827; font-weight: 500; }
 
    /* Actions */
    .action-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; }
    .action-link {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 16px; border-radius: 10px;
      text-decoration: none; font-weight: 600;
      font-size: 0.88rem; transition: all 0.2s; border: 1.5px solid;
    }
    .action-link.teal  { color: #0D9488; border-color: #0D9488; background: #F0FDFA; }
    .action-link.coral { color: #F97316; border-color: #F97316; background: #FFF7ED; }
    .action-link.grey  { color: #6B7280; border-color: #D1D5DB; background: #F9FAFB; }
    .action-link.teal:hover  { background: #0D9488; color: #fff; }
    .action-link.coral:hover { background: #F97316; color: #fff; }
    .action-link.grey:hover  { background: #6B7280; color: #fff; }
 
    /* Logout */
    .logout-btn {
      width: 100%; padding: 14px;
      border: 2px solid #EF4444; border-radius: 12px;
      background: transparent; color: #EF4444;
      font-size: 0.95rem; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
      font-family: inherit;
    }
    .logout-btn:hover { background: #FEE2E2; }
 
    @media (max-width: 480px) {
      .profile-hero { flex-direction: column; text-align: center; }
      .hero-stats { justify-content: center; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user = signal<User | null>(null);
  constructor(public auth: AuthService) {}
 
  ngOnInit() {
    this.auth.getMe().subscribe({
      next:  (u) => this.user.set(u),
      error: ()  => this.user.set(this.auth.currentUser())
    });
  }
 
  roleLabel(role: string): string {
    const map: Record<string, string> = {
      driver: '🚗 Driver',
      rider:  '🧳 Rider',
      admin:  '⚙️ Admin',
    };
    return map[role] || role;
  }
}
 