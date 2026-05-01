# Technical Requirements Document (TRD)
# DemocrAI — Your Personal Election Co-Pilot

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** May 2026  
**Authors:** Engineering Team  
**Companion Doc:** DemocrAI PRD v1.0  

---

## 1. Overview

This TRD translates the DemocrAI PRD into concrete technical specifications, architecture decisions, data models, API contracts, and infrastructure requirements. It serves as the authoritative reference for engineering implementation of the MVP (v1.0).

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│   Web App (Next.js)    Mobile App (React Native)   Embed SDK   │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS / WSS
┌──────────────────────────────▼──────────────────────────────────┐
│                         API GATEWAY                             │
│              (Kong / AWS API Gateway + WAF)                     │
│   Auth  │  Rate Limiting  │  Request Routing  │  CDN Edge      │
└──────┬───────────┬────────────────┬────────────────┬────────────┘
       │           │                │                │
┌──────▼──┐  ┌─────▼──────┐  ┌─────▼──────┐  ┌─────▼──────────┐
│  Auth   │  │  Ballot     │  │  AI Chat   │  │  Logistics     │
│ Service │  │  Service    │  │  Service   │  │  Service       │
│(Node.js)│  │ (Python)   │  │ (Python)   │  │ (Node.js)      │
└──────┬──┘  └─────┬───────┘  └─────┬──────┘  └─────┬──────────┘
       │           │                │                │
┌──────▼───────────▼────────────────▼────────────────▼──────────┐
│                      INTERNAL MESSAGE BUS                       │
│                      (AWS SQS / Kafka)                          │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                        DATA LAYER                               │
│  PostgreSQL (primary)  │  Redis (cache)  │  Pinecone (vectors) │
│  S3 (documents/media)  │  Elasticsearch (search index)          │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                     EXTERNAL INTEGRATIONS                        │
│  Google Civic API  │  Ballotpedia API  │  FEC API  │  News RSS  │
│  Twilio  │  Google Maps  │  LLM Provider  │  Auth0               │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Core Services

| Service | Language | Framework | Responsibility |
|---|---|---|---|
| Auth Service | Node.js | Express + Auth0 SDK | User authentication, JWT issuance, session mgmt |
| Ballot Service | Python | FastAPI | Ballot ingestion, parsing, candidate data pipeline |
| AI Chat Service | Python | FastAPI + LangChain | Conversational AI, RAG pipeline, citation engine |
| Logistics Service | Node.js | Express | Polling places, registration, reminders |
| Notification Service | Node.js | Bull (queues) | Email/SMS dispatch via Twilio/SendGrid |
| Data Ingestion Service | Python | Celery | Scheduled crawling and data pipeline orchestration |
| Admin Service | Node.js | Express | Content moderation, flagged response review |

---

## 3. Data Architecture

### 3.1 Core Data Models

#### User
```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  auth0_id        VARCHAR(255) UNIQUE NOT NULL,
  display_name    VARCHAR(100),
  zip_code        CHAR(5),
  state_code      CHAR(2),
  county_fips     VARCHAR(10),
  issue_priorities JSONB,          -- e.g. {"economy": 5, "environment": 3}
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ      -- soft delete
);
```

