import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RideService } from '../../core/services/ride.service';
import {AuthService} from '../../core/services/auth.service';
import { Ride } from '../../core/models/models';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatProgressSpinnerModule],
  template: `
    <div class="search-page">

      <!-- Hero -->
      <div class="hero">
        <div class="hero-text">
          <h1>Where are you heading? 🚗</h1>
          <p>Find affordable rides with verified drivers</p>
        </div>

        <form [formGroup]="searchForm" (ngSubmit)="search()" class="search-bar">
          <div class="search-field">
            <span class="s-icon">📍</span>
            <input formControlName="origin" placeholder="From city (e.g. Mumbai)" />
          </div>
          <div class="s-arrow">→</div>
          <div class="search-field">
            <span class="s-icon">🏁</span>
            <input formControlName="dest" placeholder="To city (e.g. Pune)" />
          </div>
          <div class="search-field narrow">
            <span class="s-icon">📅</span>
            <input formControlName="date" type="date" />
          </div>
          <div class="search-field narrow">
            <span class="s-icon">👤</span>
            <input formControlName="seats" type="number" min="1" max="8" placeholder="Seats" />
          </div>
          <button type="submit" class="search-btn" [disabled]="loading()">
            @if (loading()) { <mat-spinner diameter="20" /> }
            @else { Search }
          </button>
        </form>
      </div>

      <!-- Quick Routes -->
      @if (!searched()) {
        <div class="quick-routes">
          <p class="qr-label">🔥 Popular routes</p>
          <div class="qr-chips">
            @for (r of popularRoutes; track r.from) {
              <div class="qr-chip" (click)="quickSearch(r.from, r.to)">
                {{ r.from }} → {{ r.to }}
              </div>
            }
          </div>
        </div>
      }

      <!-- Results -->
      <div class="results">
        @if (searched() && rides().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">🚌</div>
            <h3>No rides found</h3>
            <p>Try a different date or nearby city</p>
          </div>
        }

        @if (rides().length > 0) {
          <div class="results-header">
            <h3>{{ rides().length }} ride(s) available</h3>
            <span>Sorted by departure time</span>
          </div>
        }

        @for (ride of rides(); track ride.id) {
          <div class="ride-card">

            <!-- Driver -->
            <div class="driver-section">
              <div class="driver-avatar">{{ ride.driver.firstName.charAt(0) }}</div>
              <div>
                <div class="driver-name">{{ ride.driver.firstName }} {{ ride.driver.lastName }}</div>
                <div class="driver-rating">⭐ {{ ride.driver.rating }} · {{ ride.vehicleModel }}</div>
              </div>
            </div>

            <!-- Route -->
            <div class="route-section">
              <div class="route-city origin">{{ ride.originCity }}</div>
              <div class="route-visual">
                <span class="dot green"></span>
                <span class="dash-line"></span>
                <span class="dot coral"></span>
              </div>
              <div class="route-city dest">{{ ride.destCity }}</div>
            </div>

            <!-- Meta -->
            <div class="meta-section">
              <div class="meta-item">🕐 {{ ride.departureTime | date:'EEE, MMM d · h:mm a' }}</div>
              <div class="meta-item">
                💺 <span [class.low-seats]="ride.availableSeats <= 2">
                  {{ ride.availableSeats }} seat(s) left
                </span>
              </div>
              @if (ride.notes) {
                <div class="meta-item notes">📝 {{ ride.notes }}</div>
              }
            </div>

            <!-- Price & Book -->
            <div class="price-section">
              <div class="price">₹{{ ride.pricePerSeat }}</div>
              <div class="price-label">per seat</div>
              <button class="book-btn"
                [disabled]="ride.availableSeats === 0 || booking()"
                (click)="bookRide(ride)">
                @if (booking()) { Booking... }
                @else if (ride.availableSeats === 0) { Full }
                @else { Book Now }
              </button>
            </div>

          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }

    .search-page {
      min-height: 100vh;
      background: #FAFAF9;
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }

    /* ── Hero ── */
    .hero {
      background: linear-gradient(160deg, #0D9488 0%, #0a7c71 100%);
      padding: 48px 32px 56px;
      text-align: center;
    }
    .hero-text { margin-bottom: 28px; }
    .hero-text h1 { color: #fff; font-size: 2rem; font-weight: 800; margin-bottom: 8px; }
    .hero-text p  { color: rgba(255,255,255,0.8); font-size: 1rem; }

    /* ── Search Bar ── */
    .search-bar {
      display: flex;
      align-items: center;
      background: #fff;
      border-radius: 16px;
      padding: 8px;
      max-width: 900px;
      margin: 0 auto;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
      gap: 4px;
      flex-wrap: wrap;
    }
    .search-field {
      display: flex; align-items: center; gap: 8px;
      flex: 1; min-width: 150px;
      padding: 10px 12px;
      border-radius: 10px;
      transition: background 0.2s;
    }
    .search-field:focus-within { background: #F0FDFA; }
    .search-field.narrow { flex: 0 0 140px; }
    .s-icon { font-size: 1rem; flex-shrink: 0; }
    .search-field input {
      border: none; outline: none; width: 100%;
      font-size: 0.9rem; color: #111827;
      background: transparent; font-family: inherit;
    }
    .search-field input::placeholder { color: #9CA3AF; }
    .s-arrow { color: #9CA3AF; font-size: 1.2rem; padding: 0 4px; }
    .search-btn {
      background: #F97316; color: #fff;
      border: none; border-radius: 10px;
      padding: 12px 28px; font-size: 0.95rem;
      font-weight: 700; cursor: pointer;
      transition: all 0.2s; white-space: nowrap;
      display: flex; align-items: center; gap: 8px;
      font-family: inherit;
    }
    .search-btn:hover:not([disabled]) {
      background: #EA580C;
      box-shadow: 0 4px 12px rgba(249,115,22,0.4);
    }
    .search-btn[disabled] { background: #FED7AA; cursor: not-allowed; }

    /* ── Quick Routes ── */
    .quick-routes { padding: 24px 32px; max-width: 960px; margin: 0 auto; }
    .qr-label { font-size: 0.85rem; font-weight: 600; color: #6B7280; margin-bottom: 12px; }
    .qr-chips { display: flex; flex-wrap: wrap; gap: 10px; }
    .qr-chip {
      padding: 8px 16px; border-radius: 20px;
      background: #fff; border: 1.5px solid #E5E7EB;
      font-size: 0.85rem; color: #374151;
      cursor: pointer; transition: all 0.2s;
    }
    .qr-chip:hover { border-color: #0D9488; color: #0D9488; background: #F0FDFA; }

    /* ── Results ── */
    .results { max-width: 960px; margin: 0 auto; padding: 16px 32px 40px; }
    .results-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 16px;
    }
    .results-header h3 { font-size: 1.1rem; font-weight: 700; color: #111827; }
    .results-header span { font-size: 0.82rem; color: #6B7280; }

    /* ── Ride Card ── */
    .ride-card {
      background: #fff;
      border-radius: 16px;
      padding: 20px 24px;
      margin-bottom: 16px;
      display: grid;
      grid-template-columns: 180px 1fr 1fr 140px;
      align-items: center;
      gap: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      border: 1px solid #F3F4F6;
      transition: all 0.2s;
    }
    .ride-card:hover {
      box-shadow: 0 8px 24px rgba(13,148,136,0.1);
      border-color: #CCFBF1;
      transform: translateY(-2px);
    }

    /* Driver */
    .driver-section { display: flex; align-items: center; gap: 12px; }
    .driver-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, #0D9488, #0a7c71);
      color: #fff; font-size: 1.1rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .driver-name { font-weight: 600; color: #111827; font-size: 0.9rem; }
    .driver-rating { font-size: 0.78rem; color: #6B7280; margin-top: 2px; }

    /* Route */
    .route-section { display: flex; align-items: center; gap: 12px; }
    .route-city { font-size: 1rem; font-weight: 700; color: #111827; }
    .route-visual { display: flex; align-items: center; gap: 4px; flex: 1; }
    .dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .dot.green { background: #0D9488; }
    .dot.coral { background: #F97316; }
    .dash-line { flex: 1; height: 2px; background: repeating-linear-gradient(90deg, #D1D5DB 0, #D1D5DB 4px, transparent 4px, transparent 8px); }

    /* Meta */
    .meta-section { display: flex; flex-direction: column; gap: 6px; }
    .meta-item { font-size: 0.82rem; color: #4B5563; display: flex; align-items: center; gap: 6px; }
    .meta-item.notes { color: #6B7280; font-style: italic; }
    .low-seats { color: #F97316; font-weight: 600; }

    /* Price */
    .price-section { text-align: center; }
    .price { font-size: 1.5rem; font-weight: 800; color: #0D9488; }
    .price-label { font-size: 0.75rem; color: #9CA3AF; margin-bottom: 10px; }
    .book-btn {
      width: 100%; padding: 10px 0;
      background: #F97316; color: #fff;
      border: none; border-radius: 8px;
      font-size: 0.88rem; font-weight: 700;
      cursor: pointer; transition: all 0.2s;
      font-family: inherit;
    }
    .book-btn:hover:not([disabled]) { background: #EA580C; }
    .book-btn[disabled] { background: #E5E7EB; color: #9CA3AF; cursor: not-allowed; }

    /* Empty */
    .empty-state {
      text-align: center; padding: 60px 20px;
      background: #fff; border-radius: 16px;
    }
    .empty-icon { font-size: 3rem; margin-bottom: 16px; }
    .empty-state h3 { color: #111827; margin-bottom: 8px; }
    .empty-state p  { color: #6B7280; }

    @media (max-width: 768px) {
      .ride-card { grid-template-columns: 1fr; }
      .search-bar { flex-direction: column; }
      .search-field.narrow { flex: 1; width: 100%; }
      .hero { padding: 32px 20px 40px; }
      .results { padding: 16px 20px; }
    }
  `]
})
export class BookingsComponent {
  searchForm!: any;

