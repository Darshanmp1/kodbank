'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { getUserBalance, logoutUser } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [router]);

  const handleCheckBalance = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await getUserBalance();
      setBalance(parseFloat(response.data.balance));
      setShowCelebration(true);
      
      // Remove celebration animation after 2 seconds
      setTimeout(() => {
        setShowCelebration(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch balance');
      if (err.message.includes('authentication') || err.message.includes('token')) {
        // Redirect to login if authentication fails
        localStorage.removeItem('username');
        localStorage.removeItem('auth_token');
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('username');
      localStorage.removeItem('auth_token');
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
      // Force logout even if API call fails
      localStorage.removeItem('username');
      localStorage.removeItem('auth_token');
      router.push('/');
    }
  };

  if (!username) {
    return null; // Don't render while redirecting
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
        <div className="absolute bottom-0 -left-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                🏦 KodBank
              </div>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="secondary"
              className="flex items-center gap-2"
            >
              <span>👋</span>
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Hey {username}! 👋
                </h1>
                <p className="text-blue-100 text-lg">
                  Here's your stuff
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100 mb-1">Status</p>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="font-semibold">All good</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Balance Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Balance</h2>
                <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  Main Account
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 animate-fade-in">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">⚠️</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {balance === null ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-6 animate-float">💰</div>
                  <p className="text-gray-600 mb-6 text-lg">
                    Let's see how much you have
                  </p>
                  <Button
                    onClick={handleCheckBalance}
                    variant="success"
                    disabled={isLoading}
                    className="text-lg px-10 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-3">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </span>
                    ) : (
                      'Show me the money'
                    )}
                  </Button>
                </div>
              ) : (
                <div className={`${showCelebration ? 'celebrate' : ''}`}>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 mb-6">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Available Balance</p>
                    <p className="text-5xl md:text-6xl font-black text-green-600 mb-4">
                      ₹{balance.toLocaleString('en-IN')}
                    </p>
                    {showCelebration && (
                      <div className="flex justify-center gap-3 text-3xl">
                        <span className="animate-bounce">🎉</span>
                        <span className="animate-bounce animation-delay-100">✨</span>
                        <span className="animate-bounce animation-delay-200">🎊</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={handleCheckBalance}
                      variant="secondary"
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <span>🔄</span>
                      <span>Refresh</span>
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <span>💸</span>
                      <span>Transfer</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <button className="bg-white/90 backdrop-blur-lg rounded-xl p-4 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                <div className="text-3xl mb-2">💸</div>
                <p className="text-sm font-semibold text-gray-700">Send Money</p>
              </button>
              <button className="bg-white/90 backdrop-blur-lg rounded-xl p-4 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                <div className="text-3xl mb-2">📥</div>
                <p className="text-sm font-semibold text-gray-700">Request</p>
              </button>
              <button className="bg-white/90 backdrop-blur-lg rounded-xl p-4 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                <div className="text-3xl mb-2">💳</div>
                <p className="text-sm font-semibold text-gray-700">Cards</p>
              </button>
              <button className="bg-white/90 backdrop-blur-lg rounded-xl p-4 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-sm font-semibold text-gray-700">Reports</p>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Your Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl">👤</div>
                  <div>
                    <p className="text-xs text-gray-600">Username</p>
                    <p className="font-semibold text-gray-800">{username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl">🔐</div>
                  <div>
                    <p className="text-xs text-gray-600">Security</p>
                    <p className="font-semibold text-gray-800">Protected</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl">✅</div>
                  <div>
                    <p className="text-xs text-gray-600">Account Type</p>
                    <p className="font-semibold text-gray-800">Standard</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Status */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🛡️</div>
                <h3 className="text-lg font-bold">Security</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Extra security</span>
                  <span className="text-green-200">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Encrypted</span>
                  <span className="text-green-200">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Device verified</span>
                  <span className="text-green-200">✓</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20 text-xs text-green-100">
                🔒 You're all set
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Transactions</span>
                  <span className="font-bold text-blue-600">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-bold text-orange-600">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-bold text-green-600">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="flex items-center justify-center gap-2">
            <span>🔒</span>
            <span>Everything here is encrypted and secure</span>
          </p>
        </div>
      </div>
    </main>
  );
}
