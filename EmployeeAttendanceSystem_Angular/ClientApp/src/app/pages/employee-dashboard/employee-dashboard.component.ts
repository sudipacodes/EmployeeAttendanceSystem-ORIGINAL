import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../core/auth.service';
import { ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { Attendance, LeaveRequest, LeaveSummary } from '../../core/models';
import { StatusTagComponent } from '../../shared/status-tag/status-tag.component';
import { FmtDatePipe, FmtHoursPipe, FmtTimePipe } from '../../shared/format.pipes';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StatusTagComponent, FmtDatePipe, FmtHoursPipe, FmtTimePipe],
  templateUrl: './employee-dashboard.component.html'
})
export class EmployeeDashboardComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly user = this.auth.currentUser();
  readonly firstName = this.user?.name?.split(' ')[0] ?? '';
  readonly todayLabel = new Date().toLocaleDateString([], {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  today: Attendance | null = null;
  history: Attendance[] = [];
  leaves: LeaveRequest[] = [];
  summary: LeaveSummary = { monthlyAllowance: 0, approvedDays: 0, deductedDays: 0 };

  loading = true;
  checkingIn = false;
  checkingOut = false;

  readonly leaveForm = this.fb.nonNullable.group({
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    reason: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.loadAll();
  }

  get canCheckIn(): boolean {
    return !this.today?.checkIn;
  }
  get canCheckOut(): boolean {
    return !!this.today?.checkIn && !this.today?.checkOut;
  }

  loadAll(): void {
    this.loading = true;
    forkJoin({
      today: this.api.today(),
      history: this.api.history(),
      leaves: this.api.myLeaves(),
      summary: this.api.leaveSummary()
    }).subscribe({
      next: ({ today, history, leaves, summary }) => {
        this.today = today;
        this.history = history;
        this.leaves = leaves;
        this.summary = summary;
        this.loading = false;
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Could not load your attendance data');
        this.loading = false;
      }
    });
  }

  checkIn(): void {
    this.checkingIn = true;
    this.api.checkIn().subscribe({
      next: (res) => {
        this.toast.show(res.message, res.success === false ? 'error' : 'success');
        this.checkingIn = false;
        this.loadAll();
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Check-in failed');
        this.checkingIn = false;
      }
    });
  }

  checkOut(): void {
    this.checkingOut = true;
    this.api.checkOut().subscribe({
      next: (res) => {
        this.toast.show(res.message, res.success === false ? 'error' : 'success');
        this.checkingOut = false;
        this.loadAll();
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Check-out failed');
        this.checkingOut = false;
      }
    });
  }

  submitLeave(): void {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }
    const { startDate, endDate, reason } = this.leaveForm.getRawValue();
    if (new Date(endDate) < new Date(startDate)) {
      this.toast.error('End date cannot be before start date.');
      return;
    }

    this.api.applyLeave(startDate, endDate, reason).subscribe({
      next: () => {
        this.toast.success('Leave request submitted.');
        this.leaveForm.reset();
        this.loadAll();
      },
      error: (err) => this.toast.error(err?.error?.message || 'Could not submit leave request')
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
