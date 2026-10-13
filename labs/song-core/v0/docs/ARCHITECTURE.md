# Sóng Core / Brain - V0 architecture decision and red-team checklist

Date: 2026-10-13. State: EXPERIMENT, OpenPQ Core 1.2 integration HOLD.

## Why separate?
OpenPQ Core owns cross-product identity, publication authority and verifiable feeds; it is not Sóng's LLM conversation orchestrator. Sóng Core owns intent/context, evidence selection, provider routing and response provenance. No authority to mutate Weather, Airport, Transit, CMS or Identity.

Guest -> Sóng Core -> Island Brain (verified data only) -> replaceable model adapter.
Optional isolated channels: opt-in session memory, aggregate question signals, knowledge backup + evaluation.

## Ownership boundaries
- Brain owns claims, aliases, geo scope, timestamp validity, conflict and provenance. Canonical verified data should live in owner-controlled private storage, not prompts, Cloudflare bindings or Windows.
- Providers are inference dependencies, not the owners of history or knowledge. Citing evidence ID does NOT prove factual validity.
- Guest question != verified fact. Opt-in signals aggregate to intent/time buckets; no raw personal transcripts/GPS/identity in public Git.
- Per-user session memory isolated and consent-controlled. V0 only implements ephemeral test memory.
- Backups: open JSONL + SHA-256 demonstrates byte integrity only, NOT offsite restoration. Real offsite encryption, clean-host proof and RPO/RTO remain future gates.
- Core V1.2 access later via read-only versioned snapshot evidence contracts once independently stable.

## Challenge gates
1. Misleading guest inputs cannot be promoted as facts.
2. Conflicting, expired or revoked evidence is quarantined.
3. Live status cannot be asserted without fresh authoritative operator/observation evidence.
4. B must independently evaluate Phú Quốc unseen questions and cross-domain reasoning.
5. Actual provider swap requires model-specific independent benchmark; adapter compatibility alone != quality.
6. Privacy/legal assessment precedes real guest collection. Withdrawal, deletion and separate purpose consent are future required gates.
7. Operational workspaces and deployments only on approved VPS; Windows remote/bridge only.
8. V0 has NO server runtime/auth/queue/vector index/production telemetry/concurrency, and must NOT be deployed.

## Gates
G0 ISOLATED CORE + SYNTHETIC TESTS. G1 independent architecture and dataset review. G2 authorized VPS runtime, encrypted backup and clean restore. G3 Core integration, only on explicit owner GO.
