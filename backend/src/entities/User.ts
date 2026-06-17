// src/entities/User.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  OneToMany, BeforeInsert
} from 'typeorm';
import bcrypt from 'bcryptjs';
import { Ride } from './Ride';
import { Booking } from './Booking';

export enum UserRole {
  DRIVER = 'driver',
  RIDER  = 'rider',
  ADMIN  = 'admin'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;                 // hashed

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  profilePic: string;

 @Column({ type: 'simple-enum', enum: UserRole, default: UserRole.RIDER })
role!: UserRole;

  @Column({ default: 0, type: 'decimal', precision: 3, scale: 2 })
  rating: number;                   // avg driver rating

  @Column({ default: 0 })
  totalRatings: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Ride, ride => ride.driver)
  ridesAsDriver: Ride[];

  @OneToMany(() => Booking, booking => booking.rider)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  async comparePassword(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.password);
  }

  // Exclude password from JSON responses
  toJSON() {
    const { password, ...rest } = this as any;
    return rest;
  }
}