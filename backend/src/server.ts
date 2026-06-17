// // src/server.ts
// import 'dotenv/config';
// import 'reflect-metadata';
// import express from 'express';
// import cors from 'cors';
// import http from 'http';
// import { Server } from 'socket.io';
// import { AppDataSource } from './config/database';
// import authRoutes     from './routes/auth.routes';
// import rideRoutes     from './routes/rides.routes';    // ← correct name
// import bookingRoutes  from './routes/bookings.routes';
// import { setupSocket } from './socket/socket';

// const app        = express();
// const httpServer = http.createServer(app);
// const io         = new Server(httpServer, {
//   cors: { origin: 'http://localhost:4200' }
// });

// app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
// app.use(express.json());

// app.use('/api/auth',     authRoutes);
// app.use('/api/rides',    rideRoutes);
// app.use('/api/bookings', bookingRoutes);

// setupSocket(io);

// AppDataSource.initialize()
//   .then(() => {
//     console.log('✅ Database connected');
//     httpServer.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
//   })
//   .catch(err => {
//     console.error('❌ DB Error:', err);
//     process.exit(1);
//   });

import 'dotenv/config';
import 'reflect-metadata';
import http from 'http';
import { Server } from 'socket.io';
import { AppDataSource } from './config/database';
import { setupSocket } from './socket/socket';
import app from './config/app';

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:4200' }
});

setupSocket(io);

AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected');
    httpServer.listen(3000, () =>
      console.log('🚀 Server running on http://localhost:3000')
    );
  })
  .catch(err => {
    console.error('❌ DB Error:', err);
    process.exit(1);
  });