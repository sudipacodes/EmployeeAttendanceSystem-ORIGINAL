# Employee Attendance Management System
### Inner Eye Consultancy Services LLP &middot; Technical Assessment Submission

An enterprise-grade workforce attendance and leave ledger built with **ASP.NET Core 8 Web API**, **Angular 17 (Standalone)**, and **PostgreSQL**.

---

## 📄 Submission Files

* **Technical Documentation**: [PROJECT_DOCUMENTATION.md](file:///c:/Users/Sudipa/Desktop/EmployeeAttendanceSystem_Angular/PROJECT_DOCUMENTATION.md) (Architecture, Business Logic, Security, API Spec, ER Diagrams)
* **Database Setup & Schema Script**: [database_scripts.sql](file:///c:/Users/Sudipa/Desktop/EmployeeAttendanceSystem_Angular/database_scripts.sql) (PostgreSQL DDL, Constraints, Indexes, and Seed Data)
* **Backend Source Code**: [EmployeeAttendanceSystem.csproj](file:///c:/Users/Sudipa/Desktop/EmployeeAttendanceSystem_Angular/EmployeeAttendanceSystem.csproj) (Controllers, Services, DTOs, EF Core Data Models)
* **Frontend Source Code**: [ClientApp/](file:///c:/Users/Sudipa/Desktop/EmployeeAttendanceSystem_Angular/ClientApp) (Angular 17 Standalone Components, Reactive Forms, CSS Grid)

---

## 🚀 Quick Start Instructions

### 1. Database Setup
* The database engine is configured for **PostgreSQL** running locally on port `5433` (Service: `postgresql-x64-18`).
* Connection string in `appsettings.json`:
  ```json
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5433;Database=employee;Username=postgres;Password=082005"
  }
  ```
* Schema and tables are created automatically on API startup, or you can run `database_scripts.sql` directly in pgAdmin/psql.

### 2. Start the Backend API
```bash
dotnet restore
dotnet run
```
* **API URL**: `http://localhost:5080`
* **Swagger Documentation**: `http://localhost:5080/swagger`

### 3. Start the Angular Frontend
In a second terminal:
```bash
cd ClientApp
npm install
npm start
```
* **Frontend Application**: `http://localhost:4200`

---

## 🔑 Demo Access Credentials

Both roles have **1-click auto-fill buttons** on the sign-in page:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **HR Admin** | `hr@demo.com` | `Admin@123` | Full administrative dashboard, workforce metrics, employee directory, leave decision approvals/rejections |
| **Employee** | `employee@demo.com` | `Employee@123` | Daily attendance check-in/out, live telemetry, working hours calculation, leave requests, leave deduction summary |

---

## 📋 Features Overview

1. **Employee Login & Registration**: Strict Regex and length validations on Name, Email, and Password with instant field-level feedback and password visibility eye toggles.
2. **Attendance Check-In & Check-Out**: Server-side timestamp validation prevents client-side clock tampering.
3. **Working Hours Calculation**: Automatically computes exact decimal working hours upon check-out.
4. **Attendance Status Tracking**:
   - `Present`: On-time check-in (at or before 09:30 AM).
   - `Late`: Check-in after 09:30 AM.
   - `Half Day`: Working hours strictly less than 4.0 hours.
5. **Leave Deduction Calculation**: 2-day monthly free allowance; automated deduction tracking for excess days.
6. **HR Dashboard**: Real-time workforce counters, company directory, live attendance feed, and leave approval workflows.
7. **Employee Dashboard**: Biometric-style clock, attendance actions, 90-day history table, and leave application ledger.
