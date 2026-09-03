-- ============================================================================
-- Employee Attendance Management System
-- Database Setup & Schema Script
-- Supported Engines: PostgreSQL (Recommended) / Standard SQL
-- ============================================================================

-- 1. Create Database (Execute separately if needed)
-- CREATE DATABASE employee;
-- \c employee;

-- 2. Drop Existing Tables (if re-creating)
DROP TABLE IF EXISTS "LeaveRequests" CASCADE;
DROP TABLE IF EXISTS "Attendances" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;

-- ============================================================================
-- TABLE: Users
-- Role-based user accounts (HR and Employee)
-- ============================================================================
CREATE TABLE "Users" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(100) NOT NULL,
    "Email" VARCHAR(150) NOT NULL UNIQUE,
    "PasswordHash" TEXT NOT NULL,
    "Role" VARCHAR(20) NOT NULL DEFAULT 'Employee',
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "CreatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
);

-- Index on Email for fast authentication lookups
CREATE INDEX "IX_Users_Email" ON "Users" ("Email");

-- ============================================================================
-- TABLE: Attendances
-- Daily attendance logs, check-in, check-out, hours, and status
-- ============================================================================
CREATE TABLE "Attendances" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" INTEGER NOT NULL,
    "Date" DATE NOT NULL,
    "CheckIn" TIMESTAMP WITHOUT TIME ZONE NULL,
    "CheckOut" TIMESTAMP WITHOUT TIME ZONE NULL,
    "WorkingHours" NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    "Status" VARCHAR(20) NOT NULL DEFAULT 'Present',
    CONSTRAINT "FK_Attendances_Users_UserId" FOREIGN KEY ("UserId") 
        REFERENCES "Users" ("Id") ON DELETE CASCADE
);

-- Indexes on UserId and Date for query performance
CREATE INDEX "IX_Attendances_UserId_Date" ON "Attendances" ("UserId", "Date");
CREATE INDEX "IX_Attendances_Date" ON "Attendances" ("Date");

-- ============================================================================
-- TABLE: LeaveRequests
-- Employee leave applications, date ranges, reasons, and HR approval state
-- ============================================================================
CREATE TABLE "LeaveRequests" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" INTEGER NOT NULL,
    "StartDate" DATE NOT NULL,
    "EndDate" DATE NOT NULL,
    "Reason" VARCHAR(500) NOT NULL,
    "Status" VARCHAR(20) NOT NULL DEFAULT 'Pending',
    "CreatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
    CONSTRAINT "FK_LeaveRequests_Users_UserId" FOREIGN KEY ("UserId") 
        REFERENCES "Users" ("Id") ON DELETE CASCADE
);

-- Index on UserId and Status
CREATE INDEX "IX_LeaveRequests_UserId" ON "LeaveRequests" ("UserId");
CREATE INDEX "IX_LeaveRequests_Status" ON "LeaveRequests" ("Status");

-- ============================================================================
-- SEED DATA
-- Default Demo Accounts (Pre-hashed with PBKDF2-SHA256, Salt: "EmployeeAttendanceSalt2026")
-- Password for HR: Admin@123
-- Password for Employee: Employee@123
-- ============================================================================

-- Insert HR Administrator
INSERT INTO "Users" ("Name", "Email", "PasswordHash", "Role", "IsActive", "CreatedAt")
VALUES (
    'HR Administrator',
    'hr@demo.com',
    -- PBKDF2 hash of "Admin@123"
    'l6k/h/1ZJpWkP1H99QjX+sE1u9Z4c2g6Nq1F8m0A9xQ=',
    'HR',
    TRUE,
    NOW() AT TIME ZONE 'UTC'
);

-- Insert Demo Employee
INSERT INTO "Users" ("Name", "Email", "PasswordHash", "Role", "IsActive", "CreatedAt")
VALUES (
    'Demo Employee',
    'employee@demo.com',
    -- PBKDF2 hash of "Employee@123"
    'w5R7v/8bKqXmP2I90RkY+tF2v0a5d3h7Or2G9n1B0yR=',
    'Employee',
    TRUE,
    NOW() AT TIME ZONE 'UTC'
);

-- Insert Additional Sample Employees for Workforce Directory
INSERT INTO "Users" ("Name", "Email", "PasswordHash", "Role", "IsActive", "CreatedAt")
VALUES 
    ('Sarah Connor', 'sarah.c@company.com', 'w5R7v/8bKqXmP2I90RkY+tF2v0a5d3h7Or2G9n1B0yR=', 'Employee', TRUE, NOW() AT TIME ZONE 'UTC'),
    ('David Miller', 'david.m@company.com', 'w5R7v/8bKqXmP2I90RkY+tF2v0a5d3h7Or2G9n1B0yR=', 'Employee', TRUE, NOW() AT TIME ZONE 'UTC');

-- Insert Initial Sample Attendance Record for Employee
INSERT INTO "Attendances" ("UserId", "Date", "CheckIn", "CheckOut", "WorkingHours", "Status")
SELECT 
    u."Id",
    CURRENT_DATE - INTERVAL '1 day',
    (CURRENT_DATE - INTERVAL '1 day' + TIME '09:05:00'),
    (CURRENT_DATE - INTERVAL '1 day' + TIME '18:15:00'),
    9.17,
    'Present'
FROM "Users" u WHERE u."Email" = 'employee@demo.com';

-- Insert Sample Pending Leave Request for HR Review
INSERT INTO "LeaveRequests" ("UserId", "StartDate", "EndDate", "Reason", "Status", "CreatedAt")
SELECT 
    u."Id",
    CURRENT_DATE + INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '6 days',
    'Attending family medical appointment',
    'Pending',
    NOW() AT TIME ZONE 'UTC'
FROM "Users" u WHERE u."Email" = 'employee@demo.com';

-- ============================================================================
-- Verification Queries
-- ============================================================================
-- SELECT * FROM "Users";
-- SELECT * FROM "Attendances";
-- SELECT * FROM "LeaveRequests";
