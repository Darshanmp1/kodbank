import Link from 'next/link';
import Button from '@/components/Button';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-6xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block mb-6">
              <div className="text-7xl md:text-8xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                🏦 KodBank
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
              Banking that actually makes sense
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              No hidden fees. No confusing jargon. Just your money, managed the way it should be – simple and secure.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/register">
                <Button variant="primary" className="min-w-[200px] text-lg py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Start banking →
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" className="min-w-[200px] text-lg py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Already have an account?
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="group bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🔒</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Actually secure</h3>
              <p className="text-gray-600 leading-relaxed">
                Your money is protected with proper encryption and JWT auth. We take security seriously (unlike that one bank we all know).
              </p>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Instant everything</h3>
              <p className="text-gray-600 leading-relaxed">
                Check your balance, send money, done. No waiting 3-5 business days for literally anything.
              </p>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🌙</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Works at 3 AM</h3>
              <p className="text-gray-600 leading-relaxed">
                Because emergencies don't wait for office hours. Available 24/7, whenever you need it.
              </p>
            </div>
          </div>

          {/* Special Offer Banner */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 shadow-2xl text-white text-center mb-12 transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Free ₹1,00,000 to start</h3>
            <p className="text-xl mb-4">Yeah, you read that right. Every new account gets ₹100K instantly. No catch.</p>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full">
              <span className="text-sm font-semibold">✨ Available for all new users</span>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-1">Super</div>
              <div className="text-sm text-gray-600">Secure</div>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-1">Always</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-1">Super</div>
              <div className="text-sm text-gray-600">Fast</div>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-pink-600 mb-1">₹100K</div>
              <div className="text-sm text-gray-600">Free Money</div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-600 text-sm">
            <p className="mb-2">Made with ❤️  and way too much coffee | KodBank 2026</p>
            <p className="text-xs">Runs on Next.js, TypeScript, Express & MySQL (the good stuff)</p>
          </div>
        </div>
      </div>
    </main>
  );
}
