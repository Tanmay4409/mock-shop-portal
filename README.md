# 🛒 Mock Shop Portal (IT Procurement & Service Catalog)

A modern Next.js simulated enterprise application designed as the target production service for the **IT Incident Management & Semantic AI Resolution System**.

---

## 🚀 Quick Start

### 1. Install & Run
```bash
# In Mock-project/mock-shop-portal
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Default Baseline Credentials
* **Email:** `admin@pes.edu`
* **Password:** `password`
* **Role:** `IT_Administrator`

Upon sign in, you are redirected to the **IT Procurement Dashboard** (`/dashboard`), which queries `/api/products` and displays live enterprise license assets and query latency metrics.

---

## 🎬 Live Mentor Demonstration Scenarios

### 🔹 Scenario 1: Authentication Failure Incident (Code Regression)

**Objective:** Demonstrate how a developer's code change breaks authentication in production, triggers an incident, and is pinpointed by `it-incident-system` using GitHub commit correlation & Gemini RAG.

1. **Baseline State:** Verify that `admin@pes.edu` / `password` logs in successfully.
2. **Introduce Breaking Change:**
   Open `app/api/auth/route.ts` and modify `VALID_CREDENTIALS`:
   ```typescript
   const VALID_CREDENTIALS = {
     email: 'admin@pes.edu',
     password: 'rotated_pass_secure_2026', // <-- Breaking change
   };
   ```
3. **Commit & Push to Remote:**
   ```bash
   git commit -am "feat(auth): rotate JWT signing keys and update administrator authentication credentials"
   git push origin main
   ```
4. **Trigger Incident:**
   - Attempt to log in with `admin@pes.edu` and `password`.
   - The UI immediately displays: `401 Unauthorized: Invalid email or password`.
5. **Demonstrate in `it-incident-system`:**
   - Open your main incident portal and enter:
     > *"Users reporting 401 Unauthorized errors when trying to log into the shop portal after recent deployment."*
   - Click **Run Diagnostic**.
   - The system automatically correlates the incident to the commit `feat(auth): rotate JWT...` with >90% confidence and generates an automated RCA and rollback plan (`git revert <sha>`).

---

### 🔹 Scenario 2: High Database Query Latency & Pool Exhaustion

**Objective:** Demonstrate system performance degradation caused by unindexed database queries or connection pool misconfiguration.

1. **Baseline State:**
   - On `/dashboard`, click **Refresh DB**.
   - Notice the query latency is fast (e.g. `~20ms`, `🟢 Operational`).
2. **Introduce Breaking Change:**
   Open `app/api/products/route.ts` and set:
   ```typescript
   const DB_SIMULATE_SLOW_QUERY = true; // <-- Introduces 6000ms latency
   ```
3. **Commit & Push to Remote:**
   ```bash
   git commit -am "perf(db): modify database connection pool settings and unindexed procurement query"
   git push origin main
   ```
4. **Trigger Incident:**
   - On the portal dashboard, click **Refresh DB**.
   - The query takes **6000ms+**, triggering the amber alert banner:
     > `⚠️ Database Query Latency Alert: Database query took 6020ms (Threshold: 500ms). Connection pool queue saturated.`
5. **Demonstrate in `it-incident-system`:**
   - In `it-incident-system`, raise an incident:
     > *"Database queries on the procurement dashboard are taking over 6 seconds and timing out with connection pool exhaustion."*
   - Click **Run Diagnostic**.
   - The system correlates this incident with `perf(db): modify database connection pool settings...` and recommends tuning pool sizing and reverting the slow query.
