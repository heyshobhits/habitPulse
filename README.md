# HabitPulse Enterprise

> **Multi-Tenant B2B SaaS Workforce Wellbeing & Habit Execution Platform**  
> Scalable from 500 to 500,000+ active employees with sub-millisecond streak reads, interactive weekly check-in matrices, and high-throughput ingestion.

---

## 1. Overview & Architectural Vision

HabitPulse Enterprise tackles two critical engineering bottlenecks typical of large-scale habit tracking:
1. **The "Morning & End-of-Day Thundering Herd":** High write spikes occurring between 08:00–10:00 and 17:00–21:00 across global timezones.
2. **Sub-Millisecond Streak Reads:** Fast calculations of active streaks, longest contiguous streaks, and rolling 7-day matrices without expensive relational full-table scans.

The solution implements **Command Query Responsibility Segregation (CQRS)**:
- **Write Path (Command):** Edge API Gateway → Check-In Ingestion Service → TimescaleDB ledger + Redis Bitmaps + Apache Kafka event stream.
- **Read Path (Query):** Edge API Gateway → Dashboard Query Service → Redis Cluster hot state (p99 < 15ms).

---

## 2. High-Level Architecture Topology

```
[Web SPA / Mobile Clients / Slack & Teams Bots]
                       │
                       ▼ (HTTPS / TLS 1.3)
          [Global CDN & WAF (Cloudflare / Front Door)]
                       │
                       ▼
        [API Gateway (Kong / Envoy) + OIDC Auth]
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
[Habit Core API] [Check-in Writer] [Analytics Read API]
   (CRUD/Meta)    (High-Write)       (CQRS Read)
       │               │               │
       │               ▼               ▼
       │        [Kafka / Event Hub]  [Redis Cluster]
       │               │             (Streak/Matrix Cache)
       │               ▼               ▲
       │      [Streak & Rollup Worker]─┘
       │               │
       ▼               ▼
[PostgreSQL + TimescaleDB (Partitioned by Tenant & Time)]
                       │
                       ▼
        [Data Lakehouse (Parquet / Iceberg)]
          (Anonymized Enterprise HR Insights)
```

---

## 3. Data Tier & In-Memory Bitmaps

| Storage Layer | Engine | Purpose | Partitioning / Indexing Strategy |
| :--- | :--- | :--- | :--- |
| **Transactional Core** | PostgreSQL 16 | Tenants, Users, Habit Definitions, Streak Summaries | Hash-partitioned by `tenant_id`; B-Tree on `(tenant_id, user_id)` |
| **Time-Series Ledger** | PostgreSQL + TimescaleDB | Append-only daily habit check-in ledger (`habit_checkins`) | Range-partitioned by `local_completion_date` (monthly chunks) |
| **Hot Streak Cache** | Redis Enterprise Cluster | 365-day bitmaps & rolling weekly matrices | Keys: `bm:{tenant_id}:{habit_id}:{year}` (46 bytes per habit/year) |
| **Analytical Lakehouse** | Apache Iceberg / Parquet | Anonymized cohort engagement & HR wellbeing metrics | Partitioned by `tenant_id` / `year` / `month` (k >= 15 differential privacy) |

### O(1) Streak Evaluation Algorithm
- Each habit's annual check-in history is stored in Redis as a **366-bit array** under key `bm:{tenant_id}:{habit_id}:{year}`.
- **Daily Check-in**: `SETBIT bm:{tenant}:{habit}:{year} {day_of_year} 1` (or `0` on uncheck).
- **Weekly Matrix Check**: `BITFIELD GET u7 {monday_offset}` in O(1).
- **Backward Bit Scan**: Evaluates both `current_streak` and `longest_streak` in under 50 microseconds without relational database queries.

---

## 4. Cloud Deployments: AWS vs. Azure

| Architectural Layer | AWS Reference Deployment | Microsoft Azure Reference Deployment |
| :--- | :--- | :--- |
| **Global Edge & WAF** | Amazon CloudFront + AWS WAF + Route53 | Azure Front Door Premium + Azure WAF + Azure DNS |
| **Identity & Enterprise SSO** | Amazon Cognito / Okta (SAML 2.0 / OIDC) | Microsoft Entra ID (Multi-Tenant App Registration) |
| **API Gateway** | Amazon API Gateway (HTTP API) / Kong on EKS | Azure API Management (APIM) Premium Tier |
| **Compute / Microservices** | Amazon EKS with Karpenter & KEDA | Azure Kubernetes Service (AKS) / Container Apps |
| **Event Streaming Backbone** | Amazon MSK (Apache Kafka) | Azure Event Hubs (Kafka-compatible endpoint) |
| **Hot Streak & Matrix Cache** | Amazon ElastiCache for Redis (Cluster Mode) | Azure Managed Redis (Enterprise Tier) |
| **Primary Relational & Ledger DB**| Amazon RDS for PostgreSQL + TimescaleDB | Azure Database for PostgreSQL Flexible Server |
| **Enterprise HR Lakehouse** | Amazon S3 + AWS Glue + Amazon Athena | Azure Data Lake Storage Gen2 + Microsoft Fabric |
| **Secrets & Key Management** | AWS KMS + AWS Secrets Manager | Azure Key Vault (HSM-backed) |
| **Observability & APM** | AWS Distro for OpenTelemetry + Managed Grafana | Azure Monitor + Application Insights + Managed Grafana |

---

## 5. Frontend Architecture (`src/`)

The React web client is built with **Vite, React 18, TypeScript, Tailwind CSS, and Recharts**. It follows a modular structure decoupled into reusable components, custom hooks, and utility functions:

```
src/
├── types/
│   └── habit.ts                   # Domain models (Habit, DayOfWeek, ColorOption, HabitStats)
├── constants/
│   └── habitData.ts               # Categories, Color palettes, Icon registry, and initial seed
├── utils/
│   └── streakUtils.ts             # Contiguous streak & weekly best streak algorithms
├── hooks/
│   └── useHabits.ts               # State orchestration, stats calculation & localStorage persistence
└── components/
    ├── Header.tsx                 # Branding, theme switcher (Dark/Light), Reset Week
    ├── KPISummary.tsx             # 4 Metric KPI cards (Weekly completion, Best streak, Perfect days, Focus)
    ├── HabitTable.tsx             # Interactive 7-day completion matrix, category filters & quick actions
    ├── StreakChart.tsx            # Recharts Bar / Area completion rate visualization with custom tooltips
    ├── Leaderboard.tsx            # Habit Streak Breakdown with mini 7-segment status visualizers
    ├── AddHabitModal.tsx          # Create Habit dialog with icon picker, goal slider & color palette
    └── HabitTrackingDashboard.tsx # Clean orchestrator container component
```

---

## 6. Getting Started Locally

### Prerequisites
- **Node.js** v18+ 
- **npm** or **pnpm** / **yarn**

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/heyshobhits/habitPulse.git
cd habitPulse

# 2. Switch to feature branch
git checkout feature/dashboard-restructure

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build & Production Verification
```bash
# Type check and build bundle
npm run build

# Preview production build locally
npm run preview
```
