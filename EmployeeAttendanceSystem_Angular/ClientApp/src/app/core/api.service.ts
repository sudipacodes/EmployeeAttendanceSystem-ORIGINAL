import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Attendance,
  AttendanceActionResult,
  EmployeeSummary,
  HrAttendanceRow,
  HrDashboardStats,
  LeaveRequest,
  LeaveSummary
} from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // ---- Attendance (employee) ----
  checkIn(): Observable<AttendanceActionResult> {
    return this.http.post<AttendanceActionResult>('/api/attendance/check-in', {});
  }
  checkOut(): Observable<AttendanceActionResult> {
    return this.http.post<AttendanceActionResult>('/api/attendance/check-out', {});
  }
  today(): Observable<Attendance | null> {
    return this.http.get<Attendance | null>('/api/attendance/today');
  }
  history(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>('/api/attendance/history');
  }

  // ---- Leave (employee) ----
  applyLeave(startDate: string, endDate: string, reason: string): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>('/api/leaves', { StartDate: startDate, EndDate: endDate, Reason: reason });
  }
  myLeaves(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>('/api/leaves');
  }
  leaveSummary(): Observable<LeaveSummary> {
    return this.http.get<LeaveSummary>('/api/leaves/summary');
  }

  // ---- Leave (HR) ----
  allLeaves(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>('/api/leaves/all');
  }
  decideLeave(id: number, status: 'Approved' | 'Rejected'): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(`/api/leaves/${id}/decision`, { Status: status });
  }

  // ---- HR ----
  hrDashboard(): Observable<HrDashboardStats> {
    return this.http.get<HrDashboardStats>('/api/hr/dashboard');
  }
  hrEmployees(): Observable<EmployeeSummary[]> {
    return this.http.get<EmployeeSummary[]>('/api/hr/employees');
  }
  hrAttendanceToday(): Observable<HrAttendanceRow[]> {
    return this.http.get<HrAttendanceRow[]>('/api/hr/attendance');
  }
}
