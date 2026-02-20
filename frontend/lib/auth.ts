import api from './api';
import { RegisterFormData, LoginFormData } from './validation';

/**
 * Register a new user
 */
export const registerUser = async (data: RegisterFormData) => {
  const response = await api.post('/api/auth/register', data);
  return response.data;
};

/**
 * Login user
 */
export const loginUser = async (data: LoginFormData) => {
  const response = await api.post('/api/auth/login', data);
  return response.data;
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  const response = await api.post('/api/auth/logout');
  return response.data;
};

/**
 * Get user balance
 */
export const getUserBalance = async () => {
  const response = await api.get('/api/user/balance');
  return response.data;
};

/**
 * Get user profile
 */
export const getUserProfile = async () => {
  const response = await api.get('/api/user/profile');
  return response.data;
};
