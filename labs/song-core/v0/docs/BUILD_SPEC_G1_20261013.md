# SÓNG CORE / PHÚ QUỐC BRAIN - G1 IMPLEMENTATION CONTRACT

**13 October 2026 - Architecture candidate for isolated VPS implementation only. NOT production approval.**

## 0. Product invariant

Sóng is a Phú Quốc-native intelligence companion. It must accumulate verified local knowledge, respond to unfamiliar queries in context, distinguish uncertainty from fact, and retain the owner's intellectual property when Cloudflare, Gemini, Gemma, a model vendor or an entire hosting provider changes. It is not a renamed generic chatbot. Improving buttons or the pearl animation is outside this core program.

The intellectual asset is **(a) source-verified island knowledge + provenance and corrections, (b) anonymized/permissioned tourism demand and failure signals, (c) benchmark/evaluation cases and validated outcomes, and (d) model-independent orchestration and policies**, NOT the vendor LLM weights or raw tourist chats by default. No user utterance is automatically a fact or a training label.

## 1. Non-negotiable ownership & deployment boundary

| Owner | Owns | Must NOT own |
|---|---|---|
| OpenPQ Core V1.2/Intelligence | Domain publication and cross-product authority contracts, eventually stable identity interface | Sóng prompt state, AI vendor selection, private conversation data |
| Domain engines (Weather, Airport, Transit, Near Me, Cano) | Observation/operation truth, verified provenance, update/expiry contracts | Writing into Sóng guest memory or inferencing general recommendations |
| Sóng Core | Dialogue, intent and context planning, safe evidence retrieval, answer orchestration, private sessions, model gateway, evaluation | Unilateral edits to Core, domain datasets, Identity/CMS or inventing current statuses |
| Sóng Brain | Append-only canonical claim records, source authorizations, event precedence, correction history, retrieval indexes | Changing source truth without evidence; bundling customer PII into public Git |
| AI vendor adapter | Inference/ASR/TTS per explicit task and data policy | Canonical memory, source authority, exclusive document format, billing/control plane |

**PHUQUOCLUX** = authorized temporary remote/transfer console only. **Git** = canonical source with pinned full SHA. **Approved VPS** = isolated build/tests/runtime/data. **Independent encrypted offsite backup** = separate failure domain. No parallel heavyweight research on Windows. No new workflow touching OpenPQ Core V1.2, CMS, Identity, production, or Cloudflare quotas.

## 2. Logical data path

```
Client -> Sóng API gateway (auth/token, consent, rate limits, session)
       -> Query planner + ambiguity and temporal classifier
       -> Evidence broker (domain, entity, predicate, route/station, valid time)
          -> signed, immutable provenance ledger + source-authority registry
          -> scope / freshness / disputed or revoked veto / conflict check
       -> context/decision planner (separate observation, prediction, recommendation)
       -> model adapter (candidate language/reasoning only, provider replaceable)
       -> output verifier (claim-to-evidence semantic validation, policy/risk)
       -> response with evidence references, uncertainty and next useful action
       -> privacy-gated question signals / QA (no raw chat by default)
```

**Critical distinction:** `SIGNED_SOURCE` != `EVIDENCE_CURRENT` != `CLAIM_ENTAILED` != `ANSWER_USEFUL`. A model's reference to a valid evidence ID proves only the reference exists. All high-impact operational decisions require independently verifiable exact predicate/scope/time and conservative wording. For open-ended statements, a semantic entailment verifier is still to be designed/evaluated and is NOT proven by V0.1; until then limit output to approved deterministic renders, or mark internal QA drafts NOT VERIFIED. Never expose unverified factual model drafts as truth.

## 3. Core contracts and services

**EvidenceEvent** (see `src/verified-evidence.mjs`): `schema, id, entityId, domain, predicate, value, scope:{type,id}, observedAt, validUntil, status, source:{publisherId,datasetId,uri}, signature`. A publisher key is registered privately with explicitly authorized domain/predicate/scope and maximum freshness/validity. `VERIFIED` inside a record is not its own authorization; the signature, registry and publication receipt must agree. Current POC uses Node Ed25519 and a local registry. Real publishers, registry rotation, replay prevention, canonicalization across languages and downstream receipt verification are OPEN engineering gates.

**QueryPlan**: normalized query with intent, domain/predicate, explicit entity and route/station/area, requested effective time, planning vs fact classification, unknown ambiguity. A user cannot submit a trusted QueryPlan directly; the server validates every field against capabilities. A weather station observation cannot become an island-wide rain fact or a cano operational authorization. The current lexical prototype abstains on most queries; it is not semantic NLP.

**VerifiedAnswer / DecisionProof**: typed status (`SOURCE_BACKED_SCOPE_ONLY`, `UNKNOWN`, `STALE`, `CONFLICT`, `NOT_VERIFIED`, `MODEL_UNAVAILABLE`, `SOURCE_UNAVAILABLE`), claims and fingerprints, decision rationale, source age and scope, model+prompt+gate revisions. Raw model candidate is segregated for narrowly authorized synthetic QA; never assert independent factual PASS for automatically policy-filtered replies. Final text must avoid implying that one route-level operational record proves all-island or trip safety.

**ConversationSession**: server-generated session ID and trusted pairwise principal per product, with consent scope, encrypted content, TTL/retention, user erasure, integrity/version, idempotency, concurrency control. The gateway must validate authenticated identity; browser-supplied `principalId` and `consent:true` cannot be trusted. V0.1 only has an ephemeral resolver-injected scaffold; no durable production session store or consent registry.

