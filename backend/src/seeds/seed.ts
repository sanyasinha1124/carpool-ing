// src/seeds/seed.ts
import 'reflect-metadata';
import 'dotenv/config';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../entities/User';
import { Ride, RideStatus } from '../entities/Ride';
import { Booking, BookingStatus } from '../entities/Booking';
import { Rating } from '../entities/Rating';


const seed = async () => {
  await AppDataSource.initialize();
  console.log('🌱 Starting seed...');

  const userRepo    = AppDataSource.getRepository(User);
  const rideRepo    = AppDataSource.getRepository(Ride);
  const bookingRepo = AppDataSource.getRepository(Booking);
  const ratingRepo  = AppDataSource.getRepository(Rating);

  // ─── Clear existing data (order matters for FK constraints) ───
 // ─── Clear existing data (order matters for FK constraints) ───
await ratingRepo.clear();
await bookingRepo.clear();
await rideRepo.clear();
await userRepo.clear();
  console.log('🧹 Cleared existing data');

  // ─── Create Admin ───
  const admin = userRepo.create({
    email:     'admin@carpool.com',
    password:  'Admin@123',
    firstName: 'Admin',
    lastName:  'User',
    phone:     '9000000000',
    role:      UserRole.ADMIN,
    rating:    5.0,
  });
  await userRepo.save(admin);

  // ─── Create Drivers ───
  const driverData = [
    { firstName: 'Rahul',  lastName: 'Sharma', email: 'rahul@carpool.com',  phone: '9111111111', rating: 4.8 },
    { firstName: 'Priya',  lastName: 'Mehta',  email: 'priya@carpool.com',  phone: '9222222222', rating: 4.5 },
    { firstName: 'Arjun',  lastName: 'Patel',  email: 'arjun@carpool.com',  phone: '9333333333', rating: 4.9 },
    { firstName: 'Sneha',  lastName: 'Joshi',  email: 'sneha@carpool.com',  phone: '9444444444', rating: 4.3 },
    { firstName: 'Vikram', lastName: 'Singh',  email: 'vikram@carpool.com', phone: '9555555555', rating: 4.7 },
  ];

  const drivers: User[] = [];
  for (const d of driverData) {
    const driver = userRepo.create({
      ...d,
      password: 'Driver@123',
      role: UserRole.DRIVER,
      totalRatings: Math.floor(Math.random() * 50) + 10,
    });
    drivers.push(await userRepo.save(driver));
  }
  console.log(`✅ Created ${drivers.length} drivers`);

  // ─── Create Riders ───
  const riderData = [
    { firstName: 'Ananya', lastName: 'Das',    email: 'ananya@carpool.com',  phone: '9666666666' },
    { firstName: 'Rohan',  lastName: 'Gupta',  email: 'rohan@carpool.com',   phone: '9777777777' },
    { firstName: 'Kavya',  lastName: 'Nair',   email: 'kavya@carpool.com',   phone: '9888888888' },
    { firstName: 'Sanya',  lastName: 'Sinha',  email: 'sanya@carpool.com',   phone: '9999999999' },
    { firstName: 'Dhruv',  lastName: 'Verma',  email: 'dhruv@carpool.com',   phone: '9100000000' },
  ];

  const riders: User[] = [];
  for (const r of riderData) {
    const rider = userRepo.create({
      ...r,
      password: 'Rider@123',
      role: UserRole.RIDER,
    });
    riders.push(await userRepo.save(rider));
  }
  console.log(`✅ Created ${riders.length} riders`);

  // ─── Create Rides ───
  const tomorrow  = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter  = new Date(); dayAfter.setDate(dayAfter.getDate() + 2);
  const nextWeek  = new Date(); nextWeek.setDate(nextWeek.getDate() + 7);

  const rideData = [
    {
      driver: drivers[0],
      originCity: 'Mumbai',   originLat: 19.0760, originLng: 72.8777,
      destCity:   'Pune',     destLat:   18.5204, destLng:   73.8567,
      departureTime: new Date(tomorrow.setHours(7, 0, 0)),
      totalSeats: 4, availableSeats: 4,
      pricePerSeat: 350,
      vehicleModel: 'Swift Dzire', vehiclePlate: 'MH-01-AB-1234',
      notes: 'AC car, non-smoking please',
    },
    {
      driver: drivers[1],
      originCity: 'Pune',     originLat: 18.5204, originLng: 73.8567,
      destCity:   'Mumbai',   destLat:   19.0760, destLng:   72.8777,
      departureTime: new Date(tomorrow.setHours(8, 30, 0)),
      totalSeats: 3, availableSeats: 3,
      pricePerSeat: 380,
      vehicleModel: 'Honda City', vehiclePlate: 'MH-12-CD-5678',
      notes: 'Morning ride, will stop at Lonavala if needed',
    },
    {
      driver: drivers[2],
      originCity: 'Mumbai',   originLat: 19.0760, originLng: 72.8777,
      destCity:   'Nashik',   destLat:   19.9975, destLng:   73.7898,
      departureTime: new Date(dayAfter.setHours(6, 0, 0)),
      totalSeats: 4, availableSeats: 2,
      pricePerSeat: 450,
      vehicleModel: 'Innova Crysta', vehiclePlate: 'MH-04-EF-9012',
      notes: 'Spacious SUV, luggage ok',
    },
    {
      driver: drivers[3],
      originCity: 'Navi Mumbai', originLat: 19.0330, originLng: 73.0297,
      destCity:   'Pune',        destLat:   18.5204, destLng:   73.8567,
      departureTime: new Date(tomorrow.setHours(9, 0, 0)),
      totalSeats: 3, availableSeats: 3,
      pricePerSeat: 320,
      vehicleModel: 'Maruti Baleno', vehiclePlate: 'MH-43-GH-3456',
    },
    {
      driver: drivers[4],
      originCity: 'Mumbai',   originLat: 19.0760, originLng: 72.8777,
      destCity:   'Goa',      destLat:   15.2993, destLng:   74.1240,
      departureTime: new Date(nextWeek.setHours(5, 0, 0)),
      totalSeats: 5, availableSeats: 5,
      pricePerSeat: 1200,
      vehicleModel: 'Kia Carens', vehiclePlate: 'MH-02-IJ-7890',
      notes: 'Weekend Goa trip! Long drive, music and fun.',
    },
    {
      driver: drivers[0],
      originCity: 'Pune',     originLat: 18.5204, originLng: 73.8567,
      destCity:   'Nashik',   destLat:   19.9975, destLng:   73.7898,
      departureTime: new Date(dayAfter.setHours(10, 0, 0)),
      totalSeats: 4, availableSeats: 4,
      pricePerSeat: 400,
      vehicleModel: 'Swift Dzire', vehiclePlate: 'MH-01-AB-1234',
    },
    // A completed ride (for testing history)
    {
      driver: drivers[1],
      originCity: 'Mumbai',   originLat: 19.0760, originLng: 72.8777,
      destCity:   'Pune',     destLat:   18.5204, destLng:   73.8567,
      departureTime: new Date('2024-01-10T07:00:00'),
      totalSeats: 3, availableSeats: 0,
      pricePerSeat: 350,
      status: RideStatus.COMPLETED,
      vehicleModel: 'Honda City', vehiclePlate: 'MH-12-CD-5678',
    },
  ];

  const rides: Ride[] = [];
  for (const r of rideData) {
    const ride = rideRepo.create(r as Partial<Ride>);
    rides.push(await rideRepo.save(ride));
  }
  console.log(`✅ Created ${rides.length} rides`);

  // ─── Create Bookings ───
  // Booking 1: Sanya books Mumbai→Pune
  const booking1 = bookingRepo.create({
    rider:        riders[3],      // Sanya
    ride:         rides[0],       // Mumbai→Pune
    seatsBooked:  1,
    totalAmount:  350,
    status:       BookingStatus.CONFIRMED,
  });
  await bookingRepo.save(booking1);
  rides[0].availableSeats -= 1;
  await rideRepo.save(rides[0]);

  // Booking 2: Rohan books Mumbai→Pune (same ride, 2 seats)
  const booking2 = bookingRepo.create({
    rider:       riders[1],       // Rohan
    ride:        rides[0],
    seatsBooked: 2,
    totalAmount: 700,
    status:      BookingStatus.CONFIRMED,
  });
  await bookingRepo.save(booking2);
  rides[0].availableSeats -= 2;
  await rideRepo.save(rides[0]);

  // Booking 3: Ananya books Pune→Mumbai
  const booking3 = bookingRepo.create({
    rider:       riders[0],       // Ananya
    ride:        rides[1],
    seatsBooked: 1,
    totalAmount: 380,
    status:      BookingStatus.CONFIRMED,
  });
  await bookingRepo.save(booking3);

  // Booking 4: Cancelled booking example
  const booking4 = bookingRepo.create({
    rider:              riders[4],    // Dhruv
    ride:               rides[2],
    seatsBooked:        1,
    totalAmount:        450,
    status:             BookingStatus.CANCELLED,
    cancellationReason: 'Change of plans',
  });
  await bookingRepo.save(booking4);

  // Booking 5: Completed ride booking
  const booking5 = bookingRepo.create({
    rider:       riders[3],           // Sanya
    ride:        rides[6],            // completed ride
    seatsBooked: 1,
    totalAmount: 350,
    status:      BookingStatus.COMPLETED,
  });
  await bookingRepo.save(booking5);

  console.log('✅ Created 5 bookings');

  // ─── Create Ratings ───
  // Sanya rates driver Priya after completed ride
  const rating1 = ratingRepo.create({
    rater:   riders[3],
    rated:   drivers[1],
    ride:    rides[6],
    score:   5,
    comment: 'Excellent driver, very punctual and comfortable ride!',
  });
  await ratingRepo.save(rating1);

  // Update driver's average rating
  drivers[1].rating      = 4.5;
  drivers[1].totalRatings = drivers[1].totalRatings + 1;
  await userRepo.save(drivers[1]);

  console.log('✅ Created ratings');

  // ─── Summary ───
  console.log('\n🎉 Seed complete! Test accounts:');
  console.log('─────────────────────────────────────────');
  console.log('ADMIN  → admin@carpool.com   / Admin@123');
  console.log('DRIVER → rahul@carpool.com   / Driver@123');
  console.log('DRIVER → priya@carpool.com   / Driver@123');
  console.log('DRIVER → arjun@carpool.com   / Driver@123');
  console.log('RIDER  → sanya@carpool.com   / Rider@123');
  console.log('RIDER  → rohan@carpool.com   / Rider@123');
  console.log('RIDER  → ananya@carpool.com  / Rider@123');
  console.log('─────────────────────────────────────────');

  await AppDataSource.destroy();
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});