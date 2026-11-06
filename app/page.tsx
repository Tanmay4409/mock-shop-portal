'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@pes.edu');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user_email', email);
        }
        router.push('/dashboard');
      } else {
        const errorMsg = data?.error || `Authentication failed (Status ${res.status})`;
        setError(errorMsg);
      }
    } catch {
      setError('Network connection error: Unable to reach auth service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-screen">
      <div className="auth-card">
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="brand-icon" style={{ margin: '0 auto 14px auto' }}>
            🛒
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Mock Shop Portal
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Enterprise IT Procurement & Service Inventory
          </p>
        </div>

        {/* Demo Credentials Hint */}
        <div className="alert-banner alert-info">
          <div className="alert-title">
            <span>🔑 Demo Baseline Account</span>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', marginTop: '4px', color: '#fff' }}>
            User: <strong>admin@pes.edu</strong> | Pass: <strong>password</strong>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="alert-banner alert-danger">
            <div className="alert-title">
              <span>⚠️ Authentication Error</span>
            </div>
            <p style={{ marginTop: '4px' }}>{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Corporate Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="name@pes.edu"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full"
            style={{ marginTop: '8px' }}
          >
            {loading ? (
              <>
                <div className="spinner" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Portal</span>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '24px' }}>
          Target production service for Capstone Root Cause Correlation
        </p>
      </div>
    </div>
  );
}
