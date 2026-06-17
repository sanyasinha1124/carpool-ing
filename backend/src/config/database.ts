// src/config/database.ts
import { DataSource } from 'typeorm';
import {  User } from '../entities/User';
import { Ride } from '../entities/Ride';
import {  Booking } from '../entities/Booking';
import { Rating } from '../entities/Rating';
import {  Message } from '../entities/Message';

export const AppDataSource = new DataSource({
 type: 'better-sqlite3',          // ← SQLite, no server needed
  database: 'carpool.db',          // ← creates a file in backend/
  synchronize: false,               // ← OK for dev with SQLite
  logging: true,
  entities: [User, Ride, Booking, Rating, Message],
  migrations: ['src/migrations/*.ts'],  
  subscribers: [],
});

// SQLite alternative for quick dev:
// type: 'sqlite', database: 'carpool.db'