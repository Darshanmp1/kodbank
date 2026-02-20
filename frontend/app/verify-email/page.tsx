'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import api from '@/lib/api';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid verification link. Please check your email or request a new verification link.');
      setIsLoading(false);
      return;
    }

    // Verify email on component mount
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    if (!token) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/verify-email', { token });
      setSuccess(true);
      
      // Redirect to login after 5 seconds
      setTimeout(() => {
        router.push('/login');
      }, 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify email. The link may be invalid or expired.');
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
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Email Verification</h2>
          </div>

          {/* Status Card */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-100">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4">
                  <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Verifying Your Email...</h3>
                <p className="text-gray-600">Please wait while we verify your account</p>
              </div>
            ) : success ? (
              <div className="text-center py-6">
                <div className="flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mx-auto mb-4">
                  <span className="text-5xl animate-bounce">🎉</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Email Verified!</h3>
                <p className="text-gray-600 mb-6">
                  Your email has been successfully verified. You can now access all features.
                </p>
                
                {/* Success Features */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <span className="text-2xl">✅</span>
                    <span className="text-left text-sm text-gray-700">Email verification complete</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-2xl">🔐</span>
                    <span className="text-left text-sm text-gray-700">Account fully activated</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <span className="text-2xl">💰</span>
                    <span className="text-left text-sm text-gray-700">₹100,000 welcome bonus ready</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white mb-6">
                  <p className="text-sm font-semibold">
                    Redirecting to login in 5 seconds...
                  </p>
                </div>
                
                <Link href="/login">
                  <Button variant="primary" fullWidth className="text-lg">
                    Login Now →
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mx-auto mb-4">
                  <span className="text-4xl">❌</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h3>
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700">
                  <p>{error}</p>
                </div>
                
                <div className="space-y-3">
                  <Link href="/login">
                    <Button variant="primary" fullWidth>
                      Go to Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="secondary" fullWidth>
                      Create New Account
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Help Section */}
          {!isLoading && !success && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Need help?</p>
              <Link href="/" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
                Contact Support
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🏦</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
