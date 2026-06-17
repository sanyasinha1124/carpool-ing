// src/entities/Ride.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, CreateDateColumn,
  UpdateDateColumn, JoinColumn, Index
} from 'typeorm';
import { User } from './User';
import {Booking} from './Booking';

export enum RideStatus {
  SCHEDULED  = 'scheduled',
  ACTIVE     = 'active',
  COMPLETED  = 'completed',
  CANCELLED  = 'cancelled'
}

@Entity('rides')
@Index(['departureTime'])              // Fast search by time
@Index(['originCity', 'destCity'])     // Fast search by route
export class Ride {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.ridesAsDriver, { eager: true })
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column()
  originCity: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  originLat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  originLng: number;

  @Column()
  destCity: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  destLat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  destLng: number;

  @Column()
  departureTime: Date;

  @Column({ type: 'int' })
  totalSeats: number;

  @Column({ type: 'int' })
  availableSeats: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  pricePerSeat: number;
  
@Column({ type: 'simple-enum', enum: RideStatus, default: RideStatus.SCHEDULED })
status!: RideStatus;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  vehicleModel: string;

  @Column({ nullable: true })
  vehiclePlate: string;

  @OneToMany(() => Booking, booking => booking.ride)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
