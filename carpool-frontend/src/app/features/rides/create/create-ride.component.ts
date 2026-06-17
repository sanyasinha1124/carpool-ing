// ============================================================
// FILE: src/app/features/rides/create/create-ride.component.ts
// ============================================================
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RideService } from '../../../core/services/ride.service';

// @ts-ignore — paste this into the file replacing everything
export const CreateRideComponent = `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RideService } from '../../../core/services/ride.service';

@Component({
  selector: 'app-create-ride',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatProgressSpinnerModule],
  template: \`
    <div class="create-page">

      <div class="create-header">
        <a routerLink="/dashboard" class="back-btn">← Back</a>
        <div>
          <h2>Post a Ride 🚗</h2>
          <p>Share your journey and split the cost</p>
        </div>
      </div>

      <div class="create-card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">

          <!-- Route Section -->
          <div class="form-section">
            <div class="section-title">
              <span class="section-icon">📍</span>
              <h4>Route Details</h4>
            </div>
            <div class="form-row">
              <div class="field">
                <label>From City *</label>
                <div class="input-wrap" [class.focused]="focused==='originCity'" [class.error]="hasErr('originCity')">
                  <input formControlName="originCity" placeholder="e.g. Mumbai"
                    (focus)="focused='originCity'" (blur)="focused=''" />
                </div>
                @if (hasErr('originCity')) { <span class="err">Required</span> }
              </div>
              <div class="field">
                <label>To City *</label>
                <div class="input-wrap" [class.focused]="focused==='destCity'" [class.error]="hasErr('destCity')">
                  <input formControlName="destCity" placeholder="e.g. Pune"
                    (focus)="focused='destCity'" (blur)="focused=''" />
                </div>
                @if (hasErr('destCity')) { <span class="err">Required</span> }
              </div>
            </div>
            <div class="form-row">
              <div class="field">
                <label>Origin Lat</label>
                <div class="input-wrap" [class.focused]="focused==='originLat'">
                  <input formControlName="originLat" type="number" placeholder="19.0760"
                    (focus)="focused='originLat'" (blur)="focused=''" />
                </div>
              </div>
              <div class="field">
                <label>Origin Lng</label>
                <div class="input-wrap" [class.focused]="focused==='originLng'">
                  <input formControlName="originLng" type="number" placeholder="72.8777"
                    (focus)="focused='originLng'" (blur)="focused=''" />
                </div>
              </div>
              <div class="field">
                <label>Dest Lat</label>
                <div class="input-wrap" [class.focused]="focused==='destLat'">
                  <input formControlName="destLat" type="number" placeholder="18.5204"
                    (focus)="focused='destLat'" (blur)="focused=''" />
                </div>
              </div>
              <div class="field">
                <label>Dest Lng</label>
                <div class="input-wrap" [class.focused]="focused==='destLng'">
                  <input formControlName="destLng" type="number" placeholder="73.8567"
                    (focus)="focused='destLng'" (blur)="focused=''" />
                </div>
              </div>
            </div>
          </div>

          <!-- Schedule Section -->
          <div class="form-section">
            <div class="section-title">
              <span class="section-icon">🕐</span>
              <h4>Schedule</h4>
            </div>
            <div class="field">
              <label>Departure Date & Time *</label>
              <div class="input-wrap" [class.focused]="focused==='dep'" [class.error]="hasErr('departureTime')">
                <input formControlName="departureTime" type="datetime-local"
                  (focus)="focused='dep'" (blur)="focused=''" />
              </div>
              @if (hasErr('departureTime')) { <span class="err">Required</span> }
            </div>
          </div>

          <!-- Vehicle Section -->
          <div class="form-section">
            <div class="section-title">
              <span class="section-icon">🚙</span>
              <h4>Vehicle & Pricing</h4>
            </div>
            <div class="form-row">
              <div class="field">
                <label>Vehicle Model</label>
                <div class="input-wrap" [class.focused]="focused==='vm'">
                  <input formControlName="vehicleModel" placeholder="Swift Dzire"
                    (focus)="focused='vm'" (blur)="focused=''" />
                </div>
              </div>
              <div class="field">
                <label>Number Plate</label>
                <div class="input-wrap" [class.focused]="focused==='vp'">
                  <input formControlName="vehiclePlate" placeholder="MH-01-AB-1234"
                    (focus)="focused='vp'" (blur)="focused=''" />
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="field">
                <label>Total Seats *</label>
                <div class="input-wrap" [class.focused]="focused==='ts'" [class.error]="hasErr('totalSeats')">
                  <input formControlName="totalSeats" type="number" min="1" max="8" placeholder="4"
                    (focus)="focused='ts'" (blur)="focused=''" />
                </div>
              </div>
              <div class="field">
                <label>Price per Seat (₹) *</label>
                <div class="input-wrap" [class.focused]="focused==='ps'" [class.error]="hasErr('pricePerSeat')">
                  <input formControlName="pricePerSeat" type="number" placeholder="350"
                    (focus)="focused='ps'" (blur)="focused=''" />
                </div>
              </div>
            </div>
          </div>

          <!-- Notes Section -->
          <div class="form-section">
            <div class="section-title">
              <span class="section-icon">📝</span>
              <h4>Additional Info</h4>
            </div>
            <div class="field">
              <label>Notes <span class="optional">(optional)</span></label>
              <div class="input-wrap textarea-wrap" [class.focused]="focused==='notes'">
                <textarea formControlName="notes" rows="3"
                  placeholder="AC car, non-smoking, music allowed..."
                  (focus)="focused='notes'" (blur)="focused=''"></textarea>
              </div>
            </div>
          </div>

          @if (errorMsg) {
            <div class="error-banner">⚠️ {{ errorMsg }}</div>
          }

          <button type="submit" class="submit-btn" [disabled]="loading">
            @if (loading) {
              <mat-spinner diameter="22" />
              <span>Posting...</span>
            } @else {
              <span>🚗 Post Ride</span>
              <span>→</span>
            }
          </button>

        </form>
      </div>
    </div>
  \`,
  styles: [\`
    * { box-sizing: border-box; }
    .create-page {
      max-width: 760px; margin: 0 auto;
      padding: 32px 24px; min-height: 100vh;
      background: #FAFAF9;
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }
    .create-header { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 28px; }
    .back-btn {
      color: #0D9488; text-decoration: none; font-weight: 600;
      font-size: 0.9rem; padding: 8px 0; white-space: nowrap; margin-top: 4px;
    }
    .create-header h2 { font-size: 1.6rem; font-weight: 800; color: #111827; margin-bottom: 4px; }
    .create-header p  { color: #6B7280; font-size: 0.9rem; }

    .create-card { background: #fff; border-radius: 16px; padding: 28px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }

    .form-section { margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px solid #F3F4F6; }
    .form-section:last-of-type { border-bottom: none; margin-bottom: 0; }
    .section-title { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
    .section-icon { font-size: 1.2rem; }
    .section-title h4 { font-size: 1rem; font-weight: 700; color: #111827; margin: 0; }

    .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; }

    .field { margin-bottom: 4px; }
    .field label { display: block; font-size: 0.82rem; font-weight: 600; color: #374151; margin-bottom: 6px; }
    .optional { color: #9CA3AF; font-weight: 400; }

    .input-wrap {
      border: 1.5px solid #D1D5DB; border-radius: 10px;
      padding: 10px 14px; background: #fff; transition: all 0.2s;
    }
    .input-wrap.focused { border-color: #0D9488; box-shadow: 0 0 0 3px rgba(13,148,136,0.12); }
    .input-wrap.error   { border-color: #EF4444; }
    .input-wrap.textarea-wrap { padding: 12px 14px; }
    .input-wrap input, .input-wrap textarea {
      width: 100%; border: none; outline: none;
      font-size: 0.9rem; color: #111827;
      background: transparent; font-family: inherit; resize: vertical;
    }
    .input-wrap input::placeholder, .input-wrap textarea::placeholder { color: #9CA3AF; }
    .err { display: block; color: #EF4444; font-size: 0.78rem; margin-top: 4px; }

    .error-banner {
      background: #FEE2E2; color: #991B1B;
      padding: 12px 16px; border-radius: 10px;
      margin-bottom: 16px; font-size: 0.875rem;
    }
    .submit-btn {
      width: 100%; height: 50px; background: #F97316;
      color: #fff; border: none; border-radius: 10px;
      font-size: 1rem; font-weight: 700; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      gap: 10px; transition: all 0.2s; font-family: inherit;
    }
    .submit-btn:hover:not([disabled]) {
      background: #EA580C;
      box-shadow: 0 4px 12px rgba(249,115,22,0.4);
    }
    .submit-btn[disabled] { background: #FED7AA; cursor: not-allowed; }

    @media (max-width: 640px) {
      .form-row { grid-template-columns: 1fr; }
    }
  \`]
})
export class CreateRideComponent {
  form = this.fb.group({
    originCity:    ['', Validators.required],
    originLat:     [''],
    originLng:     [''],
    destCity:      ['', Validators.required],
    destLat:       [''],
    destLng:       [''],
    departureTime: ['', Validators.required],
    totalSeats:    [1,  Validators.required],
    pricePerSeat:  ['', Validators.required],
    vehicleModel:  [''],
    vehiclePlate:  [''],
    notes:         ['']
  });

  loading  = false;
  errorMsg = '';
  focused  = '';

  constructor(private fb: FormBuilder, private rideService: RideService, private router: Router) {}

  hasErr(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.rideService.createRide(this.form.value as any).subscribe({
      next: () => {
        alert('✅ Ride posted successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Failed to post ride';
        this.loading  = false;
      }
    });
  }
}
`;

