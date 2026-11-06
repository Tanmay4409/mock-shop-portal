'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  category: string;
  status: string;
  cost: string;
  vendor: string;
  sku: string;
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string>('admin@pes.edu');
  const router = useRouter();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    const start = performance.now();

    try {
      const res = await fetch('/api/products');
      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);

      if (!res.ok) {
        throw new Error(`Failed to fetch database records (Status ${res.status}: ${res.statusText})`);
      }

      const data = await res.json();
      setProducts(data.products || []);
    } catch (err: unknown) {
      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);
      const msg = err instanceof Error ? err.message : 'Unknown database error';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const email = localStorage.getItem('user_email');
      if (!token) {
        router.push('/');
        return;
      }
      if (email) {
        setUserEmail(email);
      }
    }

    fetchProducts();
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
    }
    router.push('/');
  };

  const isHighLatency = latencyMs !== null && latencyMs > 3000;

  return (
    <div className="app-viewport">
      {/* Sticky Top Header */}
      <header className="site-header">
        <div className="header-inner">
          <div className="brand-wrapper">
            <div className="brand-icon">🛒</div>
            <div className="brand-text">
              <h1>IT Procurement Portal</h1>
              <p>Enterprise Asset & Inventory Management</p>
            </div>
          </div>

          <div className="header-actions">
            <span className="user-badge">
              👤 {userEmail}
            </span>
            <button
              onClick={fetchProducts}
              disabled={loading}
              className="btn btn-secondary"
              title="Query database again to test latency"
            >
              <span>🔄</span>
              <span>{loading ? 'Querying...' : 'Refresh DB'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-danger"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="portal-container">
        {/* KPI Metrics Grid */}
        <div className="metrics-grid">
          {/* Card 1: DB Status */}
          <div className="metric-card">
            <div className="metric-label">Database Connection Status</div>
            <div className="metric-value-wrapper">
              <span className={`status-dot ${isHighLatency ? 'amber' : 'green'}`} />
              <span className="metric-status-badge" style={{ color: isHighLatency ? 'var(--color-warning)' : 'var(--color-success)' }}>
                {isHighLatency ? 'Performance Degraded' : 'Operational (Healthy)'}
              </span>
            </div>
          </div>

          {/* Card 2: Query Latency */}
          <div className="metric-card">
            <div className="metric-label">Query Response Latency</div>
            <div className="metric-value-wrapper">
              <span className={`metric-number ${isHighLatency ? 'highlight-danger' : ''}`}>
                {latencyMs !== null ? `${latencyMs} ms` : 'Measuring...'}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {isHighLatency ? '(Exceeds 3000ms SLA)' : '(Normal SLA)'}
              </span>
            </div>
          </div>

          {/* Card 3: Managed Assets */}
          <div className="metric-card">
            <div className="metric-label">Managed IT Assets</div>
            <div className="metric-value-wrapper">
              <span className="metric-number">{products.length}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Enterprise Licenses
              </span>
            </div>
          </div>
        </div>

        {/* High Latency Alert Banner (Demonstration Hook) */}
        {isHighLatency && (
          <div className="alert-banner alert-warning">
            <div className="alert-title">
              <span>⚠️ Database Query Latency Alert (Live Demonstration Triggered)</span>
            </div>
            <p>
              The database query took <strong>{latencyMs}ms</strong> to respond, severely exceeding the 500ms SLA.
              This indicates connection pool starvation or an unindexed table scan in <code>/api/products</code>.
              Your main project (<code>it-incident-system</code>) can correlate this symptom directly to the latest commit.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="alert-banner alert-danger">
            <div className="alert-title">
              <span>❌ Database Connection Error</span>
            </div>
            <p>{error}</p>
          </div>
        )}

        {/* Procurement Products Table Card */}
        <div className="card">
          <div className="table-header-card">
            <div>
              <h2>Procurement Items & Enterprise Subscriptions</h2>
              <p>Live database records fetched from production cluster</p>
            </div>
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                <div className="spinner" style={{ borderColor: 'rgba(37,99,235,0.3)', borderTopColor: 'var(--color-primary)' }} />
                <span>Querying database...</span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner-large" />
              <h3>Querying enterprise database cluster...</h3>
              <p style={{ fontSize: '0.8rem' }}>
                If DB delay simulation is active, response will take ~6 seconds.
              </p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No procurement records returned from database.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Asset Name</th>
                    <th>Category</th>
                    <th>Vendor</th>
                    <th>Annual Cost</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const isHealthy = p.status.includes('Active') || p.status.includes('Healthy');
                    const isDegraded = p.status.includes('Degraded');
                    const badgeClass = isHealthy ? 'badge-success' : isDegraded ? 'badge-danger' : 'badge-warning';

                    return (
                      <tr key={p.id}>
                        <td className="sku-text">{p.sku}</td>
                        <td style={{ fontWeight: 600, color: '#ffffff' }}>{p.name}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{p.category}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{p.vendor}</td>
                        <td className="cost-text">{p.cost}</td>
                        <td>
                          <span className={`badge ${badgeClass}`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
