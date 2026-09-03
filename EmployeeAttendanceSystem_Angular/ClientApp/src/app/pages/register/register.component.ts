import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(/^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/)
      ]
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(150)
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/)
      ]
    ]
  });

  submitting = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage = '';
    this.successMessage = '';
    this.submitting = true;
    const { name, email, password } = this.form.getRawValue();

    this.auth.register(name, email, password).subscribe({
      next: () => {
        this.successMessage = 'Account created. Redirecting to sign in…';
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err) => {
        if (err?.error?.errors) {
          const messages = Object.values(err.error.errors).flat() as string[];
          this.errorMessage = messages.join(' ');
        } else {
          this.errorMessage = err?.error?.message || 'Registration failed';
        }
        this.submitting = false;
      }
    });
  }
}
