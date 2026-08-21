BEGIN;

-- ============================================================
-- Migration: 002_auth_hardening.sql
-- Untuk database yang sudah berjalan sebelum rilis 2.5.0-A2.
-- Aman dijalankan berulang kali.
-- ============================================================

-- audit_logs pernah dibuat dengan kolom "username", sedangkan server.js
-- menulis ke "admin_name".
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
         WHERE table_schema='public' AND table_name='audit_logs' AND column_name='username'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
         WHERE table_schema='public' AND table_name='audit_logs' AND column_name='admin_name'
    ) THEN
        ALTER TABLE public.audit_logs RENAME COLUMN username TO admin_name;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.activity_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL,
    group_name TEXT NOT NULL,
    channel_name TEXT NOT NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS activity_logs_created_idx
    ON public.activity_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS activity_logs_action_idx
    ON public.activity_logs (action, created_at DESC);

CREATE INDEX IF NOT EXISTS audit_logs_created_idx
    ON public.audit_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS auth_sessions_expires_idx
    ON public.auth_sessions (expires_at);

CREATE INDEX IF NOT EXISTS admin_sessions_expires_idx
    ON public.admin_sessions (expires_at);

COMMIT;
