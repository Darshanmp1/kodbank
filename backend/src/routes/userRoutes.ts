import express from 'express';
import { getBalance, getProfile } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

/**
 * @route   GET /api/user/balance
 * @desc    Get user balance
 * @access  Protected (requires authentication)
 */
router.get('/balance', authenticate, getBalance);

/**
 * @route   GET /api/user/profile
 * @desc    Get user profile
 * @access  Protected (requires authentication)
 */
router.get('/profile', authenticate, getProfile);

export default router;
