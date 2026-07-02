-- Goff Welding portal schema (Neon Postgres)
-- Run via: node scripts/goff-db-init.mjs  (reads GOFF_DATABASE_URL or DATABASE_URL)
-- Safe to re-run: everything is IF NOT EXISTS.

-- ── Review feedback (live now) ────────────────────────────────────────────
-- Austin/Goff team comments left from inside the portal review build.
CREATE TABLE IF NOT EXISTS goff_feedback (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  author      TEXT NOT NULL DEFAULT 'Goff reviewer',
  section     TEXT NOT NULL,            -- portal section id (course, policies, safety…)
  context     TEXT NOT NULL DEFAULT '', -- open course/slide when the comment was left
  comment     TEXT NOT NULL,
  url         TEXT NOT NULL DEFAULT '',
  user_agent  TEXT NOT NULL DEFAULT '',
  resolved    BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS goff_feedback_created_idx ON goff_feedback (created_at DESC);

-- ── Training/tracking tables (schema ready; wiring lands after Austin's
--    Monday review locks the open decisions: BBSI signature overlap, quiz
--    reinstatement, role scoping, form routing) ─────────────────────────────

CREATE TABLE IF NOT EXISTS goff_employees (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL DEFAULT '',
  email       TEXT UNIQUE,
  phone       TEXT,
  role        TEXT,                     -- maps to KRA role id
  supervisor  TEXT,
  start_date  DATE,
  status      TEXT NOT NULL DEFAULT 'onboarding',  -- onboarding | active | inactive
  source      TEXT NOT NULL DEFAULT 'manual'       -- recruiting-handoff | manual
);

-- Every knowledge-check answer, including wrong attempts — this is the
-- "first-try vs click-click-click" signal Austin asked for.
CREATE TABLE IF NOT EXISTS goff_kc_attempts (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  employee_id UUID REFERENCES goff_employees(id),
  device_id   TEXT NOT NULL DEFAULT '',  -- pre-auth fallback identity
  kc_id       TEXT NOT NULL,             -- e.g. kc14, skc-loto-0
  picked      SMALLINT NOT NULL,
  correct     BOOLEAN NOT NULL,
  attempt_no  SMALLINT NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS goff_kc_attempts_emp_idx ON goff_kc_attempts (employee_id, kc_id);

CREATE TABLE IF NOT EXISTS goff_course_completions (
  id          BIGSERIAL PRIMARY KEY,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  employee_id UUID REFERENCES goff_employees(id),
  device_id   TEXT NOT NULL DEFAULT '',
  course_set  TEXT NOT NULL,            -- orientation | policy | safety | basics
  course_id   TEXT NOT NULL,
  UNIQUE (employee_id, course_set, course_id)
);

-- Signatures/acknowledgments record WHICH VERSION of a document was signed.
CREATE TABLE IF NOT EXISTS goff_acknowledgments (
  id          BIGSERIAL PRIMARY KEY,
  signed_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  employee_id UUID REFERENCES goff_employees(id),
  device_id   TEXT NOT NULL DEFAULT '',
  doc_id      TEXT NOT NULL,            -- policy course id or 'iipp-safety'
  doc_version TEXT NOT NULL DEFAULT '', -- content hash / revision label
  signed_name TEXT NOT NULL,
  kind        TEXT NOT NULL DEFAULT 'sign'  -- sign | acknowledge
);

CREATE TABLE IF NOT EXISTS goff_milestones (
  id          BIGSERIAL PRIMARY KEY,
  employee_id UUID REFERENCES goff_employees(id),
  milestone   TEXT NOT NULL,            -- day-1 | 30-day | 60-day-insurance | 90-day | 6-month | 1-year
  due_date    DATE,
  completed_at TIMESTAMPTZ,
  owner       TEXT,
  notes       TEXT NOT NULL DEFAULT ''
);

-- ── In-portal form submissions (damage/incident/near-miss live first) ──────
CREATE TABLE IF NOT EXISTS goff_form_submissions (
  id            BIGSERIAL PRIMARY KEY,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  form_id       TEXT NOT NULL,           -- damage | incident | nearmiss | …
  submitted_name TEXT NOT NULL DEFAULT '', -- empty = anonymous (allowed on near-miss)
  fields        JSONB NOT NULL,
  status        TEXT NOT NULL DEFAULT 'new'  -- new | reviewed | closed
);
CREATE INDEX IF NOT EXISTS goff_form_submissions_idx ON goff_form_submissions (form_id, created_at DESC);

-- ── Recruiting: candidates (source of truth for the ATS pipeline) ─────────
CREATE TABLE IF NOT EXISTS goff_candidates (
  id          BIGINT PRIMARY KEY,        -- client-generated (Date.now()) to match the app
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL DEFAULT '',
  role        TEXT NOT NULL DEFAULT '',
  source      TEXT NOT NULL DEFAULT '',
  path        TEXT NOT NULL DEFAULT 'Other path',
  stage       TEXT NOT NULL DEFAULT 'Application received',
  owner       TEXT NOT NULL DEFAULT 'Quinton',
  priority    TEXT NOT NULL DEFAULT 'Normal',
  email       TEXT NOT NULL DEFAULT '',
  phone       TEXT NOT NULL DEFAULT '',
  location    TEXT NOT NULL DEFAULT '',
  pinned      BOOLEAN NOT NULL DEFAULT FALSE,
  stage_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  data        JSONB NOT NULL DEFAULT '{}'::jsonb   -- summary, concerns, evidence, clearance, offer, timeline, notes, due
);
CREATE INDEX IF NOT EXISTS goff_candidates_stage_idx ON goff_candidates (stage, stage_updated_at DESC);
