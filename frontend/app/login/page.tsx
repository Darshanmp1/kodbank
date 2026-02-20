'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { loginSchema, LoginFormData } from '@/lib/validation';
import { loginUser } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      await loginUser(data);
      
      // Token and username are stored by loginUser function
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
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
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
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
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Good to see you again</h2>
            <p className="text-gray-600">Let's check on your money</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 animate-fade-in">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">⚠️</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <Input
                label="Username"
                name="username"
                placeholder="your username"
                error={errors.username?.message}
                register={register('username')}
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="your password"
                error={errors.password?.message}
                register={register('password')}
                required
              />

              {/* Forgot Password Link */}
              <div className="mb-6 text-right">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
                >
                  I forgot my password
                </Link>
              </div>

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
                    Signing in...
                  </span>
                ) : (
                  'Let me in →'
                )}
              </Button>
            </form>

            {/* Security Badge */}
            <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-center text-sm text-gray-700">
                <span className="mr-2">🔒</span>
                <span>Your password is encrypted and safe</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
              New here?{' '}
              <Link href="/register" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
                Create an account →
              </Link>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center gap-2 group">
              <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
