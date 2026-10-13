# Sóng Core V0 + hardened G1 architecture research

**Status: ISOLATED RESEARCH ONLY. NOT READY FOR PRODUCTION.** Legacy V0 originally passed 13/13 local tests; hardened G1 adds signed evidence and architecture gates, tested under Node 22 on 2026-10-13. No live customer data, no Cloudflare deployment, no OpenPQ Core 1.2 change, no model weights training. The canonical source is the Git branch and review PR, NOT PHUQUOCLUX.

Sóng's mission is to be a Phú Quốc-native intelligence companion. This vertical slice proves **reusable boundaries**, not that its answers outperform other AIs.

**G1 architecture candidate:** [Full build contract](docs/BUILD_SPEC_G1_20261013.md) and [adversarial review](docs/RED_TEAM_FINDINGS_G1_20261013.md). The G1 modules are reference scaffolds. Independent Work B and owner decision remain separate.

## Components

- `src/brain.mjs`: verified, time-scoped, source-linked Phú Quốc claims. Reject invalid input, expired/revoked claims and contradictions. Never promote customer questions to facts.
- `src/core.mjs`: provider-independent conversation orchestration. Refuse missing evidence and unsafe live claims. Even when a model cites an evidence ID, the answer is marked **NOT_FACT_CHECKED**.
- `src/providers.mjs`: Cloudflare Workers AI and OpenAI-compatible inference adapters. Providers are not canonical data owners.
- `src/sessions.mjs`: bounded **ephemeral test memory only**, retained solely when `consent.sessionMemory===true`. Production persistence does not exist.
- `src/signals.mjs`: optional, coarse monthly consented metrics without raw prompts, GPS, identities or transcripts. Not enabled on any site.
- `src/backup.mjs`: Node-side verified JSONL export and restore of Brain claims only. **No offsite backup exists yet**.

Run with Node 20+: `npm test` and `npm run check`. No installation or secrets needed.

## Critical restrictions

1. Do NOT merge this branch into any production/consumer runtime. Core V1.2, Identity and external domain engines remain locked.
2. No permanent workspace or background workload on Windows. Only Git is used as source in this iteration; future staged integration must run on authorized VPS.
3. Never store actual guest chat content in a public repo, test fixture or training corpus. Aggregation alone may still require a privacy/legal assessment before deployment.
4. Claim relevance scoring is a deterministic prototype, **not reliable semantic retrieval**. It may miss or over-rank claims. Volatile requests deliberately require fresh operator/observation evidence. These gates err on the side of abstention.
5. No durable session store, queue, embeddings/vector index, role-based auth, full audit storage, RPO/RTO or measured throughput yet. Do not claim these exist.
6. Switching an API connector is supported at the call shape only; cross-model answer quality and actual provider portability are untested on live models.

## Next gate

Owner + independent review must approve knowledge schema, source authority and retention model before a VPS-only standalone API is built. Set up real (privacy-approved) Brain snapshots, blinded Phú Quốc QA, portable encrypted backups and a clean-host restoration test. Any OpenPQ Core integration requires explicit separate GO.

See `docs/ARCHITECTURE.md`.

## G1 reference modules (isolated only)

- `src/verified-evidence.mjs` - Ed25519-signed, registry-authorized scope/predicate/time event ledger with conflict/revoke.
- `src/query-contract.mjs` - narrow fail-closed operational question classification.
- `src/secure-turn.mjs` - deterministic safe operational output only, not general AI inference.
- `src/scoped-memory.mjs` - identity-resolver-bound ephemeral proof.
- `src/signed-backup.mjs` - signed, checksum-protected synthetic knowledge export and local restore.
- `test/architecture-gates.test.mjs` - adversarial safety gates; includes no actual customer data.

**Important:** `src/core.mjs` and `src/brain.mjs` are the legacy V0 design and MUST NOT be treated as the hardened production entrypoint. No standalone API is deployed.
