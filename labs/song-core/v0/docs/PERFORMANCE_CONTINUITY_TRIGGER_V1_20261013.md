# Sóng Core - Architecture and Continuous Processing Red-Team Gate V1

Date: 2026-10-13 | Scope: isolated Git research. Core V1.2 and ai.openphuquoc.com remain untouched.

## 1. Verdict and threat model

**G1 is NOT build-ready for a real serving runtime.** The legacy 36/36 tests pass, but independent-style attack probes establish that publisher scope authorization, revoked-key enforcement, and authenticated consent are not implemented in the G1 source. Never call a synthetic microbenchmark real user capacity, and never call this audit an independently operated Work B session.

The audit trigger is manual and finite, not a scheduler. A trigger invocation pins a full Git SHA, runs offline tests and attack probes, produces REPORT.json and REPORT.md, and exits. It does not create repair tasks, drain Workers AI quota, deploy, collect guest data or retarget the Factory automation.

## 2. Why G1 will become slow

- G1 `VerifiedEvidenceLedger.select()` filters the entire `#rows` array by predicate and scope on each request. It then repeats `candidates.filter(...)` for every subject. With many independent entities sharing a scope, this can approach quadratic work.
- Result correctness also needs exact entity/route/predicate/time, signature authority, tombstone and conflict validation. A naive cache or vector search cannot replace these checks.
- Current model inference and TTS are distinct bottlenecks; local CPU verification latency cannot predict AI answer latency.
- Current `createEvidenceGatedTurn()` is deliberately deterministic, so measuring 64 simultaneous calls says nothing about actual parallel model sessions.

**Measured on a local synthetic CPU-only fixture:** 128 same-scope records p50 about 5.8 ms; 512 records p50 about 69.9 ms (a 12x increase for 4x volume). Machine-specific illustration only, not an SLA. Re-run on the authorized VPS with pinned SHA.

## 3. Correct serving architecture: two independent paths

FAST PATH - guest request:
1. Authenticate and validate trusted session/consent; enforce request size, deadline, tenant isolation and admission limits.
2. Query planner determines intent, entity, scope, time and whether evidence is required. If ambiguous, ask only what is necessary.
3. Read a precomputed **immutable evidence projection** keyed by `(domain,predicate,scope_type,scope_id,entity_id,source_epoch)` from DB/managed cache. Never scan the canonical event log on every guest turn.
4. Perform freshness, revocation and disagreement checks against the versioned authority ledger. Cache carries provenance and expiry, not naked claims.
5. Apply bounded model routing: deterministic answer for narrowly verified operations; use LLM for open-ended personalized explanation only when evidence and risk contract allow; stream answer where practical, separating text from CPU TTS.
6. Commit response status and minimal consented audit metadata. If dependency times out, return truthful `UNKNOWN`/`UNAVAILABLE`, not stale operational certainty.

SLOW PATH - continuous, asynchronous data and learning:
1. Ingest signed source events and privacy-permitted question signals into durable append-only inbox/outbox.
2. Claim durable work with a lease, source version and idempotency key. At-least-once delivery is acceptable; exactly-once business effects require deduplication in the database.
3. Verify scope, signature, key epoch, timestamps, schema, quarantine conflicts. Reject stale events without resurrecting superseded older statuses.
4. Atomically update canonical append-only events and regenerate a derived, read-optimized projection; publish a committed watermark only after transaction success.
5. Aggregate guest-intent patterns only under the approved legal basis, retention and purpose restrictions; never promote guest utterances to verified island facts automatically.
6. Run offline evaluator/benchmarks as bounded lower-priority jobs and version results; retry with jitter and capped attempts, then dead-letter queue (DLQ), monitored for manual action.

Isolation: guest latency must not wait for re-indexing, bulk embedding, model evaluation, data annotation or TTS audio synthesis where avoidable. No work should require the Windows bridge to stay on.

## 4. Speed without corrupting island truth

- Optimize **query algorithm first**, not concurrency first. Add a keyed Map/SQL B-tree projection; compare answers across the existing and optimized ledger on adversarial fixtures before switching.
- Materialize verified read views with signed provenance, revocation high-water mark and hard TTL; atomic generation swap prevents half-updated reads.
- Batch source verification in bounded, authorized update workers. Never use worker-produced customer answers as a factual source of truth.
- Split queues into urgent verified source changes (cano cancellations/closure) and background knowledge ingestion/embedding/evaluation. Urgent revocations must invalidate relevant cached projections before responses can cite them.
- Control simultaneous model requests separately from database work and VieNeu TTS; use bulkheads, per-request deadlines and circuit breakers. Do not silently fall back to paid providers.
- Session-aware, user-fair admission prevents one busy IP/user from monopolizing a shared provider; account for genuine multi-user NATs.
- Budget response tokens, use compact evidence selection, reuse stable source metadata without repeating documents. Do not truncate the evidence needed for a safe decision just to make responses fast.
- A streaming UX may improve perceived latency, but do not stream unverified factual claims before the verifier approves them.

## 5. Continuous processing and restart behavior

Test the following failures on an isolated VPS: server process killed between DB commit and ACK, duplicate event delivery, queue backlog, expired lease, source correction after cache fill, unavailable model, source outage, DB recovery, provider throttling, and replay after restoration. Require no lost signed events, no duplicated permanent business effect, no cross-user memory leak, and no stale operational claim after a later signed revocation.

Prefer PostgreSQL-backed inbox/outbox initially, unless measured volume justifies Kafka/Redis Streams. Do not add distributed complexity merely for a demo. A persistent VPS service runs from a pinned Git release; production requires a separate approval.

## 6. Metrics and release gates

- Guest: p50/p95/p99 end-to-end first useful text, error/429 rate, model latency, evidence lookup latency, fallback/abstention accuracy. Measure real human response quality independently.
- Brain: signed ingest-to-visible lag, projection version vs authoritative event version, freshness/expiry errors, conflict quarantine, replay correctness.
- Durable jobs: pending count, oldest job age, retries, lease expiry, dead-letter count, idempotency dedupe count and processing throughput.
- Recovery: offsite backup age, restore checksum, RPO/RTO measured on a **different VPS**, source registry/key history restored, memory deletion boundaries retained.
- Hard blockers: authorizedScopeIds/key epoch, trusted consent registry, semantic answer verification, atomic indexed read model, durable inbox/ack and real source provenance.
- Architecture research GO only means permission to engineer these components in isolated VPS. Operational GO requires real provider, privacy, load, failover and quality verification plus owner approval.

## 7. Manual trigger

From a clean, verified checkout of branch `audit/song-core-architecture-trigger-v1-20261013` on the approved VPS:

```bash
cd labs/song-core/v0
node audit/architecture-performance-trigger.mjs --expected-sha "$(git rev-parse HEAD)" --out /tmp/song-core-trigger-$(date +%Y%m%d)
cat /tmp/song-core-trigger-$(date +%Y%m%d)/REPORT.md
```

`--local-fixture` is permitted for preliminary offline demos but always marks Git provenance UNVERIFIED. Exit code 2 indicates P0 blockers. Never run the test as production load. Outputs are local and intentionally outside the source checkout.

**Expected initial verdict: HOLD_P0** until the demonstrated G1 gaps are addressed. A test that identifies unsafe architecture is useful even if it cannot produce a green badge.