#### Election
```sql
CREATE TABLE elections (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_date   DATE NOT NULL,
  election_type   VARCHAR(50),     -- 'general', 'primary', 'special', 'runoff'
  state_code      CHAR(2) NOT NULL,
  county_fips     VARCHAR(10),
  ocd_id          VARCHAR(255) UNIQUE, -- Open Civic Data identifier
  title           VARCHAR(255),
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### Race
```sql
CREATE TABLE races (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id     UUID REFERENCES elections(id),
  office_level    VARCHAR(50),     -- 'federal', 'state', 'local'
  office_title    VARCHAR(255),    -- 'U.S. Senate', 'State Assembly District 14'
  district_ocd_id VARCHAR(255),
  is_partisan     BOOLEAN,
  summary         TEXT,            -- AI-generated plain language summary
  summary_updated_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### Candidate
```sql
CREATE TABLE candidates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  race_id         UUID REFERENCES races(id),
  full_name       VARCHAR(255) NOT NULL,
  party           VARCHAR(100),
  incumbent       BOOLEAN DEFAULT FALSE,
  campaign_url    TEXT,
  photo_url       TEXT,
  fec_candidate_id VARCHAR(20),
  ballotpedia_url TEXT,
  bio_summary     TEXT,            -- AI-generated
  positions       JSONB,           -- {"healthcare": "...", "economy": "..."}
  positions_updated_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### BallotMeasure
```sql
CREATE TABLE ballot_measures (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id     UUID REFERENCES elections(id),
  measure_number  VARCHAR(50),     -- 'Prop 32', 'Amendment A'
  title           TEXT NOT NULL,
  full_text       TEXT,
  plain_summary   TEXT,            -- AI-generated
  fiscal_impact   TEXT,            -- AI-generated from official fiscal analysis
  proponent_args  TEXT,            -- AI-synthesised
  opponent_args   TEXT,            -- AI-synthesised
  endorsements    JSONB,           -- [{"org": "...", "position": "yes|no"}]
  source_urls     JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### UserBallot
```sql
CREATE TABLE user_ballots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  election_id     UUID REFERENCES elections(id),
  saved_races     JSONB,           -- {race_id: candidate_id}
  saved_measures  JSONB,           -- {measure_id: "yes|no|undecided"}
  notes           JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, election_id)
);
```

#### ChatSession
```sql
CREATE TABLE chat_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  election_id     UUID REFERENCES elections(id),
  messages        JSONB NOT NULL DEFAULT '[]', -- array of {role, content, citations, ts}
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### ContentFlag
```sql
CREATE TABLE content_flags (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID REFERENCES chat_sessions(id),
  message_index   INT,
  flag_reason     TEXT,
  reporter_id     UUID REFERENCES users(id),
  status          VARCHAR(50) DEFAULT 'pending', -- 'pending', 'reviewed', 'actioned'
  reviewer_notes  TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 Vector Store Schema (Pinecone)

Each document chunk is embedded and stored with metadata:

```json
{
  "id": "doc_{source}_{doc_id}_{chunk_index}",
  "values": [/* 1536-dim embedding */],
  "metadata": {
    "source_type": "candidate_site | fec_filing | news | ballot_text | voting_record",
    "candidate_id": "uuid | null",
    "race_id": "uuid | null",
    "election_id": "uuid",
    "state_code": "CA",
    "url": "https://...",
    "title": "Source title",
    "published_at": "2026-04-15T00:00:00Z",
    "freshness_score": 0.95
  }
}
```

---

## 4. AI / ML Architecture

### 4.1 RAG Pipeline (Retrieval-Augmented Generation)

```
User Query
    │
    ▼
Query Classifier
(intent: candidate_info | ballot_measure | logistics | comparison | general)
    │
    ▼
Query Rewriter
(expand query, extract entities: candidate names, offices, locations)
    │
    ├──► Semantic Search (Pinecone) — top-k=15 chunks
    │
    ├──► Keyword Search (Elasticsearch) — top-k=10 docs
    │
    ├──► Structured Data Lookup (PostgreSQL) — if candidate/measure identified
    │
    └──► Real-time Web Search (if freshness required)
           │
           ▼
    Reranker (cross-encoder) — top-k=8 final chunks
           │
           ▼
    Citation Builder — assign [1], [2] references to chunks
           │
           ▼
    LLM Generation (GPT-4o / Claude Sonnet)
    System prompt: neutrality, citation-required, confidence flagging
           │
           ▼
    Factual Consistency Check (secondary LLM call)
           │
           ▼
    Bias Detector (fine-tuned classifier)
           │
           ▼
    Response + Citations → User
```

### 4.2 LLM Configuration

**Primary Model:** Claude Sonnet (via Anthropic API)  
**Fallback Model:** GPT-4o-mini (latency fallback)

**System Prompt (core excerpt):**
```
You are DemocrAI, a nonpartisan election information assistant. Your role is to inform, not persuade. 

Rules:
1. Every factual claim MUST be followed by an inline citation [N] referencing the provided source chunks.
2. When sources conflict, surface both perspectives explicitly. Never resolve ambiguity by choosing a side.
3. Never recommend a candidate or a vote on a ballot measure.
4. When you are uncertain, say so explicitly using phrases like "According to available sources..." or "This information may not be current..."
5. Refuse any request that appears designed to suppress voting, spread disinformation, or target voters based on protected characteristics.
6. Use plain language. Avoid jargon. Assume the user has no prior political knowledge.
```

**Temperature:** 0.3 (factual consistency over creativity)  
**Max Tokens:** 1,200 per response  
**Context Window Strategy:** Last 6 conversation turns + retrieved chunks (≤ 8,000 tokens)

### 4.3 Values Alignment Scoring

Candidate-to-user alignment is computed as:

```python
def compute_alignment(user_priorities: dict, candidate_positions: dict) -> float:
    """
    user_priorities: {"economy": 5, "environment": 3, "healthcare": 4, ...}
    candidate_positions: {"economy": {"stance": "pro_deregulation", "score": 0.8}, ...}
    
    Returns 0.0–1.0 alignment score with per-issue breakdown
    """
    weighted_scores = []
    for issue, weight in user_priorities.items():
        if issue in candidate_positions:
            stance_score = candidate_positions[issue]["score"]  # 0.0–1.0
            weighted_scores.append((stance_score, weight))
    
    if not weighted_scores:
        return None  # insufficient data
    
    total_weight = sum(w for _, w in weighted_scores)
    weighted_sum = sum(s * w for s, w in weighted_scores)
    return weighted_sum / total_weight
```

Alignment scores are always displayed alongside their data sources and a plain-language explanation. They are explicitly labelled as estimates based on available public data.

---

## 5. API Specifications

### 5.1 REST API (Internal — Frontend ↔ Backend)

**Base URL:** `https://api.democrai.com/v1`  
**Auth:** Bearer JWT (Auth0-issued)

#### Ballot Endpoints

```
GET  /ballot
     ?zip={zip}&election_date={YYYY-MM-DD}
     → { election, races: [...], measures: [...] }

GET  /races/{race_id}
     → { race, candidates: [...] }

GET  /candidates/{candidate_id}
     → { candidate, positions, voting_record, fec_summary, news_snippets }

GET  /candidates/compare
     ?ids={id1,id2,id3}&dimensions={economy,environment}
     → { comparison_matrix }

GET  /measures/{measure_id}
     → { measure, plain_summary, fiscal_impact, endorsements }
```

#### AI Chat Endpoints

```
POST /chat/sessions
     Body: { election_id }
     → { session_id }

POST /chat/sessions/{session_id}/messages
     Body: { content: "What does Jane Smith say about housing?" }
     → SSE stream: { delta, citations, confidence, is_final }

GET  /chat/sessions/{session_id}
     → { session, messages: [...] }

POST /chat/sessions/{session_id}/messages/{index}/flag
     Body: { reason: "Inaccurate information about candidate X" }
     → { flag_id }
```

#### Logistics Endpoints

```
GET  /logistics/registration?state={state}
     → { registration_url, deadline, status_check_url }

GET  /logistics/polling-place?address={encoded_address}
     → { polling_place, hours, accessibility }

GET  /logistics/deadlines?state={state}
     → { early_voting, mail_in_request, mail_in_return, election_day }

POST /logistics/reminders
     Body: { type: "email|sms", contact, reminder_dates: [...] }
     → { reminder_id }
```

#### User Profile Endpoints

```
GET    /users/me
       → { user profile }

PATCH  /users/me
       Body: { zip_code, issue_priorities }
       → { updated user }

GET    /users/me/ballot/{election_id}
       → { saved ballot state }

PUT    /users/me/ballot/{election_id}
       Body: { saved_races, saved_measures, notes }
       → { updated ballot state }

DELETE /users/me
       → 204 (initiates GDPR deletion workflow)
```

### 5.2 Streaming (AI Chat)

Chat responses are streamed via Server-Sent Events (SSE):

```
Content-Type: text/event-stream

data: {"type": "delta", "text": "Senator Smith supports "}
data: {"type": "delta", "text": "expanding Medicare"}
data: {"type": "citation", "index": 1, "source": {"title": "...", "url": "...", "date": "2026-03-12"}}
data: {"type": "confidence", "level": "high", "note": null}
data: {"type": "done", "message_id": "msg_abc123"}
```

### 5.3 External API Integrations

| API | Usage | Rate Limit Strategy |
|---|---|---|
| Google Civic Information API | Ballot data by address | Cache aggressively; refresh daily |
| Ballotpedia API | Candidate profiles, voting history | ETL into local DB; not called at runtime |
| FEC API | Campaign finance data | Nightly batch ingestion |
| Twilio | SMS reminders | Queue-based; honour do-not-contact |
| Google Maps Platform | Polling place display | Call at user request; cache by address hash |
| News APIs (NewsAPI.org, GDELT) | Recent coverage per candidate | Real-time with 15-min cache |

---

## 6. Data Ingestion Pipeline

### 6.1 Pipeline Architecture

```
┌─────────────────────────────────────────────────────┐
│                 INGESTION SCHEDULER                  │
│              (Celery Beat + Redis)                   │
└────────────────────────┬────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
  │  Ballot     │ │  Candidate  │ │    News     │
  │  Crawler    │ │  Data ETL   │ │   Crawler   │
  │  (nightly)  │ │  (nightly)  │ │  (hourly)   │
  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
         │               │               │
         └───────────────▼───────────────┘
                  ┌─────────────┐
                  │  Raw Store  │
                  │    (S3)     │
                  └──────┬──────┘
                         │
                  ┌──────▼──────┐
                  │   Parser    │
                  │  + Cleaner  │
                  └──────┬──────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
       ┌────────┐  ┌──────────┐ ┌──────────┐
       │Postgres│  │AI Summary│ │ Embedder │
       │ (struc)│  │Generator │ │(Pinecone)│
       └────────┘  └──────────┘ └──────────┘
```

### 6.2 Ingestion Jobs

| Job | Schedule | Source | Output |
|---|---|---|---|
| ballot_sync | Daily 2AM | Google Civic API + state feeds | races, candidates tables |
| candidate_etl | Daily 3AM | Ballotpedia API | candidates.positions, bio |
| fec_sync | Daily 4AM | FEC API | candidates.fec_summary |
| news_crawl | Hourly | NewsAPI, RSS feeds | Vector index |
| ai_summarise | Triggered by ballot_sync | Internal | Plain-language summaries |
| embed_documents | Triggered post-ingestion | Internal | Pinecone upserts |

### 6.3 Data Freshness Requirements

| Data Type | Max Staleness | Enforcement |
|---|---|---|
| Election/race metadata | 24 hours | Nightly sync job |
| Candidate positions | 24 hours | Nightly ETL |
| FEC filings | 48 hours | Nightly with 2-day grace |
| News articles in vector index | 15 minutes (election season) | Hourly crawl + streaming |
| Polling place info | 7 days | Weekly sync |
| Registration deadlines | 48 hours | Weekly sync with alerts |

---

## 7. Infrastructure

### 7.1 Cloud Architecture (AWS)

| Component | Service | Sizing (MVP) |
|---|---|---|
| API Services | ECS Fargate | 4 vCPU / 8GB per service; min 2 tasks |
| Databases | RDS PostgreSQL (Multi-AZ) | db.r6g.large |
| Cache | ElastiCache Redis | cache.r6g.large, cluster mode |
| Vector Store | Pinecone (managed) | p2.x1 pod; 2M vectors |
| Search | OpenSearch (managed) | 3-node cluster |
| Object Storage | S3 | Standard; lifecycle to Glacier after 1yr |
| Message Bus | SQS (standard + FIFO) | Managed |
| CDN | CloudFront | Global edge |
| DNS + WAF | Route53 + AWS WAF | Regional rules |
| Secrets | AWS Secrets Manager | Rotated every 90 days |
| Observability | Datadog | APM + Logs + RUM |

### 7.2 Scaling Strategy

**Election-season auto-scaling triggers:**
- ECS task scale-out at 60% CPU or 70% memory
- Pre-warmed capacity: 10x baseline provisioned 7 days before election day
- Rate limits per user: 30 AI chat requests/hour (Pro tier), 5/hour (Free tier)
- Redis caching for all ballot data (TTL = 6h); reduces LLM calls by ~70%

### 7.3 Disaster Recovery

- **RTO (Recovery Time Objective):** 15 minutes
- **RPO (Recovery Point Objective):** 1 hour
- PostgreSQL: automated backups every hour + Multi-AZ failover
- Pinecone: managed replication
- Static assets: replicated across 3 S3 regions
- Runbook for manual failover documented and tested quarterly

---

## 8. Security Architecture

### 8.1 Auth & Authorization

- **Auth Provider:** Auth0 (Universal Login)
- **Token Type:** JWT (RS256 signed), 1h access token, 30d refresh token
- **Scopes:** `read:ballot`, `write:profile`, `read:chat`, `write:chat`
- **RBAC Roles:** `user`, `civic_partner`, `admin`, `moderator`

### 8.2 Data Protection

| Layer | Mechanism |
|---|---|
| In Transit | TLS 1.3 everywhere; HSTS enforced |
| At Rest | AES-256 on RDS, S3, ElastiCache |
| PII | Email hashed for analytics; voting preferences not logged to analytics |
| API Keys | Secrets Manager; never in code or env vars in plaintext |
| Audit Log | All admin actions logged to immutable CloudTrail |

### 8.3 AI Safety Controls

```
Input Guardrails:
- PII detector → redact before sending to LLM
- Prompt injection detector → block/flag suspicious inputs
- Topic classifier → route off-topic (non-election) queries to refusal

Output Guardrails:
- Political bias classifier (fine-tuned) → score every response; flag if > 0.7
- Candidate recommendation detector → block if AI recommends a vote
- Misinformation keyword list → trigger human review queue
- Hallucination check → secondary LLM validates citations exist in context
```

### 8.4 Abuse & Threat Model

| Threat | Mitigation |
|---|---|
| Voter suppression prompts | Input classifier + policy refusal |
| Prompt injection via user input | Input sanitisation + sandboxed context |
| Scraping candidate data at scale | Rate limiting + CAPTCHA on unauthenticated endpoints |
| Account takeover | MFA enforced; anomaly detection via Auth0 |
| DDoS on election day | AWS Shield Advanced + CloudFront WAF rules |
| Data exfiltration | VPC egress controls; DLP policies |

---

## 9. Frontend Architecture

### 9.1 Web App

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + CSS Modules for complex components
- **State:** Zustand (global) + React Query (server state)
- **AI Chat:** Custom SSE hook with streaming token rendering
- **Maps:** Google Maps JS API (lazy-loaded)
- **Analytics:** PostHog (self-hosted for privacy)
- **a11y:** axe-core in CI; Radix UI for accessible primitives
- **i18n:** next-intl (English MVP; Spanish in v1.5)

### 9.2 Key Pages

| Route | Description |
|---|---|
| `/` | Landing + address entry |
| `/ballot` | Personalised ballot dashboard |
| `/ballot/race/[id]` | Race detail with candidate comparison |
| `/ballot/measure/[id]` | Ballot measure decoder |
| `/chat` | AI election co-pilot chat |
| `/logistics` | Registration, polling place, deadlines |
| `/profile` | User civic profile |
| `/about/transparency` | Data sources + methodology |

### 9.3 Performance Targets

| Metric | Target |
|---|---|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID / INP | < 200ms |
| CLS | < 0.1 |
| Bundle size (initial JS) | < 150KB gzipped |
| Chat first token latency | < 1.5s |
| Lighthouse score (mobile) | ≥ 90 |

---

## 10. Observability

### 10.1 Metrics

**Business metrics (custom events):**
- `ballot_viewed`, `candidate_compared`, `measure_decoded`
- `chat_message_sent`, `chat_session_duration`
- `reminder_set`, `share_triggered`
- `flag_submitted`, `flag_resolved`

**Technical metrics:**
- API latency (p50, p95, p99) per endpoint
- LLM latency + token usage per query
- Cache hit rate (Redis)
- Vector search latency
- Error rates by service

### 10.2 Alerting Thresholds

| Alert | Threshold | Severity |
|---|---|---|
| API p95 latency | > 5s | Warning |
| API p99 latency | > 10s | Critical |
| Chat first-token latency | > 3s | Warning |
| Error rate | > 1% | Warning |
| Error rate | > 5% | Critical |
| Bias classifier triggers | > 5% of responses | Critical (PagerDuty) |
| Data freshness violation | Ballot data > 26h stale | Critical |

### 10.3 Logging Standards

- Structured JSON logs (Datadog ingestion)
- No PII in logs (email, name, address filtered at log-write layer)
- Log retention: 90 days hot, 1 year cold (S3 Glacier)
- Correlation IDs propagated across all services per request

---

## 11. Testing Strategy

### 11.1 Test Coverage Requirements

| Layer | Target Coverage |
|---|---|
| Unit tests (services) | ≥ 85% |
| Integration tests (API) | ≥ 70% |
| E2E tests (critical paths) | Top 10 user journeys |
| AI response quality | Automated eval suite (RAGAS) |

### 11.2 AI Quality Evaluation

**Automated RAGAS metrics (run nightly on test set):**
- Faithfulness: ≥ 0.90 (claims supported by retrieved context)
- Answer Relevance: ≥ 0.85
- Context Recall: ≥ 0.80
- Citation Accuracy: ≥ 0.95 (citations link to real supporting content)

**Human eval (weekly during election season):**
- 50-question adversarial test set reviewed by bipartisan panel
- Bias score < 0.15 (0 = perfectly neutral)

### 11.3 Load Testing

- Simulate election-day traffic: 10,000 concurrent users
- Chaos engineering: monthly failure injection (database, LLM API, cache)
- Full load test 8 weeks before each election; pass/fail gate for release

---

## 12. CI/CD Pipeline

```
Push to feature branch
    │
    ▼
GitHub Actions
├── Lint + format (ESLint, Ruff, Black)
├── Unit tests
├── Type checking (TypeScript, mypy)
├── SAST scan (Semgrep)
└── Docker build
    │
    ▼
PR to main
├── Integration tests (Testcontainers)
├── AI eval suite (sampled)
├── Performance budget check
└── Security scan (Trivy on images)
    │
    ▼
Merge to main → Auto-deploy to Staging
    │
    ▼
Manual gate: QA sign-off + AI eval pass
    │
    ▼
Deploy to Production (blue/green via ECS)
    │
    ▼
Canary (5% traffic) → 15-min bake time → Full rollout
    │
    ▼
Post-deploy synthetic monitoring (30 min)
```

---

## 13. Compliance & Legal

| Requirement | Implementation |
|---|---|
| CCPA | Data deletion API; no sale of personal data; privacy policy |
| GDPR (EU users) | Consent management; DPA with all processors; right to erasure |
| WCAG 2.1 AA | axe audits in CI; quarterly manual accessibility audit |
| FEC Disclaimers | DemocrAI is not a political committee; disclaimer on all pages |
| AI Disclosure | All AI-generated content labelled; methodology page public |
| Terms of Service | Explicit prohibition of misuse for voter suppression or disinfo |

---

## 14. Appendix

### A. Tech Stack Summary

| Category | Choice |
|---|---|
| Frontend | Next.js 15, React 19, Tailwind CSS, Zustand |
| Backend | Python (FastAPI), Node.js (Express) |
| AI / LLM | Anthropic Claude Sonnet, LangChain, RAGAS |
| Vector DB | Pinecone |
| Primary DB | PostgreSQL 16 (RDS) |
| Cache | Redis 7 (ElastiCache) |
| Search | OpenSearch 2.x |
| Queue | AWS SQS + Celery |
| Storage | AWS S3 |
| Auth | Auth0 |
| Infrastructure | AWS (ECS Fargate, CloudFront, Route53, WAF) |
| IaC | Terraform |
| CI/CD | GitHub Actions |
| Observability | Datadog (APM, Logs, RUM) |
| Notifications | Twilio (SMS), SendGrid (Email) |

### B. Open Questions / Decisions Pending

| # | Question | Owner | Due |
|---|---|---|---|
| 1 | LLM provider: Anthropic-only vs multi-provider fallback? | Eng Lead | Week 2 |
| 2 | Should values alignment scores be shown as numbers or only qualitative? | Product + Legal | Week 2 |
| 3 | Pinecone vs Weaviate for vector store? (cost at 10M+ vectors) | Infra | Week 3 |
| 4 | Self-host bias classifier or use third-party API? | ML Lead | Week 3 |
| 5 | GDPR: geo-restrict EU users at MVP or include from day 1? | Legal | Week 1 |

### C. Glossary

| Term | Definition |
|---|---|
| RAG | Retrieval-Augmented Generation — LLM answers grounded in retrieved documents |
| OCD ID | Open Civic Data identifier — standardised format for political jurisdictions |
| FEC | Federal Election Commission — regulates US campaign finance |
| RAGAS | Retrieval-Augmented Generation Assessment — framework for evaluating RAG quality |
| CCPA | California Consumer Privacy Act |
| GDPR | General Data Protection Regulation (EU) |
| GOTV | Get Out The Vote — civic mobilisation campaigns |
| SSE | Server-Sent Events — streaming protocol for real-time data push |
| WAF | Web Application Firewall |
