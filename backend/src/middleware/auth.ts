import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from './errorHandler';
import prisma from '../utils/prisma';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        username: string;
        role: string;
      };
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header or HTTP-only cookie
 * Checks if token exists in database
 * Attaches user info to request object
 */
export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header or HTTP-only cookie
    let token = req.cookies.token;
    
    // Check Authorization header first (for cross-domain requests)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    // Verify JWT token
    const decoded = verifyToken(token);

    // Check if token exists in database
    const tokenRecord = await prisma.userToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new AppError('Invalid token', 401);
    }

    // Check if token is expired
    if (new Date() > tokenRecord.expiry) {
      // Delete expired token
      await prisma.userToken.delete({ where: { tid: tokenRecord.tid } });
      throw new AppError('Token expired', 401);
    }

    // Attach user info to request
    req.user = {
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