  rides    = signal<Ride[]>([]);
  loading  = signal(false);
  booking  = signal(false);
  searched = signal(false);

  popularRoutes = [
    { from: 'Mumbai',      to: 'Pune'   },
    { from: 'Pune',        to: 'Mumbai' },
    { from: 'Mumbai',      to: 'Nashik' },
    { from: 'Navi Mumbai', to: 'Pune'   },
    { from: 'Mumbai',      to: 'Goa'    },
  ];

  constructor(
    private fb:          FormBuilder,
    private rideService: RideService,
    public  auth:        AuthService,
    private router:      Router
  ) {}

  quickSearch(from: string, to: string) {
    this.searchForm.patchValue({ origin: from, dest: to });
    this.search();
  }

  search() {
    if (this.searchForm.invalid) return;
    const { origin, dest, date, seats } = this.searchForm.value;
    this.loading.set(true);
    this.searched.set(false);

    this.rideService.searchRides(origin!, dest!, date!, seats!)
      .subscribe({
        next: (rides) => {
          this.rides.set(rides);
          this.loading.set(false);
          this.searched.set(true);
        },
        error: () => this.loading.set(false)
      });
  }

  bookRide(ride: Ride) {
    this.booking.set(true);
    this.rideService.bookRide(ride.id, 1).subscribe({
      next: () => {
        alert(`✅ Booked! ${ride.originCity} → ${ride.destCity}`);
        this.booking.set(false);
        this.router.navigate(['/bookings']);
      },
      error: (err) => {
        alert(err.error?.error || 'Booking failed');
        this.booking.set(false);
      }
    });
  }
}