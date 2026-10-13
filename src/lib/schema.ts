// Generated from db/schema.sql (comments stripped). Idempotent: IF NOT EXISTS everywhere.
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS tokens (
  mint             TEXT PRIMARY KEY CHECK (length(mint) BETWEEN 32 AND 44),
  symbol           TEXT NOT NULL,
  name             TEXT NOT NULL,
  chain            TEXT NOT NULL DEFAULT 'solana',
  listed           BOOLEAN NOT NULL DEFAULT TRUE,
  status           TEXT,
  launch_platform  TEXT,
  era              TEXT,
  categories       TEXT[] NOT NULL DEFAULT '{}',
  legend_rank      INTEGER,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pairs (
  pair_address     TEXT PRIMARY KEY,
  mint             TEXT NOT NULL REFERENCES tokens(mint) ON DELETE CASCADE,
  dex_id           TEXT NOT NULL,
  quote_mint       TEXT,
  quote_symbol     TEXT,
  liquidity_usd    NUMERIC,
  pair_created_at  TIMESTAMPTZ,
  last_seen_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pairs_mint_idx ON pairs (mint);

CREATE TABLE IF NOT EXISTS market_snapshots (
  mint             TEXT PRIMARY KEY REFERENCES tokens(mint) ON DELETE CASCADE,
  payload          JSONB NOT NULL,
  source           TEXT NOT NULL,
  fetched_at       TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS vote_nonces (
  nonce            TEXT PRIMARY KEY,
  wallet           TEXT NOT NULL,
  mint             TEXT NOT NULL REFERENCES tokens(mint) ON DELETE CASCADE,
  message          TEXT NOT NULL,
  issued_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at       TIMESTAMPTZ NOT NULL,
  used_at          TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS vote_nonces_expires_idx ON vote_nonces (expires_at);

CREATE TABLE IF NOT EXISTS votes (
  id               BIGSERIAL PRIMARY KEY,
  mint             TEXT NOT NULL REFERENCES tokens(mint) ON DELETE CASCADE,
  wallet           TEXT NOT NULL,
  signature        TEXT NOT NULL UNIQUE,
  ip_hash          TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS votes_mint_time_idx ON votes (mint, created_at DESC);
CREATE INDEX IF NOT EXISTS votes_wallet_time_idx ON votes (wallet, created_at DESC);
CREATE INDEX IF NOT EXISTS votes_ip_time_idx ON votes (ip_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS votes_time_idx ON votes (created_at DESC);
`;
