// src/services/auth.service.ts
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../entities/User';

const userRepo = AppDataSource.getRepository(User);

export const AuthService = {

  async register(data: {
    email: string; password: string;
    firstName: string; lastName: string; role?: UserRole;
  }) {
    const existing = await userRepo.findOne({ where: { email: data.email } });
    if (existing) throw new Error('Email already registered');

    const user = userRepo.create(data);  // @BeforeInsert hashes password

await userRepo.save(user);
    return user;
  },

  async login(email: string, password: string) {
    const user = await userRepo.findOne({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const valid = await user.comparePassword(password);
    if (!valid) throw new Error('Invalid credentials');

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    return { user, accessToken, refreshToken };
  },

  verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
  }
};