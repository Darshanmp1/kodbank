import { Request, Response } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import prisma from '../utils/prisma';

/**
 * Get user balance
 * GET /api/user/balance
 * Protected route - requires authentication
 */
export const getBalance = asyncHandler(async (req: Request, res: Response) => {
  // User info is attached by authentication middleware
  const username = req.user?.username;

  if (!username) {
    throw new AppError('User not authenticated', 401);
  }

  // Fetch user balance from database
  const user = await prisma.kodUser.findUnique({
    where: { username },
    select: {
      username: true,
      balance: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Balance retrieved successfully',
    data: {
      username: user.username,
      balance: user.balance,
    },
  });
});

/**
 * Get user profile
 * GET /api/user/profile
 * Protected route - requires authentication
 */
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const username = req.user?.username;

  if (!username) {
    throw new AppError('User not authenticated', 401);
  }

  // Fetch user profile
  const user = await prisma.kodUser.findUnique({
    where: { username },
    select: {
      uid: true,
      username: true,
      email: true,
      phone: true,
      balance: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});
