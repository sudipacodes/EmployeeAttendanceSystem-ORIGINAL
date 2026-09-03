import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../core/auth.service';
import { ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { EmployeeSummary, HrAttendanceRow, HrDashboardStats, LeaveRequest } from '../../core/models';
import { StatusTagComponent } from '../../shared/status-tag/status-tag.component';
import { FmtDatePipe, FmtHoursPipe, FmtTimePipe } from '../../shared/format.pipes';

type LeaveFilter = 'Pending' | 'Approved' | 'Rejected' | 'All';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [CommonModule, StatusTagComponent, FmtDatePipe, FmtHoursPipe, FmtTimePipe],
  templateUrl: './hr-dashboard.component.html'
})
export class HrDashboardComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly user = this.auth.currentUser();
  readonly todayLabel = new Date().toLocaleDateString([], {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  stats: HrDashboardStats = { totalEmployees: 0, presentToday: 0, absentToday: 0, onLeaveToday: 0 };
  employees: EmployeeSummary[] = [];
  attendance: HrAttendanceRow[] = [];

  private allLeaves: LeaveRequest[] = [];
  visibleLeaves: LeaveRequest[] = [];
  leaveFilter: LeaveFilter = 'Pending';
  readonly filters: LeaveFilter[] = ['Pending', 'Approved', 'Rejected', 'All'];

  loading = true;

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    forkJoin({
      stats: this.api.hrDashboard(),
      employees: this.api.hrEmployees(),
      attendance: this.api.hrAttendanceToday(),
      leaves: this.api.allLeaves()
    }).subscribe({
      next: ({ stats, employees, attendance, leaves }) => {
        this.stats = stats;
        this.employees = employees;
        this.attendance = attendance;
        this.allLeaves = leaves;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Could not load HR data');
        this.loading = false;
      }
    });
  }

  setFilter(filter: LeaveFilter): void {
    this.leaveFilter = filter;
    this.applyFilter();
  }

  private applyFilter(): void {
    this.visibleLeaves =
      this.leaveFilter === 'All' ? this.allLeaves : this.allLeaves.filter((l) => l.status === this.leaveFilter);
  }

  decide(id: number, status: 'Approved' | 'Rejected'): void {
    this.api.decideLeave(id, status).subscribe({
      next: () => {
        this.toast.success(`Leave request ${status.toLowerCase()}.`);
        this.loadAll();
      },
      error: (err) => this.toast.error(err?.error?.message || 'Could not update the leave request')
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
