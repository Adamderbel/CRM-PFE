import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Prospect, CreateProspectRequest, UpdateProspectRequest, DomaineActivite } from '../models/prospect.model';

@Injectable({ providedIn: 'root' })
export class ProspectService {
  private prospectList = signal<Prospect[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);

  readonly prospects = this.prospectList.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly errorMessage = this.error.asReadonly();
  readonly prospectCount = computed(() => this.prospectList().length);

  constructor(private http: HttpClient) {}

  getAll(): Observable<Prospect[]> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<Prospect[]>(`${environment.apiUrl}/api/prospect`).pipe(
      tap((data) => {
        this.prospectList.set(data);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set('Erreur lors du chargement des prospects.');
        return throwError(() => err);
      })
    );
  }

  getById(id: string): Observable<Prospect> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<Prospect>(`${environment.apiUrl}/api/prospect/${id}`).pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.loading.set(false);
        this.error.set('Erreur lors du chargement du prospect.');
        return throwError(() => err);
      })
    );
  }

  create(prospect: CreateProspectRequest): Observable<string> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.post(`${environment.apiUrl}/api/prospect`, prospect, { responseType: 'text' }).pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.loading.set(false);
        this.error.set('Erreur lors de la création du prospect.');
        return throwError(() => err);
      })
    );
  }

  update(id: string, prospect: UpdateProspectRequest): Observable<void> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.put<void>(`${environment.apiUrl}/api/prospect/${id}`, prospect).pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.loading.set(false);
        this.error.set('Erreur lors de la mise à jour du prospect.');
        return throwError(() => err);
      })
    );
  }

  delete(id: string): Observable<void> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.delete<void>(`${environment.apiUrl}/api/prospect/${id}`).pipe(
      tap(() => {
        this.loading.set(false);
        this.prospectList.update((list) => list.filter((p) => p.id !== id));
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set('Erreur lors de la suppression du prospect.');
        return throwError(() => err);
      })
    );
  }

  getDomainesActivite(): Observable<DomaineActivite[]> {
    return this.http.get<DomaineActivite[]>(`${environment.apiUrl}/api/domaineactivite`).pipe(
      catchError((err) => {
        this.error.set('Erreur lors du chargement des domaines d\'activité.');
        return throwError(() => err);
      })
    );
  }

  clearError(): void {
    this.error.set(null);
  }
}
