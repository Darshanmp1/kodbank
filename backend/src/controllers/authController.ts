import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { registerSchema } from '../utils/validation';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import prisma from '../utils/prisma';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const validatedData = registerSchema.parse(req.body);

  const { username, email, password, phone } = validatedData;

  // Check if user already exists
  const existingUser = await prisma.kodUser.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingUser) {
    if (existingUser.username === username) {
      throw new AppError('Username already exists', 400);
    }
    if (existingUser.email === email) {
      throw new AppError('Email already exists', 400);
    }
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create new user with default balance and role
  const newUser = await prisma.kodUser.create({
    data: {
      username,
      email,
      password: hashedPassword,
      phone,
      balance: 100000, // Default balance
      role: 'customer', // Default role
    },
    select: {
      uid: true,
      username: true,
      email: true,
      balance: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please login to continue.',
    data: newUser,
  });
});
