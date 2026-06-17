import express from 'express';
import cors from 'cors';
import authRoutes    from '../routes/auth.routes';
import rideRoutes    from '../routes/rides.routes';
import bookingRoutes from '../routes/bookings.routes';
import ratingRoutes  from '../routes/rating.routes';

const app = express();

app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth',     authRoutes);
app.use('/api/rides',    rideRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ratings',  ratingRoutes);

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

export default app;