BEGIN;

-- ============================================================
-- Recording V1
-- Migration: 001_recording_v1.sql
-- Scope: user_group_channel, voice_messages, indexes/constraints
-- Does NOT modify existing V2 tables.
-- ============================================================

CREATE TABLE IF NOT EXISTS user_group_channel (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,
    group_name TEXT NOT NULL,
    channel_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by BIGINT NULL
        REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT uq_user_group_channel
        UNIQUE (user_id, group_name, channel_name)
);

CREATE TABLE IF NOT EXISTS voice_messages (
    id BIGSERIAL PRIMARY KEY,
    client_upload_id TEXT NOT NULL,
    sender_id BIGINT NULL
        REFERENCES users(id)
        ON DELETE SET NULL,
    group_name TEXT NOT NULL,
    channel_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    duration_ms BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    deleted_at TIMESTAMPTZ NULL,
    CONSTRAINT chk_voice_messages_size
        CHECK (size_bytes > 0),
    CONSTRAINT chk_voice_messages_duration
        CHECK (duration_ms > 0),
    CONSTRAINT uq_voice_messages_upload
        UNIQUE (sender_id, client_upload_id)
);

CREATE INDEX IF NOT EXISTS idx_user_group_channel_lookup
    ON user_group_channel (user_id, group_name, channel_name);

CREATE INDEX IF NOT EXISTS idx_voice_messages_channel
    ON voice_messages (group_name, channel_name, created_at);

CREATE INDEX IF NOT EXISTS idx_voice_messages_expires
    ON voice_messages (expires_at);

COMMIT;
