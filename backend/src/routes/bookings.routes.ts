// src/routes/bookings.routes.ts
import { Router } from 'express';
import { AppDataSource } from '../config/database';
import {Booking} from '../entities/Booking';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const bookingRepo = AppDataSource.getRepository(Booking);

// Get my bookings
router.get('/my', authenticate, async (req: AuthRequest, res) => {
  try {
    const bookings = await bookingRepo.find({
      where: { rider: { id: req.user!.id } },
      relations: { ride: { driver: true } },
      order: { createdAt: 'DESC' }
    });
    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel a booking
router.patch('/:id/cancel', authenticate, async (req: AuthRequest, res) => {
  try {
    const { RideService } = await import('../services/ride.service');
    const bookingId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const booking = await RideService.cancelBooking(bookingId, req.user!.id);
    res.json(booking);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get single booking
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const bookingId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const booking = await bookingRepo.findOne({
      where: { id: bookingId },
      relations: { ride: { driver: true } }
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;