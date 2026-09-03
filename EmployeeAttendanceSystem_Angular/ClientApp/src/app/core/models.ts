export type Role = 'Employee' | 'HR';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface Attendance {
  id: number;
  userId: number;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  workingHours: number | null;
  status: 'Present' | 'Late' | 'Half Day' | string;
}

export interface AttendanceActionResult {
  success: boolean;
  message: string;
  attendance?: Attendance;
}

export interface LeaveRequest {
  id: number;
  userId: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | string;
  createdAt: string;
  days: number;
  user?: { id: number; name: string; email: string };
}

export interface LeaveSummary {
  monthlyAllowance: number;
  approvedDays: number;
  deductedDays: number;
}

export interface HrDashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
}

export interface EmployeeSummary {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface HrAttendanceRow {
  id: number;
  employee: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  workingHours: number | null;
  status: string;
}
