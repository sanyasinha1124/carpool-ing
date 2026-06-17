// src/entities/Booking.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { User } from './User';
import { Ride } from './Ride';

export enum BookingStatus {
  PENDING    = 'pending',
  CONFIRMED  = 'confirmed',
  CANCELLED  = 'cancelled',
  COMPLETED  = 'completed'
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.bookings, { eager: true })
  @JoinColumn({ name: 'rider_id' })
  rider: User;

  @ManyToOne(() => Ride, ride => ride.bookings)
  @JoinColumn({ name: 'ride_id' })
  ride: Ride;

  @Column({ type: 'int', default: 1 })
  seatsBooked: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  totalAmount: number;

 @Column({ type: 'simple-enum', enum: BookingStatus, default: BookingStatus.PENDING })
status!: BookingStatus;

  @Column({ nullable: true })
  cancellationReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}