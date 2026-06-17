// src/routes/rating.routes.ts
import { Router } from 'express';
import { AppDataSource } from '../config/database';
import { Rating } from '../entities/Rating';
import { User } from '../entities/User';
import { Ride } from '../entities/Ride';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { ratedId, rideId, score, comment } = req.body;

    if (score < 1 || score > 5)
      return res.status(400).json({ error: 'Score must be 1-5' });

    const ratingRepo = AppDataSource.getRepository(Rating);
    const userRepo   = AppDataSource.getRepository(User);

    // Check not rating yourself
    if (ratedId === req.user!.id)
      return res.status(400).json({ error: 'Cannot rate yourself' });

    // Check duplicate rating
    const existing = await ratingRepo.findOne({
      where: { rater: { id: req.user!.id }, ride: { id: rideId } }
    });
    if (existing)
      return res.status(400).json({ error: 'Already rated for this ride' });

    const rater = await userRepo.findOneOrFail({ where: { id: req.user!.id } });
    const rated = await userRepo.findOneOrFail({ where: { id: ratedId } });
    const ride  = await AppDataSource.getRepository(Ride)
      .findOneOrFail({ where: { id: rideId } });

    const rating = ratingRepo.create({ rater, rated, ride, score, comment });
    await ratingRepo.save(rating);

    // Update driver's average rating
    const allRatings = await ratingRepo.find({ where: { rated: { id: ratedId } } });
    const avg = allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length;
    rated.rating      = Math.round(avg * 10) / 10;
    rated.totalRatings = allRatings.length;
    await userRepo.save(rated);

    res.status(201).json(rating);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/driver/:id', async (req, res) => {
  try {
    const ratings = await AppDataSource.getRepository(Rating).find({
      where: { rated: { id: req.params.id } },
      relations: {rater:true},
      order: { createdAt: 'DESC' }
    });
    res.json(ratings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;