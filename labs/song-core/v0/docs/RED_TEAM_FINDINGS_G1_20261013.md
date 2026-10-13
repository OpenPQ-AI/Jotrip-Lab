# INDEPENDENT-STYLE ADVERSARIAL ARCHITECTURE REVIEW (not an independently operated Work B)

Date 2026-10-13. Reviewer: current ChatGPT session reviewing PR #44 source and isolated local tests. **Do not mislabel this as a separate independent Work B run or production certification.**

| ID | Risk and counterexample | Severity | V0.1 mitigation | Remaining gate |
|---|---|---|---|---|
| RT-01 | A fresh weather station record could allow a claim about current cano activity | P0 | Exact signed `domain+predicate+route` source evidence check | Real authorized operator feeds and a semantic query classifier |
| RT-02 | `VERIFIED` in a self-authored JSON field had no trustworthy publication authorization | P0 | Ed25519 signature and private domain capability registry | Issuer onboarding, key custody, rotation, RFC 8785 canonicalization, real publication receipts |
| RT-03 | A model citing one valid evidence ID could still fabricate unsafe claims | P0 | Hardened API only renders approved typed facts and does not call model | Provider output semantic verification and human QA for high-stakes decisions |
| RT-04 | User `sessionId` not bound to server-verified principal | P0 | Resolver-injected per-principal/product ephemeral memory with spoofed principal test | Authenticated gateway, persistent encrypted per-product session and erasure service |
| RT-05 | Revoked operator status could expose old OPEN after its own expiration | P0 | Latest signed state event supersedes older events; tombstone never resurrects old OPEN | Append-only versioning, out-of-order delivery tests, source epoch and durable replay |
| RT-06 | An Thới area status claimed for all canoes rather than one route | P0 | Route-exact operational source; area-only question refuses | Real route IDs/alias catalog and authority per route/operator |
| RT-07 | Two independent authorized publishers disagree | P0 | Conservative conflict quarantine when their current statuses differ | Authority priority/conflict-resolution governance by actual operators |
| RT-08 | Future operational plan inferred from current OPEN record | P0 | Future request is gated UNKNOWN | Separate prediction/booking engines with probabilistic labels |
| RT-09 | Raw tourist chats could be accidentally logged or treated as facts/training labels | P0 | Guest data excluded from test and signed knowledge backup; collection OFF | Notice, lawful basis, consent registry, masking, retention, export/erase and security review |
| RT-10 | JSONL SHA checksum mistaken for offsite disaster recovery | P1 | Explicit BACKUP LOCAL INTEGRITY ONLY; signatures rechecked on restore | Separate encrypted offsite backup, key management, restore on fresh VPS and RPO/RTO |
| RT-11 | Token-overlap retrieval and regex planner overfit a handful of test questions | P1 | V0.1 fail-closed exact operational scope, no unsupported model drafts | 100+ blinded local questions, semantic planner, multi-turn, expert QA |
| RT-12 | Provider switch can change factual quality and tool contracts even with adapter compatibility | P1 | Model is separated from knowledge and authority; no quality claim | Two real adapters on VPS and same evidence benchmark |
| RT-13 | Public repository leaked private user data, private signing keys or cloud credentials | P0 | Synthetic fixture generated keys only; no guest logs/real signing keys committed | Code/security scan, private evidence data store and secret-scoped deployment |
| RT-14 | Source signature over custom JS canonical JSON may not reproduce cross-platform | P1 | Versioned signature contract documented as V0.1 Node test only | Use audited standard JCS/RFC8785 or sign byte-exact publication envelope |

## Verdict

- Legacy V0 cannot be the production Brain implementation.
- V0.1 is **ARCHITECTURE CONTRACT CANDIDATE: READY FOR BOUNDED VPS G2 ENGINEERING AFTER OWNER/INDEPENDENT REVIEW**. This is not a product quality PASS.
- Live domain truth, legal data collection, real identity, provider failover, independent offsite restore and runtime load remain **UNVERIFIED**.
- No live deployment, OpenPQ Core modification, Cloudflare quota usage, or customer data collection performed.
