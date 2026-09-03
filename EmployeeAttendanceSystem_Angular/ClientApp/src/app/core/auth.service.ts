import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, AuthUser } from './models';

const TOKEN_KEY = 'ieToken';
const USER_KEY = 'ieUser';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Reactive current user, kept in sync with localStorage. Null when signed out. */
  readonly currentUser = signal<AuthUser | null>(this.readStoredUser());

  constructor(private http: HttpClient) {}

  private readStoredUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.token && !!this.currentUser();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/auth/login', { Email: email, Password: password })
      .pipe(tap((res) => this.saveSession(res)));
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/register', { Name: name, Email: email, Password: password });
  }

  private saveSession(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
  }

  /** Home route for whichever role is currently signed in. */
  homeRouteFor(user: AuthUser | null): string {
    if (!user) return '/login';
    return user.role === 'HR' ? '/hr' : '/employee';
  }
}
