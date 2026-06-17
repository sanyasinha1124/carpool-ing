import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page">

      <!-- LEFT PANEL — Brand -->
      <div class="left-panel">
        <div class="brand">
          <div class="logo">🚗</div>
          <h1>CarpoolApp</h1>
          <p>Share rides. Save money.<br>Meet people. Go green.</p>
        </div>

        <div class="features">
          <div class="feature">
            <span class="feature-icon">💸</span>
            <div>
              <strong>Split the cost</strong>
              <p>Save up to 75% on travel</p>
            </div>
          </div>
          <div class="feature">
            <span class="feature-icon">🌿</span>
            <div>
              <strong>Go greener</strong>
              <p>Reduce your carbon footprint</p>
            </div>
          </div>
          <div class="feature">
            <span class="feature-icon">🤝</span>
            <div>
              <strong>Trusted community</strong>
              <p>Verified drivers, rated rides</p>
            </div>
          </div>
        </div>

        <div class="testimonial">
          <p>"Saved ₹4,000 last month commuting Mumbai to Pune!"</p>
          <span>— Priya M., Regular Rider</span>
        </div>
      </div>

      <!-- RIGHT PANEL — Form -->
      <div class="right-panel">
        <div class="form-wrapper">

          <div class="form-header">
            <h2>Create account</h2>
            <p>Join thousands of commuters today</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()">

            <!-- Role Selector Cards -->
            <div class="role-section">
              <label class="section-label">I want to</label>
              <div class="role-cards">
                <div class="role-card"
                  [class.selected]="form.get('role')?.value === 'rider'"
                  (click)="setRole('rider')">
                  <span class="role-emoji">🧳</span>
                  <strong>Find Rides</strong>
                  <small>Book seats on available rides</small>
                </div>
                <div class="role-card"
                  [class.selected]="form.get('role')?.value === 'driver'"
                  (click)="setRole('driver')">
                  <span class="role-emoji">🚗</span>
                  <strong>Offer Rides</strong>
                  <small>Post rides and earn money</small>
                </div>
              </div>
            </div>

            <!-- Name Row -->
            <div class="input-row">
              <div class="field">
                <label>First Name</label>
                <div class="input-wrap" [class.error]="hasError('firstName')" [class.focused]="focused === 'firstName'">
                  <span class="input-icon">👤</span>
                  <input formControlName="firstName" placeholder="Sanya"
                    (focus)="focused = 'firstName'" (blur)="focused = ''" />
                </div>
                @if (hasError('firstName')) {
                  <span class="err">First name is required</span>
                }
              </div>
              <div class="field">
                <label>Last Name</label>
                <div class="input-wrap" [class.error]="hasError('lastName')" [class.focused]="focused === 'lastName'">
                  <span class="input-icon">👤</span>
                  <input formControlName="lastName" placeholder="Sinha"
                    (focus)="focused = 'lastName'" (blur)="focused = ''" />
                </div>
                @if (hasError('lastName')) {
                  <span class="err">Last name is required</span>
                }
              </div>
            </div>

            <!-- Email -->
            <div class="field">
              <label>Email address</label>
              <div class="input-wrap" [class.error]="hasError('email')" [class.focused]="focused === 'email'">
                <span class="input-icon">✉️</span>
                <input formControlName="email" type="email" placeholder="you@example.com"
                  (focus)="focused = 'email'" (blur)="focused = ''" />
              </div>
              @if (hasError('email')) {
                <span class="err">Enter a valid email</span>
              }
            </div>

            <!-- Phone -->
            <div class="field">
              <label>Phone <span class="optional">(optional)</span></label>
              <div class="input-wrap" [class.focused]="focused === 'phone'">
                <span class="input-icon">📱</span>
                <input formControlName="phone" type="tel" placeholder="9876543210"
                  (focus)="focused = 'phone'" (blur)="focused = ''" />
              </div>
            </div>

            <!-- Password -->
            <div class="field">
              <label>Password</label>
              <div class="input-wrap" [class.error]="hasError('password')" [class.focused]="focused === 'password'">
                <span class="input-icon">🔒</span>
                <input formControlName="password"
                  [type]="showPassword ? 'text' : 'password'"
                  placeholder="Min. 6 characters"
                  (focus)="focused = 'password'" (blur)="focused = ''" />
                <button type="button" class="toggle-btn" (click)="showPassword = !showPassword">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              @if (hasError('password')) {
                <span class="err">Minimum 6 characters required</span>
              }
              <!-- Password strength bar -->
              @if (form.get('password')?.value) {
                <div class="strength-bar">
                  <div class="strength-fill" [style.width]="strengthWidth" [style.background]="strengthColor"></div>
                </div>
                <span class="strength-label" [style.color]="strengthColor">{{ strengthLabel }}</span>
              }
            </div>

            <!-- Banners -->
            @if (errorMsg) {
              <div class="banner error-banner">⚠️ {{ errorMsg }}</div>
            }
            @if (successMsg) {
              <div class="banner success-banner">{{ successMsg }}</div>
            }

            <!-- Submit -->
            <button type="submit" class="submit-btn" [disabled]="loading">
              @if (loading) {
                <mat-spinner diameter="22" />
                <span>Creating account...</span>
              } @else {
                <span>Create Account</span>
                <span class="btn-arrow">→</span>
              }
            </button>

            <!-- Terms -->
            <p class="terms">
              By creating an account, you agree to our
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </p>

          </form>

          <div class="divider"><span>Already have an account?</span></div>

          <a routerLink="/login" class="login-btn">Sign in instead</a>

        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ── Reset ── */
    * { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Page Layout ── */
    .page {
      min-height: 100vh;
      display: flex;
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }

    /* ══════════════════════════════════
       LEFT PANEL — Warm Teal (60%)
    ══════════════════════════════════ */
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

    /* Decorative circles */
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
    .logo {
      font-size: 3rem;
      margin-bottom: 12px;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
    }
    .brand h1 {
      font-size: 2rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.5px;
      margin-bottom: 10px;
    }
    .brand p {
      color: rgba(255,255,255,0.8);
      font-size: 1.05rem;
      line-height: 1.6;
    }

    .features {
      display: flex;
      flex-direction: column;
      gap: 20px;
      position: relative;
      z-index: 1;
    }
    .feature {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 12px;
      padding: 14px 16px;
      backdrop-filter: blur(4px);
    }
    .feature-icon { font-size: 1.5rem; flex-shrink: 0; margin-top: 2px; }
    .feature strong { display: block; color: #fff; font-size: 0.95rem; margin-bottom: 2px; }
    .feature p { color: rgba(255,255,255,0.7); font-size: 0.82rem; }

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
      font-style: italic;
      font-size: 0.9rem;
      margin-bottom: 6px;
      line-height: 1.5;
    }
    .testimonial span { color: #F97316; font-size: 0.8rem; font-weight: 600; }

    /* ══════════════════════════════════
       RIGHT PANEL — Cream (30%)
    ══════════════════════════════════ */
    .right-panel {
      flex: 1;
      background: #FAFAF9;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 24px;
      overflow-y: auto;
    }

    .form-wrapper {
      width: 100%;
      max-width: 460px;
    }

    .form-header {
      margin-bottom: 28px;
    }
    .form-header h2 {
      font-size: 1.75rem;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.5px;
      margin-bottom: 4px;
    }
    .form-header p {
      color: #6B7280;
      font-size: 0.95rem;
    }

    /* ── Role Cards ── */
    .role-section { margin-bottom: 20px; }
    .section-label {
      display: block;
      font-size: 0.82rem;
      font-weight: 600;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }
    .role-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .role-card {
      border: 2px solid #E5E7EB;
      border-radius: 12px;
      padding: 16px 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 4px;
    }
    .role-card:hover {
      border-color: #0D9488;
      background: #F0FDFA;
    }
    .role-card.selected {
      border-color: #0D9488;
      background: #F0FDFA;
      box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
    }
    .role-emoji { font-size: 1.6rem; margin-bottom: 4px; }
    .role-card strong { font-size: 0.9rem; color: #111827; }
    .role-card small { font-size: 0.75rem; color: #6B7280; }
    .role-card.selected strong { color: #0D9488; }

    /* ── Input Row ── */
    .input-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    /* ── Fields ── */
    .field {
      margin-bottom: 16px;
    }
    .field label {
      display: block;
      font-size: 0.82rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 6px;
    }
    .optional { color: #9CA3AF; font-weight: 400; }

    .input-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1.5px solid #D1D5DB;
      border-radius: 10px;
      padding: 10px 14px;
      background: #fff;
      transition: all 0.2s ease;
    }
    .input-wrap.focused {
      border-color: #0D9488;
      box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.12);
    }
    .input-wrap.error {
      border-color: #EF4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    .input-icon { font-size: 1rem; flex-shrink: 0; }
    .input-wrap input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 0.93rem;
      color: #111827;
      background: transparent;
      font-family: inherit;
    }
    .input-wrap input::placeholder { color: #9CA3AF; }

    .toggle-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      padding: 0;
      line-height: 1;
    }

    .err {
      display: block;
      color: #EF4444;
      font-size: 0.78rem;
      margin-top: 4px;
    }

    /* ── Password Strength ── */
    .strength-bar {
      height: 3px;
      background: #E5E7EB;
      border-radius: 2px;
      margin-top: 8px;
      overflow: hidden;
    }
    .strength-fill {
      height: 100%;
      border-radius: 2px;
      transition: width 0.3s ease, background 0.3s ease;
    }
    .strength-label {
      font-size: 0.75rem;
      font-weight: 600;
      margin-top: 3px;
      display: block;
    }

    /* ── Banners ── */
    .banner {
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 16px;
    }
    .error-banner   { background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; }
    .success-banner { background: #D1FAE5; color: #065F46; border: 1px solid #A7F3D0; }

    /* ── Submit Button — Coral (10%) ── */
    .submit-btn {
      width: 100%;
      height: 50px;
      background: #F97316;
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.2s ease;
      letter-spacing: 0.3px;
      margin-bottom: 12px;
      font-family: inherit;
    }
    .submit-btn:hover:not([disabled]) {
      background: #EA580C;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
    }
    .submit-btn:active:not([disabled]) { transform: translateY(0); }
    .submit-btn[disabled] { background: #FED7AA; cursor: not-allowed; }
    .btn-arrow { font-size: 1.1rem; transition: transform 0.2s; }
    .submit-btn:hover .btn-arrow { transform: translateX(4px); }

    /* ── Terms ── */
    .terms {
      text-align: center;
      font-size: 0.78rem;
      color: #9CA3AF;
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .terms a { color: #0D9488; text-decoration: none; font-weight: 500; }
    .terms a:hover { text-decoration: underline; }

    /* ── Divider ── */
    .divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #E5E7EB;
    }
    .divider span { color: #9CA3AF; font-size: 0.82rem; white-space: nowrap; }

    /* ── Login Link Button ── */
    .login-btn {
      display: block;
      text-align: center;
      padding: 12px;
      border: 2px solid #0D9488;
      border-radius: 10px;
      color: #0D9488;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.93rem;
      transition: all 0.2s ease;
    }
    .login-btn:hover {
      background: #F0FDFA;
    }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .page { flex-direction: column; }
      .left-panel { width: 100%; padding: 32px 24px; min-height: auto; }
      .features { display: none; }
      .right-panel { padding: 32px 20px; }
      .input-row { grid-template-columns: 1fr; }
    }
  `]
})
export class RegisterComponent {
  form: FormGroup;
  loading      = false;
  showPassword = false;
  errorMsg     = '';
  successMsg   = '';
  focused      = '';

  constructor(
    private fb:     FormBuilder,
    private auth:   AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
      email:     ['', [Validators.required, Validators.email]],
      phone:     [''],
      role:      ['rider', Validators.required],
      password:  ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  setRole(role: string) {
    this.form.patchValue({ role });
  }

  hasError(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }

  get strengthWidth(): string {
    const pw = this.form.get('password')?.value || '';
    if (pw.length < 4) return '25%';
    if (pw.length < 6) return '50%';
    if (pw.length < 10 || !/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) return '75%';
    return '100%';
  }

  get strengthColor(): string {
    const pw = this.form.get('password')?.value || '';
    if (pw.length < 4) return '#EF4444';
    if (pw.length < 6) return '#F97316';
    if (pw.length < 10) return '#EAB308';
    return '#10B981';
  }

  get strengthLabel(): string {
    const pw = this.form.get('password')?.value || '';
    if (pw.length < 4) return 'Weak';
    if (pw.length < 6) return 'Fair';
    if (pw.length < 10) return 'Good';
    return 'Strong';
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading  = true;
    this.errorMsg = '';

    this.auth.register(this.form.value).subscribe({
      next: () => {
        this.successMsg = '✅ Account created! Redirecting to login...';
        this.loading    = false;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Registration failed';
        this.loading  = false;
      }
    });
  }
}