'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { z } from 'zod';
import Input from '@/components/Input';
import Button from '@/components/Button';
import api from '@/lib/api';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Invalid reset link');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/reset-password', {
        token,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4 transform hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                🏦 KodBank
              </div>
            </Link>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h2>
            <p className="text-gray-600">Create a new secure password</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-100">
            {!success ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 animate-fade-in">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">⚠️</span>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
                    <span className="text-3xl">🔑</span>
                  </div>
                  <p className="text-center text-gray-600 text-sm">
                    Please enter your new password below
                  </p>
                </div>

                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  error={errors.newPassword?.message}
                  register={register('newPassword')}
                  required
                />

                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  error={errors.confirmPassword?.message}
                  register={register('confirmPassword')}
                  required
                />

                {/* Password Requirements */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg text-sm">
                  <p className="font-semibold text-gray-800 mb-2">Password Requirements:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>At least 6 characters</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600">💡</span>
                      <span>Use a mix of letters, numbers & symbols</span>
                    </li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth 
                  disabled={isLoading || !token}
                  className="text-lg py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Resetting...
                    </span>
                  ) : (
                    '🔐 Reset Password'
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 animate-bounce">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
                <p className="text-gray-600 mb-6">
                  Your password has been reset successfully.
                </p>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Redirecting to login page in 3 seconds...
                  </p>
                </div>
                <Link href="/login" className="inline-block mt-4">
                  <Button variant="primary">
                    Go to Login Now
                  </Button>
                </Link>
              </div>
            )}

            {/* Back to Login */}
            {!success && (
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors inline-flex items-center gap-2">
                  <span>←</span>
                  <span>Back to Login</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
