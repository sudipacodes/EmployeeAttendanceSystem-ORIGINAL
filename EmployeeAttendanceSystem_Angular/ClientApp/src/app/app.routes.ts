import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'employee',
    canActivate: [authGuard('Employee')],
    loadComponent: () =>
      import('./pages/employee-dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent)
  },
  {
    path: 'hr',
    canActivate: [authGuard('HR')],
    loadComponent: () => import('./pages/hr-dashboard/hr-dashboard.component').then(m => m.HrDashboardComponent)
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' }
];
