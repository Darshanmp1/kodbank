import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { z } from 'zod';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import prisma from '../utils/prisma';
import { sendPasswordResetEmail, sendVerificationEmail } from '../utils/email';

// Validation schemas
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = forgotPasswordSchema.parse(req.body);

  // Find user by email
  const user = await prisma.kodUser.findUnique({
    where: { email },
  });

  // Always return success message (security best practice - don't reveal if email exists)
  if (!user) {
    res.status(200).json({
      success: true,
      message: 'If that email exists, a password reset link has been sent.',
    });
    return;
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  // Update user with reset token
  await prisma.kodUser.update({
    where: { uid: user.uid },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  // Send password reset email
  await sendPasswordResetEmail(email, user.username, resetToken);

  res.status(200).json({
    success: true,
    message: 'If that email exists, a password reset link has been sent.',
  });
});

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = resetPasswordSchema.parse(req.body);

  // Find user with valid reset token
  const user = await prisma.kodUser.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(), // Token not expired
      },
    },
  });

  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password and clear reset token
  await prisma.kodUser.update({
    where: { uid: user.uid },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Password reset successful. You can now login with your new password.',
  });
});

/**
 * Resend email verification
 * POST /api/auth/resend-verification
 */
export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  const { email } = forgotPasswordSchema.parse(req.body);

  const user = await prisma.kodUser.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Email not found', 404);
  }

  if (user.isEmailVerified) {
    throw new AppError('Email is already verified', 400);
  }

  // Generate new verification token
  const verifyToken = crypto.randomBytes(32).toString('hex');

  // Update user with verification token
  await prisma.kodUser.update({
    where: { uid: user.uid },
    data: {
      emailVerifyToken: verifyToken,
    },
  });

  // Send verification email
  await sendVerificationEmail(email, user.username, verifyToken);

  res.status(200).json({
    success: true,
    message: 'Verification email sent successfully.',
  });
});

/**
 * Verify email with token
 * POST /api/auth/verify-email
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = verifyEmailSchema.parse(req.body);

  // Find user with verification token
  const user = await prisma.kodUser.findFirst({
    where: {
      emailVerifyToken: token,
    },
  });

  if (!user) {
    throw new AppError('Invalid verification token', 400);
  }

  if (user.isEmailVerified) {
    res.status(200).json({
      success: true,
      message: 'Email is already verified.',
    });
    return;
  }

  // Mark email as verified and clear token
  await prisma.kodUser.update({
    where: { uid: user.uid },
    data: {
      isEmailVerified: true,
      emailVerifyToken: null,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Email verified successfully! You can now use all features.',
  });
});
