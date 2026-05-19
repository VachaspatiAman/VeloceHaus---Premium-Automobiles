"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Car, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.status === 'success') {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Redirect based on user role
        if (data.data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl mb-4">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-700 bg-gray-800 text-red-500 focus:ring-red-500" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-red-500 hover:text-red-400 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in...' : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-red-500 hover:text-red-400 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Admin Login Link */}
        <div className="mt-6 text-center">
          <Link href="/admin/login" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
