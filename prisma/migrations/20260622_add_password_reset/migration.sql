-- Migration: add password column to users and password_resets table
-- Run with: `npx prisma migrate dev --name add-password-reset` (preferred)

-- Add optional password column to users
ALTER TABLE "users" ADD COLUMN "password" TEXT;

-- Create password_resets table
CREATE TABLE IF NOT EXISTS "password_resets" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL,
  "expiresAt" DATETIME NOT NULL,
  "used" BOOLEAN NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);
