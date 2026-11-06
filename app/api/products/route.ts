import { NextResponse } from 'next/server';

/**
 * Enterprise IT Procurement Products API
 * 
 * TRIAL SCENARIO 2 (Live Demo with Mentor - DB Taking Too Long):
 * Baseline (Working): Responds in < 30ms.
 * Breaking / Degraded Change: Toggle DB_SIMULATE_SLOW_QUERY = true (or increase DB_DELAY_MS to 6000), then commit:
 *   git commit -am "perf(db): modify database connection pool settings and unindexed procurement query"
 *   git push origin main
 * Result: API takes 6+ seconds, frontend dashboard flags high latency (> 5000ms),
 *         and it-incident-system correlates high DB latency incidents to this commit!
 */

// Toggle this to true to simulate DB latency / connection pool exhaustion live
const DB_SIMULATE_SLOW_QUERY = false;
const DB_DELAY_MS = 6000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceDelay = searchParams.get('slow') === 'true' || process.env.SIMULATE_DB_LATENCY === 'true';

  const startTime = Date.now();

  // If simulation is enabled, simulate heavy database query latency / pool starvation
  if (DB_SIMULATE_SLOW_QUERY || forceDelay) {
    console.warn(`[DATABASE LATENCY SIMULATION] Delaying query response by ${DB_DELAY_MS}ms...`);
    await new Promise((resolve) => setTimeout(resolve, DB_DELAY_MS));
  }

  const durationMs = Date.now() - startTime;

  const mockProducts = [
    {
      id: 1,
      name: 'CloudOptX Enterprise License',
      category: 'Cloud Infrastructure',
      status: 'Active',
      cost: '$12,400 / yr',
      vendor: 'AWS Systems',
      sku: 'SKU-CLD-9021'
    },
    {
      id: 2,
      name: 'ITSM Standard Tier Subscriptions',
      category: 'Support Management',
      status: 'Active',
      cost: '$4,500 / yr',
      vendor: 'ServiceDesk Corp',
      sku: 'SKU-ITSM-4412'
    },
    {
      id: 3,
      name: 'Vector DB Add-on (pgvector Cluster)',
      category: 'Data Storage',
      status: 'Pending Approval',
      cost: '$2,100 / mo',
      vendor: 'Postgres Cloud',
      sku: 'SKU-PGV-1082'
    },
    {
      id: 4,
      name: 'SRE Incident Commander Tooling Suite',
      category: 'DevOps & Monitoring',
      status: 'Active',
      cost: '$6,800 / yr',
      vendor: 'PagerMetrics',
      sku: 'SKU-DEV-7703'
    },
    {
      id: 5,
      name: 'Database Connection Pool Router (PgBouncer HA)',
      category: 'Database Cluster',
      status: durationMs > 3000 ? 'Degraded (High Latency)' : 'Healthy',
      cost: '$1,200 / yr',
      vendor: 'Internal Infra',
      sku: 'SKU-DBP-0091'
    }
  ];

  return NextResponse.json(
    {
      success: true,
      queryTimeMs: durationMs,
      timestamp: new Date().toISOString(),
      products: mockProducts,
    },
    {
      status: 200,
      headers: {
        'X-Response-Time-Ms': durationMs.toString(),
      },
    }
  );
}
