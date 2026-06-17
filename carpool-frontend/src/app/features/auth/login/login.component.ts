import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatProgressSpinnerModule],
  template: `
    <div class="page">

      <!-- LEFT PANEL -->
      <div class="left-panel">
        <div class="brand">
          <div class="logo">🚗</div>
          <h1>CarpoolApp</h1>
          <p>Your daily commute,<br>shared smarter.</p>
        </div>

        <div class="stats">
          <div class="stat">
            <strong>12,000+</strong>
            <span>Active Riders</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <strong>3,500+</strong>
            <span>Verified Drivers</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <strong>₹2.4Cr</strong>
            <span>Saved by Users</span>
          </div>
        </div>

        <div class="routes">
          <p class="routes-label">🔥 Popular routes today</p>
          <div class="route-chip">Mumbai → Pune</div>
          <div class="route-chip">Navi Mumbai → Pune</div>
          <div class="route-chip">Mumbai → Nashik</div>
          <div class="route-chip">Pune → Goa</div>
        </div>

        <div class="testimonial">
          <p>"Best carpooling app in India. Saved me hours of planning!"</p>
          <span>— Rahul S., Driver since 2023</span>
        </div>
      </div>

      <!-- RIGHT PANEL -->
      <div class="right-panel">
        <div class="form-wrapper">

          <div class="form-header">
            <h2>Welcome back 👋</h2>
            <p>Sign in to continue your journey</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()">

            <!-- Email -->
            <div class="field">
              <label>Email address</label>
              <div class="input-wrap"
                [class.focused]="focused === 'email'"
                [class.error]="hasError('email')">
                <span class="input-icon">✉️</span>
                <input formControlName="email" type="email"
                  placeholder="you@example.com"
                  (focus)="focused = 'email'"
                  (blur)="focused = ''" />
              </div>
              @if (hasError('email')) {
                <span class="err">Enter a valid email</span>
              }
            </div>

            <!-- Password -->
            <div class="field">
              <div class="label-row">
                <label>Password</label>
                <a href="#" class="forgot-link">Forgot password?</a>
              </div>
              <div class="input-wrap"
                [class.focused]="focused === 'password'"
                [class.error]="hasError('password')">
                <span class="input-icon">🔒</span>
                <input formControlName="password"
                  [type]="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  (focus)="focused = 'password'"
                  (blur)="focused = ''" />
                <button type="button" class="toggle-btn"
                  (click)="showPassword = !showPassword">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              @if (hasError('password')) {
                <span class="err">Password is required</span>
              }
            </div>

            <!-- Remember me -->
            <div class="remember-row">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="remember" />
                <span class="checkmark"></span>
                Remember me for 7 days
              </label>
            </div>

            <!-- Error Banner -->
            @if (errorMsg) {
              <div class="banner error-banner">⚠️ {{ errorMsg }}</div>
            }

            <!-- Submit -->
            <button type="submit" class="submit-btn" [disabled]="loading">
              @if (loading) {
                <mat-spinner diameter="22" />
                <span>Signing in...</span>
              } @else {
                <span>Sign In</span>
                <span class="btn-arrow">→</span>
              }
            </button>

          </form>

          <!-- Quick Login -->
          <div class="quick-login">
            <p class="quick-label">Quick login (demo accounts)</p>
            <div class="quick-btns">
              <button class="quick-btn rider" (click)="quickLogin('rider')">
                🧳 Login as Rider
              </button>
              <button class="quick-btn driver" (click)="quickLogin('driver')">
                🚗 Login as Driver
              </button>
            </div>
          </div>

          <div class="divider"><span>New to CarpoolApp?</span></div>

          <a routerLink="/register" class="register-btn">
            Create a free account
          </a>

        </div>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .page {
      min-height: 100vh;
      display: flex;
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }

    /* ══ LEFT PANEL ══ */
    .left-panel {
      width: 42%;
      background: linear-gradient(160deg, #0D9488 0%, #0a7c71 50%, #086b61 100%);
      padding: 48px 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }
    .left-panel::before {
      content: '';
      position: absolute;
      top: -80px; right: -80px;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: rgba(255,255,255,0.06);
    }
    .left-panel::after {
      content: '';
      position: absolute;
      bottom: -60px; left: -60px;
      width: 250px; height: 250px;
      border-radius: 50%;
      background: rgba(255,255,255,0.05);
    }

    .brand { position: relative; z-index: 1; }
    .logo { font-size: 3rem; margin-bottom: 12px; }
    .brand h1 {
      font-size: 2rem; font-weight: 800;
      color: #fff; letter-spacing: -0.5px; margin-bottom: 10px;
    }
    .brand p { color: rgba(255,255,255,0.8); font-size: 1.05rem; line-height: 1.6; }

    /* Stats */
    .stats {
      display: flex;
      align-items: center;
      gap: 0;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 14px;
      padding: 20px;
      position: relative;
      z-index: 1;
    }
    .stat { flex: 1; text-align: center; }
    .stat strong { display: block; color: #F97316; font-size: 1.3rem; font-weight: 800; }
    .stat span { color: rgba(255,255,255,0.75); font-size: 0.78rem; }
    .stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.2); }

    /* Routes */
    .routes { position: relative; z-index: 1; }
    .routes-label { color: rgba(255,255,255,0.7); font-size: 0.82rem; margin-bottom: 10px; }
    .route-chip {
      display: inline-block;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.2);
      color: #fff;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.82rem;
      margin: 0 6px 8px 0;
    }

    .testimonial {
      background: rgba(255,255,255,0.12);
      border-left: 3px solid #F97316;
      border-radius: 0 10px 10px 0;
      padding: 14px 16px;
      position: relative;
      z-index: 1;
    }
    .testimonial p {
      color: rgba(255,255,255,0.9);
      font-style: italic; font-size: 0.9rem;
      margin-bottom: 6px; line-height: 1.5;
    }
    .testimonial span { color: #F97316; font-size: 0.8rem; font-weight: 600; }

    /* ══ RIGHT PANEL ══ */
    .right-panel {
      flex: 1;
      background: #FAFAF9;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 24px;
    }
    .form-wrapper { width: 100%; max-width: 420px; }

    .form-header { margin-bottom: 28px; }
    .form-header h2 {
      font-size: 1.75rem; font-weight: 800;
      color: #111827; letter-spacing: -0.5px; margin-bottom: 4px;
    }
    .form-header p { color: #6B7280; font-size: 0.95rem; }

    /* Fields */
    .field { margin-bottom: 18px; }
    .field label {
      display: block; font-size: 0.82rem;
      font-weight: 600; color: #374151; margin-bottom: 6px;
    }
    .label-row {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 6px;
    }
    .label-row label { margin-bottom: 0; }
    .forgot-link {
      color: #0D9488; font-size: 0.82rem;
      font-weight: 600; text-decoration: none;
    }
    .forgot-link:hover { text-decoration: underline; }

    .input-wrap {
      display: flex; align-items: center; gap: 8px;
      border: 1.5px solid #D1D5DB;
      border-radius: 10px; padding: 11px 14px;
      background: #fff; transition: all 0.2s ease;
    }
    .input-wrap.focused {
      border-color: #0D9488;
      box-shadow: 0 0 0 3px rgba(13,148,136,0.12);
    }
    .input-wrap.error {
      border-color: #EF4444;
      box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
    }
    .input-icon { font-size: 1rem; flex-shrink: 0; }
    .input-wrap input {
      flex: 1; border: none; outline: none;
      font-size: 0.93rem; color: #111827;
      background: transparent; font-family: inherit;
    }
    .input-wrap input::placeholder { color: #9CA3AF; }
    .toggle-btn {
      background: none; border: none;
      cursor: pointer; font-size: 1rem; padding: 0;
    }
    .err { display: block; color: #EF4444; font-size: 0.78rem; margin-top: 4px; }

    /* Remember me */
    .remember-row { margin-bottom: 20px; }
    .checkbox-label {
      display: flex; align-items: center; gap: 8px;
      font-size: 0.85rem; color: #374151; cursor: pointer;
    }
    .checkbox-label input[type="checkbox"] { accent-color: #0D9488; width: 15px; height: 15px; }

    /* Banner */
    .banner { padding: 12px 16px; border-radius: 10px; font-size: 0.875rem; font-weight: 500; margin-bottom: 16px; }
    .error-banner { background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; }

    /* Submit */
    .submit-btn {
      width: 100%; height: 50px;
      background: #F97316; color: #fff;
      border: none; border-radius: 10px;
      font-size: 1rem; font-weight: 700;
      cursor: pointer; display: flex;
      align-items: center; justify-content: center;
      gap: 10px; transition: all 0.2s ease;
      margin-bottom: 20px; font-family: inherit;
    }
    .submit-btn:hover:not([disabled]) {
      background: #EA580C;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(249,115,22,0.4);
    }
    .submit-btn[disabled] { background: #FED7AA; cursor: not-allowed; }
    .btn-arrow { font-size: 1.1rem; transition: transform 0.2s; }
    .submit-btn:hover .btn-arrow { transform: translateX(4px); }

    /* Quick Login */
    .quick-login {
      background: #F0FDFA;
      border: 1px solid #CCFBF1;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 20px;
    }
    .quick-label {
      font-size: 0.78rem; font-weight: 600;
      color: #0D9488; text-transform: uppercase;
      letter-spacing: 0.5px; margin-bottom: 10px;
    }
    .quick-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .quick-btn {
      padding: 8px 12px; border-radius: 8px;
      font-size: 0.82rem; font-weight: 600;
      cursor: pointer; border: 1.5px solid;
      transition: all 0.2s; font-family: inherit;
    }
    .quick-btn.rider {
      background: #fff; color: #0D9488; border-color: #0D9488;
    }
    .quick-btn.rider:hover { background: #0D9488; color: #fff; }
    .quick-btn.driver {
      background: #fff; color: #F97316; border-color: #F97316;
    }
    .quick-btn.driver:hover { background: #F97316; color: #fff; }

    /* Divider */
    .divider { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #E5E7EB; }
    .divider span { color: #9CA3AF; font-size: 0.82rem; white-space: nowrap; }

    /* Register Link */
    .register-btn {
      display: block; text-align: center;
      padding: 12px; border: 2px solid #0D9488;
      border-radius: 10px; color: #0D9488;
      text-decoration: none; font-weight: 600;
      font-size: 0.93rem; transition: all 0.2s;
    }
    .register-btn:hover { background: #F0FDFA; }

    @media (max-width: 768px) {
      .page { flex-direction: column; }
      .left-panel { width: 100%; padding: 32px 24px; min-height: auto; }
      .stats, .routes { display: none; }
    }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading      = false;
  showPassword = false;
  errorMsg     = '';
  focused      = '';

  constructor(
    private fb:     FormBuilder,
    private auth:   AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  hasError(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }

  quickLogin(role: 'rider' | 'driver') {
    const credentials = {
      rider:  { email: 'sanya@carpool.com',  password: 'Rider@123'  },
      driver: { email: 'rahul@carpool.com',  password: 'Driver@123' }
    };
    const { email, password } = credentials[role];
    this.form.patchValue({ email, password });
    this.onSubmit();
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading  = true;
    this.errorMsg = '';

    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe({
      next:  () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.errorMsg = err.error?.error || 'Login failed. Check your credentials.';
        this.loading  = false;
      }
    });
  }
}