"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated in session
    const authToken = sessionStorage.getItem('admin_auth');
    if (authToken === 'authenticated') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('admin_auth', 'authenticated');
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setError('Invalid password');
      }
    } catch (error) {
      setError('Authentication failed');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center p-6">
        <div className="bg-background rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">Orders</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-brand-beige rounded-lg focus:border-brand-green focus:outline-none transition"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-brand-green hover:bg-brand-green-hover text-text-white rounded-lg font-semibold transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-background border-b shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Orders</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm border-2 border-brand-beige hover:bg-brand-beige-light rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
