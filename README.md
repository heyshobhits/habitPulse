# HabitPulse Enterprise

> **Multi-Tenant B2B SaaS Workforce Wellbeing & Habit Execution Platform**  
> Scalable from 500 to 500,000+ active employees with sub-millisecond streak reads and high-throughput check-in ingestion.

---

## 1. Overview & Architectural Vision

HabitPulse Enterprise tackles two critical engineering bottlenecks typical of large-scale habit tracking:
1. **The "Morning & End-of-Day Thundering Herd":** High write spikes occurring between 08:00–10:00 and 17:00–21:00 across global timezones.
2. **Sub-Millisecond Streak Reads:** Fast calculations of active streaks, longest contiguous streaks, and rolling 7-day matrices without full-table scans.

The solution implements **Command Query Responsibility Segregation (CQRS)**:
- **Write Path (Command):** Edge API Gateway → Check-In Ingestion Service → PostgreSQL TimescaleDB ledger + Redis Bitmaps + Apache Kafka event stream.
- **Read Path (Query):** Edge API Gateway → Dashboard Query Service → Redis Cluster hot state (p99 < 15ms).

---

## 2. High-Level Architecture Topology

```
[Web SPA / Mobile / Slack & Teams Bots]
                 │
                 ▼ (HTTPS / TLS 1.3)
   [Global Edge & CDN / WAF]
                 │
                 ▼
     [API Gateway + OIDC/SAML Auth]
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
[Check-In Writer]     [Dashboard Query API]
 (Command Side)           (CQRS Read)
      │                     │
      ├────────────────┐    ▼
      ▼                ▼  [Redis Cluster]
[TimescaleDB]    [Apache Kafka] (Hot Streak Bitmaps)
 (Ledger)              │            ▲
                       ▼            │
             [Streak Stream Worker]─┘
                       │
                       ▼
            [Analytical Lakehouse]
         (Anonymized HR Insights)
```

---

## 3. Data Tier & In-Memory Bitmaps

| Storage Layer | Engine | Purpose | Index / Partition Strategy |
| :--- | :--- | :--- | :--- |
| **Transactional Core** | PostgreSQL 16 | Tenants, Users, Habit Definitions | Hash-partitioned by `tenant_id`; B-Tree on `(tenant_id, user_id)` |
| **Time-Series Ledger** | TimescaleDB | Immutable check-in audit log | Range-partitioned by `local_completion_date` (monthly chunks) |
| **Hot Streak Cache** | Redis Cluster | 365-day bitmaps & rolling matrices | Keys: `bm:{tenant_id}:{habit_id}:{year}` (46 bytes per habit/year) |
| **Lakehouse** | Iceberg / Parquet | Anonymized HR wellbeing cohorts | Differential privacy enforced ($k \ge 15$ employees per org unit) |

### $O(1)$ Streak Bitmaps
- Each habit's annual check-in history is maintained as a **366-bit array** in Redis.
- Daily check-in: `SETBIT bm:{tenant}:{habit}:{year} {day_of_year} 1`.
- Weekly matrix check: `BITFIELD GET u7 {monday_offset}` in $O(1)$.
- Backward bit-scanning computes both active and longest streaks in under 50 microseconds without relational scans.

---

## 4. Cloud Deployments

| Component | AWS Reference Architecture | Microsoft Azure Reference Architecture |
| :--- | :--- | :--- |
| **Edge & CDN** | CloudFront + AWS WAF | Azure Front Door Premium + WAF |
| **Identity & SSO** | Cognito / Okta (SAML 2.0 / OIDC) | Microsoft Entra ID |
| **Compute / API** | Amazon EKS + Karpenter + KEDA | Azure Kubernetes Service (AKS) |
| **Event Backbone** | Amazon MSK (Apache Kafka) | Azure Event Hubs (Kafka endpoint) |
| **Hot Cache** | Amazon ElastiCache for Redis | Azure Managed Redis Enterprise |
| **Database** | Amazon RDS PostgreSQL + TimescaleDB | Azure Database for PostgreSQL Flexible |

---

## 5. Frontend Architecture (`src/`)

The React SPA is structured into modular components:

```
src/
├── types/
│   └── habit.ts                # TypeScript contracts & Kafka event payloads
├── hooks/
│   └── useHabits.ts            # Optimistic state hook & rolling date generator
└── components/
    ├── KPICards.tsx            # Top-level adherence & streak metrics
    ├── HabitRow.tsx            # Habit item with day-by-day checkboxes
    └── HabitTrackingDashboard.tsx # Main orchestration container
```

### Getting Started
```bash
# Clone the repository
git clone https://github.com/heyshobhits/habitPulse.git
cd habitPulse

# Install dependencies
npm install

# Start local development server
npm run dev

# Type-check and create a production build
npm run build
```
