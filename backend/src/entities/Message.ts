// src/entities/Message.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn
} from 'typeorm';
import { User } from './User';
import { Ride } from './Ride';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => Ride)
  @JoinColumn({ name: 'ride_id' })
  ride: Ride;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}