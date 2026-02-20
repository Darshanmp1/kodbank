import jwt, { SignOptions } from 'jsonwebtoken';

interface JWTPayload {
  username: string;
  role: string;
}

/**
 * Generate JWT token with user information
 * @param username - User's username
 * @param role - User's role (customer/admin)
 * @returns Signed JWT token
 */
export const generateToken = (username: string, role: string): string => {
  const secret = process.env.JWT_SECRET;
  const expiry: string = process.env.JWT_EXPIRY || '7d';

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const payload: JWTPayload = {
    username,
    role,
  };

  const options: SignOptions = {
    expiresIn: expiry as any,
    subject: username,
  };

  return jwt.sign(payload, secret, options);
};

/**
 * Verify and decode JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload
 */
export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Calculate token expiry date
 * @returns Date object representing expiration time
 */
export const getTokenExpiry = (): Date => {
  const expiryString = process.env.JWT_EXPIRY || '7d';
  const expiryMs = parseExpiry(expiryString);
  return new Date(Date.now() + expiryMs);
};

/**
 * Parse expiry string to milliseconds
 * Supports: 1d, 7d, 1h, etc.
 */
function parseExpiry(expiry: string): number {
  const match = expiry.match(/^(\d+)([dhms])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // Default 7 days

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'm':
      return value * 60 * 1000;
    case 's':
      return value * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
}
