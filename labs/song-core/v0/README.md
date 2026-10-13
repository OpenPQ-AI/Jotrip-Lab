# Sóng Core V0 - independent island intelligence kernel

**Status: ISOLATED RESEARCH ONLY. NOT READY FOR PRODUCTION.** 13/13 local tests passed under Node 22 on 2026-10-13. No live customer data, no Cloudflare deployment, no OpenPQ Core 1.2 change, no model weights training. The canonical source is the Git branch and review PR, NOT PHUQUOCLUX.

Sóng's mission is to be a Phú Quốc-native intelligence companion. This vertical slice proves **reusable boundaries**, not that its answers outperform other AIs.

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