// src/services/ride.service.ts
import { AppDataSource } from '../config/database';
import { Ride, RideStatus } from '../entities/Ride';
import {Booking, BookingStatus} from '../entities/Booking';
import { User } from '../entities/User';

const rideRepo    = AppDataSource.getRepository(Ride);
const bookingRepo = AppDataSource.getRepository(Booking);

export const RideService = {

  async createRide(driverId: string, data: Partial<Ride>) {
    const driver = await AppDataSource.getRepository(User)
      .findOneOrFail({ where: { id: driverId } });

    const ride = rideRepo.create({
      ...data,
      driver,
      availableSeats: data.totalSeats
    });
    return rideRepo.save(ride);
  },

  async searchRides(origin: string, dest: string, date: string, seats: number) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return rideRepo.createQueryBuilder('ride')
      .leftJoinAndSelect('ride.driver', 'driver')
      .where('LOWER(ride.originCity) LIKE :origin', { origin: `%${origin.toLowerCase()}%` })
      .andWhere('LOWER(ride.destCity) LIKE :dest', { dest: `%${dest.toLowerCase()}%` })
      .andWhere('ride.departureTime BETWEEN :start AND :end', {
        start: startOfDay, end: endOfDay
      })
      .andWhere('ride.availableSeats >= :seats', { seats })
      .andWhere('ride.status = :status', { status: RideStatus.SCHEDULED })
      .orderBy('ride.departureTime', 'ASC')
      .getMany();
  },

// TRANSACTION: booking must decrement seats atomically
  async bookRide(riderId: string, rideId: string, seats: number) {
    return AppDataSource.transaction(async (manager) => {
      // ✅ Removed .setLock('pessimistic_write') to make it SQLite compatible
      const ride = await manager
        .getRepository(Ride)
        .createQueryBuilder('ride')
        .where('ride.id = :id', { id: rideId })
        .getOne();

      if (!ride) throw new Error('Ride not found');
      if (ride.availableSeats < seats) throw new Error('Not enough seats');
      if (ride.status !== RideStatus.SCHEDULED) throw new Error('Ride not available');

      // Deduct available seats
      ride.availableSeats -= seats;
      await manager.save(ride);

      const rider = await manager.getRepository(User)
        .findOneOrFail({ where: { id: riderId } });

      const booking = manager.getRepository(Booking).create({
        rider,
        ride,
        seatsBooked: seats,
        totalAmount: ride.pricePerSeat * seats,
        status: BookingStatus.CONFIRMED
      });

      return manager.getRepository(Booking).save(booking);
    });
  },

  async cancelBooking(bookingId: string, userId: string) {
    return AppDataSource.transaction(async (manager) => {
      const booking = await manager.getRepository(Booking).findOne({
        where: { id: bookingId },
        relations: { rider: true, ride: true }
      });

      if (!booking) throw new Error('Booking not found');
      if (booking.rider.id !== userId) throw new Error('Unauthorized');
      if (booking.status === BookingStatus.CANCELLED) throw new Error('Already cancelled');

      booking.status = BookingStatus.CANCELLED;
      await manager.save(booking);

      // Return seats to ride
      const ride = booking.ride;
      ride.availableSeats += booking.seatsBooked;
      await manager.save(ride);

      return booking;
    });
  }
};