-- RESEARCH ONLY / DO NOT EXECUTE ON ANY PRODUCTION DB.
-- A schema boundary sketch for G2 VPS migration review; not a ready migration.
-- Row-level security, key custody, encryption, FK, retention, indexes and migrations
-- MUST be specified and tested by implementation team before using real data.
CREATE TABLE source_publishers (
  publisher_id text NOT NULL,
  dataset_id text NOT NULL,
  key_version text NOT NULL,
  authorized_capabilities jsonb NOT NULL,
  public_key_pem text NOT NULL,
  status text NOT NULL CHECK(status IN ('ACTIVE','REVOKED')),
  PRIMARY KEY (publisher_id,dataset_id,key_version)
);
CREATE TABLE evidence_events (
  event_id text PRIMARY KEY,
  source_publisher_id text NOT NULL,
  source_dataset_id text NOT NULL,
  source_key_version text NOT NULL,
  entity_id text NOT NULL,
  domain text NOT NULL,
  predicate text NOT NULL,
  scope_type text NOT NULL,
  scope_id text NOT NULL,
  event_value text NOT NULL,
  event_status text NOT NULL CHECK(event_status IN ('VERIFIED','REVOKED','DISPUTED')),
  observed_at timestamptz NOT NULL,
  valid_until timestamptz NOT NULL,
  event_payload jsonb NOT NULL,
  verified_receipt bytea NOT NULL,
  ingested_at timestamptz NOT NULL DEFAULT now(),
  CHECK(valid_until > observed_at),
  FOREIGN KEY (source_publisher_id,source_dataset_id,source_key_version)
    REFERENCES source_publishers(publisher_id,dataset_id,key_version)
);
-- Derived views and token/vector indexes are disposable; evidence_events is append-only.
-- Separate restricted schema for consent, private per-product conversation, deletion
-- tombstones and ephemeral user data; DO NOT reuse the evidence_events permission role.
-- guest_signal_aggregate may only expose thresholded cohorts, never per-user rows.
