// src/entities/Rating.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn
} from 'typeorm';
import { User } from './User';
import { Ride } from './Ride';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'rater_id' })
  rater: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'rated_id' })
  rated: User;

  @ManyToOne(() => Ride)
  ride: Ride;

  @Column({ type: 'int' })
  score: number;               // 1–5

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}