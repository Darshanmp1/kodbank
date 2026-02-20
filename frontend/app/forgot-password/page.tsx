'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { z } from 'zod';
import Input from '@/components/Input';
import Button from '@/components/Button';
import api from '@/lib/api';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/api/auth/forgot-password', data);
      setMessage(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
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
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
            <p className="text-gray-600">No worries, we'll send you reset instructions</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-100">
            {!message ? (
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
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                    <span className="text-3xl">🔐</span>
                  </div>
                  <p className="text-center text-gray-600 text-sm">
                    Enter your email address and we'll send you a link to reset your password
                  </p>
                </div>

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  error={errors.email?.message}
                  register={register('email')}
                  required
                />

                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth 
                  disabled={isLoading}
                  className="text-lg py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    '📧 Send Reset Link'
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto mb-4">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Check Your Email</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
                  <p className="font-semibold mb-2">📝 Next Steps:</p>
                  <ol className="text-left list-decimal list-inside space-y-1">
                    <li>Check your inbox (and spam folder)</li>
                    <li>Click the reset link in the email</li>
                    <li>Create your new password</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Back to Login */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors inline-flex items-center gap-2">
                <span>←</span>
                <span>Back to Login</span>
              </Link>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Don't have an account?</p>
            <Link href="/register" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
              Create Account →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
