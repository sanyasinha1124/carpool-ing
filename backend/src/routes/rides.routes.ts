// src/routes/rides.routes.ts
import { Router } from 'express';
import { RideService } from '../services/ride.service';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.middleware';
import { AppDataSource } from '../config/database';
import { Ride, RideStatus } from '../entities/Ride';

const router = Router();

// Public: search rides
router.get('/search', async (req, res) => {
  try {
    const { origin, dest, date, seats } = req.query;
    const rides = await RideService.searchRides(
      origin as string, dest as string,
      date as string, Number(seats) || 1
    );
    res.json(rides);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const rideRepo = AppDataSource.getRepository(Ride);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const ride = await rideRepo.findOne({
      where: { id },
      relations: { driver: true, bookings: { rider: true } }
    });
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    res.json(ride);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Protected: create ride (drivers only)
router.post('/', authenticate, authorize('driver', 'admin'), async (req: AuthRequest, res) => {
  try {
    const ride = await RideService.createRide(req.user!.id, req.body);
    res.status(201).json(ride);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const rideRepo = AppDataSource.getRepository(Ride);
    const rides = await rideRepo.find({
      relations: { driver: true },
      order: { departureTime: 'ASC' }
    });
    res.json(rides);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});



// Protected: book a ride
router.post('/:id/book', authenticate, async (req: AuthRequest, res) => {
  try {
    const booking = await RideService.bookRide(
      req.user!.id, Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, req.body.seats
    );
    res.status(201).json(booking);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});


//driver can cancel their ride 
router.patch('/:id/cancel', authenticate, authorize('driver', 'admin'),
  async (req: AuthRequest, res) => {
    try {
      const rideRepo = AppDataSource.getRepository(Ride);
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const ride = await rideRepo.findOne({
        where: { id },
        relations: { driver: true }
      });
      if (!ride) return res.status(404).json({ error: 'Ride not found' });
      if (ride.driver.id !== req.user!.id)
        return res.status(403).json({ error: 'Not your ride' });
      if (ride.status === RideStatus.CANCELLED)
        return res.status(400).json({ error: 'Already cancelled' });

      ride.status = RideStatus.CANCELLED;
      await rideRepo.save(ride);
      res.json(ride);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;