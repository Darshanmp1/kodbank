import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { loginSchema } from '../utils/validation';
import { generateToken, getTokenExpiry } from '../utils/jwt';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import prisma from '../utils/prisma';

/**
 * Login user
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const validatedData = loginSchema.parse(req.body);

  const { username, password } = validatedData;

  // Find user by username
  const user = await prisma.kodUser.findUnique({
    where: { username },
  });

  if (!user) {
    throw new AppError('Invalid username or password', 401);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid username or password', 401);
  }

  // Generate JWT token
  const token = generateToken(user.username, user.role);
  const expiry = getTokenExpiry();

  // Store token in database
  await prisma.userToken.create({
    data: {
      token,
      uid: user.uid,
      expiry,
    },
  });

  // Set token as HTTP-only cookie (with SameSite=None for cross-domain)
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // 'none' for cross-domain in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      username: user.username,
      role: user.role,
      token, // Send token in response for cross-domain usage
    },
  });
});

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (token) {
    // Delete token from database
    await prisma.userToken.deleteMany({
      where: { token },
    });
  }

  // Clear cookie
  res.clearCookie('token');

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});
