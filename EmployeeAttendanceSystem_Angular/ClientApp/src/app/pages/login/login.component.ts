import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    password: ['', [Validators.required]]
  });

  submitting = false;
  errorMessage = '';
  showPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clockText = '--:--:--';
  dateText = '';
  private clockTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.tickClock();
    this.clockTimer = setInterval(() => this.tickClock(), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.clockTimer);
  }

  private tickClock(): void {
    const now = new Date();
    this.clockText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.dateText = now.toLocaleDateString([], { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage = '';
    this.submitting = true;
    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password).subscribe({
      next: (res) => {
        this.router.navigate([this.auth.homeRouteFor(res.user)]);
      },
      error: (err) => {
        if (err?.error?.errors) {
          const messages = Object.values(err.error.errors).flat() as string[];
          this.errorMessage = messages.join(' ');
        } else {
          this.errorMessage = err?.error?.message || 'Invalid email or password';
        }
        this.submitting = false;
      }
    });
  }

  fillDemo(role: 'hr' | 'employee'): void {
    this.errorMessage = '';
    if (role === 'hr') {
      this.form.setValue({ email: 'hr@demo.com', password: 'Admin@123' });
    } else {
      this.form.setValue({ email: 'employee@demo.com', password: 'Employee@123' });
    }
  }
}
