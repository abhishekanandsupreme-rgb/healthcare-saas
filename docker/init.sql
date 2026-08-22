-- Healthcare SaaS Backend Initial Schema
-- This file is automatically executed by PostgreSQL on container initialization.
-- Source: C:/Users/asus/healthcare-saas/backend/prisma/migrations/001_init.sql

BEGIN;

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id              VARCHAR(255) PRIMARY KEY,
  mrn             VARCHAR(255) NOT NULL UNIQUE,
  first_name      VARCHAR(255) NOT NULL,
  last_name       VARCHAR(255) NOT NULL,
  date_of_birth   DATE NOT NULL,
  gender          VARCHAR(50) NOT NULL,
  email           VARCHAR(255),
  phone           VARCHAR(50),
  address         TEXT,
  city            VARCHAR(255),
  state           VARCHAR(255),
  zip_code        VARCHAR(20),
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_patients_mrn ON patients(mrn);
CREATE INDEX idx_patients_last_name ON patients(last_name, first_name);

-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
  id           VARCHAR(255) PRIMARY KEY,
  first_name   VARCHAR(255) NOT NULL,
  last_name    VARCHAR(255) NOT NULL,
  email        VARCHAR(255) NOT NULL UNIQUE,
  npi          VARCHAR(255) NOT NULL UNIQUE,
  specialty    VARCHAR(255) NOT NULL,
  license      VARCHAR(255),
  department   VARCHAR(255),
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_providers_npi ON providers(npi);
CREATE INDEX idx_providers_last_name ON providers(last_name, first_name);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id          VARCHAR(255) PRIMARY KEY,
  patient_id  VARCHAR(255) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  provider_id VARCHAR(255) NOT NULL REFERENCES providers(id) ON DELETE RESTRICT,
  start_time  TIMESTAMP NOT NULL,
  end_time    TIMESTAMP NOT NULL,
  type        VARCHAR(255) NOT NULL,
  status      VARCHAR(255) NOT NULL DEFAULT 'scheduled',
  reason      TEXT,
  notes       TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_provider_id ON appointments(provider_id);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id           VARCHAR(255) PRIMARY KEY,
  actor_id     VARCHAR(255) NOT NULL,
  actor_type   VARCHAR(255) NOT NULL,
  actor_name   VARCHAR(255) NOT NULL,
  patient_id   VARCHAR(255) REFERENCES patients(id) ON DELETE SET NULL,
  resource_type VARCHAR(255) NOT NULL,
  resource_id  VARCHAR(255),
  action       VARCHAR(255) NOT NULL,
  ip_address   VARCHAR(255),
  user_agent   TEXT,
  details      TEXT,
  timestamp    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_patient_id ON audit_logs(patient_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

COMMIT;
