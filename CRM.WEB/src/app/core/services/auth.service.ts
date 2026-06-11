import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser, LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.model';

const TOKEN_KEY = 'crm_token';
const USER_KEY = 'crm_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<AuthUser | null>(this.loadUser());
  private token = signal<string | null>(this.loadToken());

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this.token());
  readonly userFullName = computed(() => {
    const u = this.currentUser();
    return u ? `${u.prenom} ${u.nom}` : '';
  });
  readonly userRoles = computed(() => this.currentUser()?.roles ?? []);

  constructor(private http: HttpClient, private router: Router) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/login`, request).pipe(
      tap((res) => {
        this.token.set(res.token);
        this.currentUser.set(res.user);
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  register(request: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/users`, request);
  }

  logout(): void {
    this.token.set(null);
    this.currentUser.set(null); 
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.token();
  }

  /** Identifiant du sujet JWT (`sub`), plus fiable que le profil localStorage si celui-ci est obsolète. */
  getUserIdFromAccessToken(): string | null {
    const t = this.token();
    if (!t) return null;
    const parts = t.split('.');
    if (parts.length < 2) return null;
    try {
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      const json = JSON.parse(atob(padded)) as Record<string, unknown>;
      const sub = json['sub'];
      return typeof sub === 'string' ? sub : null;
    } catch {
      return null;
    }
  }

  hasRole(role: string): boolean {
    return this.userRoles().some((r) => r.toUpperCase() === role.toUpperCase());
  }

  private loadToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private loadUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
