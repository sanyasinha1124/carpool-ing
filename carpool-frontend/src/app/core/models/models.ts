export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profilePic?: string;
  role: 'driver' | 'rider' | 'admin';
  rating: number;
  totalRatings: number;
  isActive: boolean;
  createdAt: string;
}

export interface Ride {
  id: string;
  driver: User;
  originCity: string;
  originLat: number;
  originLng: number;
  destCity: string;
  destLat: number;
  destLng: number;
  departureTime: string;
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  notes?: string;
  vehicleModel?: string;
  vehiclePlate?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  ride: Ride;
  rider: User;
  seatsBooked: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  cancellationReason?: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  rater: User;
  rated: User;
  ride: Ride;
  score: number;
  comment?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  error: string;
}