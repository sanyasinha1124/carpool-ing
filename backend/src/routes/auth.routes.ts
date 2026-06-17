// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const user = await AuthService.register(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await AppDataSource.getRepository(User)
      .findOne({
        where: { id: req.user!.id },
        relations: { ridesAsDriver: true, bookings: true }
      });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;