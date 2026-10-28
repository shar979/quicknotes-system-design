QuickNotes System Architecture

## Requirements
- **Functional Requirements:** User authentication, CRUD operations for notes, tagging support, and fast feed retrieval.
- **Non-Functional Requirements:** 99.9% uptime, sub-200ms API response time, horizontal scalability, and secure data encryption at rest and in transit.

## Load Estimates (1 Million Users)
- **Active Users:** 10% daily active users (DAU) = 100,000 users.
- **Reads per Second:** Assuming each active user reads/views notes 20 times a day:
  $$\frac{100,000 \times 20}{86,400 \text{ sec}} \approx 23.15 \text{ reads/sec (average)}$$
- **Writes per Second:** Assuming each active user creates 2 notes a day:
  $$\frac{100,000 \times 2}{86,400 \text{ sec}} \approx 2.31 \text{ writes/sec (average)}$$
- **Storage per Year:** $100,000 \times 2 \text{ notes/day} \times 365 \text{ days} = 73,000,000 \text{ notes/year}$. At ~2 KB per note record: $\approx 146 \text{ GB/year}$.

## Architecture Diagram
```text
[ Clients (Web/Mobile) ]
          │
          ▼
   [ DNS / Route 53 ]
          │
          ▼
   [ CDN (Cloudflare) ]
          │
          ▼
 [ Load Balancer (ALB) ]
          │
          ├───────────────────────┬──────────────────────┐
          ▼                       ▼                      ▼
   [ App Server 1 ]        [ App Server 2 ]       [ App Server N ]
          │                       │                      │
          ├───────────────────────┴──────────────────────┤
          │                                              │
          ▼                                              ▼
    [ Redis Cache ]                            [ Message Queue (SQS) ]
          │                                              │
          ▼                                              ▼
   [ Primary DB (Writes) ]                        [ Worker Fleet ]
          │ (Streaming Replication)
          ▼
   [ Read Replica (Reads) ]
    ## Component Overview
*DNS: Resolves domain names to IP addresses to route user traffic globally.

*CDN: Caches static frontend assets at network edge locations to lower latency.

*Load Balancer: Distributes incoming traffic evenly across application servers to prevent bottlenecks.

*App Servers: Stateless compute instances executing API logic and business rules.

*Redis Cache: In-memory store caching hot user sessions and recent query results.

*Primary Database: Handles transactional write operations (INSERT, UPDATE, DELETE).

*Read Replica: Handles read-only queries to offload the primary database.

*Message Queue & Worker: Handles background asynchronous tasks without blocking client responses.

##Request Flows
-GET /notes Flow: Client request hits Load Balancer $\rightarrow$ App Server checks Redis Cache $\rightarrow$ if miss, queries Read Replica $\rightarrow$ returns payload.

-POST /notes Flow: Client sends payload $\rightarrow$ Load Balancer routes to App Server $\rightarrow$ App Server validates input $\rightarrow$ writes record to Primary DB $\rightarrow$ returns 201 Created.

##Trade-offs & SPOF Mitigation
Trade-off: Eventual consistency for cached lists vs. absolute real-time DB synchronization. We accept slight cache lag for speed.

SPOF Mitigation: Single points of failure are eliminated by deploying multi-AZ Load Balancers, redundant App Servers behind auto-scaling groups, and Primary-Replica database failover configurations.