**GuestQuestionSignal**: demand intent, time bucket, bounded geographic bucket when warranted, language, question category, failure/answer usefulness and consented outcomes. Keep separately from `VerifiedIslandClaim`; use purpose-specific lawful basis and consent/notice where required, data minimization, aggregation threshold, retention and deletion. Raw chat/audio and precise GPS are OFF by default. A validated customer query reveals demand, NOT an island fact or a license to fine-tune.

**ModelProvider / ToolProvider**: contracts, not vendor implementations. LLM generate/stream, structured extraction, model version, bounded deadline/cost, cancellation, error taxonomy; ASR and TTS separate. Must support at least 2 adapters with reproducible same-case behavior. New providers require data processing/privacy assessment and independent answer benchmark. Model-dependent embeddings can be rebuilt from canonical text, never treated as portable ground truth.

**Backup/Restore**: versioned Postgres metadata + immutable evidence event export, explicit object-store manifest (with sha256), privacy-scoped sessions separately, encryption and offsite replica. Key management independent from backup file; never store production secrets/private signing keys in Git. Clean VPS restoration tests schema, row counts, corrections/revocations, source registry, indexes, snapshots, permissions and benchmark behavior. V0.1 JSONL SHA + signature restore proves local integrity only; no actual offsite backup/RPO/RTO claim.

## 4. Data architecture on VPS (proposal, NOT executed migration)

PostgreSQL tables: `source_publishers`, `evidence_events` (immutable), `knowledge_entities`, `entity_aliases`, `conversation_sessions`, `conversation_turns` (separately encrypted and scoped), `consent_grants`, `guest_signal_aggregate`, `evaluation_sets`, `evaluation_runs`, `provider_catalog`, `audit_events`. Use migrations with explicit backward compatibility and append-only correction events. Do not create a writable materialized fact table without keeping provenance, revision and expiry. Build a lexical/FTS baseline before choosing an embeddings model; a vector index is a disposable derived artifact. Proposed skeleton is `schema/POSTGRES_SCAFFOLD_DO_NOT_RUN.sql`.

## 5. Failure and recovery architecture

- Cloudflare AI quota exhausted: route to a separately approved provider if configured and independently tested; otherwise return a truthful unavailable status. No silent paid fallback.
- Model overload: bounded queue, timeout, circuit breaker, fail-safe text output; never lose a completed guest message unexpectedly.
- Source stale/disputed/revoked: no affirmative operational answer, even when another domain is fresh. Latest signed tombstone prevents older positive records from resurfacing.
- Brain DB down: serve only explicitly documented immutable safe static facts from fresh separately verified snapshot, or abstain. Never synthesize weather/cano updates.
- VPS down: restore from encrypted offsite on a different host and run verification suite before switching traffic. RPO/RTO remain **UNMEASURED** until exercised.
- Core 1.2 incomplete: Sóng standalone bench and Brain pipeline continue in VPS lab using synthetic fixtures; Core integration and real domain authority publications remain HOLD.

## 6. Bounded delivery plan and GO gates

**G1 - Architecture/build contract:** domain ownership, typed evidence+authority, scope/time/revocation, user-vs-fact separation, safe model boundary, privacy architecture and local repeatable regression. Can authorize independent VPS engineering only, not production. This document + prototype provide a candidate, subject to independent B review and owner approval of architectural decisions.

**G2 - VPS isolated integrated build:** create private VPS namespace, PostgreSQL migrations, authenticated gateway, authority registry, signed-read-only source broker (test fixtures first), queue/backpressure, provider adapters, actual encryption and data erasure, log redaction and data-collection-off default. No Core mutation. Verify with clean-host restore and reversible migrations. Measured load and model errors, no guessed throughput.

**G3 - Intelligence evaluation:** at least 100 independently held-out Phú Quốc cases across local naming/geography, seasons, verified operations, cross-domain decisions, multi-turn dialogue, multilingual and unknowns. Validate against expert-confirmed source snapshots, timestamped and blinded. Score factual error, hallucination, evidence agreement, context, usefulness, tone and abstention. Benchmark generic AI in same declared data-access condition. Owner must approve numeric targets before any release PASS. Stop after at most two bounded revisions per hypothesis; change hypothesis on repeated failure.

**G4 - Explicit owner release GO:** OpenPQ Core publication/Identity read-only contracts approved, independent security/privacy sign-off, live source boundaries, real-provider quality comparison, clean-room VPS restore and production cutover/rollback tested. Until then: NO production merge, deploy, new guest capture or change in Core/CMS/Identity.

## 7. Work split

**A (builder):** implement exact contract with schema and test evidence, no undocumented shortcuts, publish pinned Git SHA. **B (independent):** use hidden Phú Quốc cases; test ownership boundaries, conflict, stale information, privacy and restore, label FAIL/UNVERIFIED truthfully. Product/architecture owner decides GO once per gate. Do not bootstrap autonomous A/B ping-pong or confuse more patches with learning.

## 8. Explicit current limitations of reference modules

`src/brain.mjs` and `src/core.mjs` are **legacy V0 experiments** with known evidence and identity gaps. Treat them as historical baselines only; do NOT build production on them. `src/verified-evidence.mjs`, `src/query-contract.mjs`, `src/secure-turn.mjs`, `src/scoped-memory.mjs` and `src/signed-backup.mjs` are **V0.1 hardened reference scaffolds**, not an operational AI. They only prove a few safety gates with synthetic signers; they do not solve general local-language understanding, access control, legal compliance, real-world source authenticity, scalable context memory or inference quality.
