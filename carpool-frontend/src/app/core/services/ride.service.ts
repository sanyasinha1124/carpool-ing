// src/app/core/services/ride.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Ride, Booking } from '../models/models';

@Injectable({ providedIn: 'root' })
export class RideService {
  private api = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  searchRides(origin: string, dest: string, date: string, seats: number) {
    const params = new HttpParams()
      .set('origin', origin)
      .set('dest', dest)
      .set('date', date)
      .set('seats', seats.toString());
    return this.http.get<Ride[]>(`${this.api}/rides/search`, { params });
  }

  getRideById(id: string) {
    return this.http.get<Ride>(`${this.api}/rides/${id}`);
  }

  createRide(data: Partial<Ride>) {
    return this.http.post<Ride>(`${this.api}/rides`, data);
  }

  bookRide(rideId: string, seats: number) {
    return this.http.post<Booking>(`${this.api}/rides/${rideId}/book`, { seats });
  }

  getMyBookings() {
    return this.http.get<Booking[]>(`${this.api}/bookings/my`);
  }

  cancelBooking(bookingId: string) {
    return this.http.patch<Booking>(`${this.api}/bookings/${bookingId}/cancel`, {});
  }

  cancelRide(rideId: string) {
    return this.http.patch<Ride>(`${this.api}/rides/${rideId}/cancel`, {});
  }
}