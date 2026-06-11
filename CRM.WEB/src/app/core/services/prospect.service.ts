import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Prospect, CreateProspectRequest, UpdateProspectRequest, DomaineActivite } from '../models/prospect.model';
import { ModeContact } from '../models/mode-contact.model';
import { normalizeDomaineRow, normalizeModeContactRow, normalizeProspectRow } from '../utils/normalize-api';

@Injectable({ providedIn: 'root' })
export class ProspectService {
  private prospectList = signal<Prospect[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);

  readonly prospects = this.prospectList.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly errorMessage = this.error.asReadonly();
  readonly prospectCount = computed(() => this.prospectList().length);

  constructor(private http: HttpClient) { }

  getAll(): Observable<Prospect[]> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<unknown>(`${environment.apiUrl}/Prospect`).pipe(
      map((raw) => {
        const arr = Array.isArray(raw) ? raw : [];
        return arr.map((item) => normalizeProspectRow(item as Record<string, unknown>)) as Prospect[];
      }),
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
    return this.http.get<unknown>(`${environment.apiUrl}/Prospect/${id}`).pipe(
      map((raw) => normalizeProspectRow(raw as Record<string, unknown>) as Prospect),
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.loading.set(false);
        this.error.set('Erreur lors du chargement du prospect.');
        return throwError(() => err);
      })
    );
  }

  getByClientCermId(clientCermId: number): Observable<Prospect> {
    return this.http.get<Prospect>(`${environment.apiUrl}/Prospect/client/${clientCermId}`);
  }

  getNextCode(): Observable<{ code: string }> {
    return this.http.get<{ code: string }>(`${environment.apiUrl}/Prospect/get-next-code`);
  }

  create(prospect: CreateProspectRequest): Observable<string> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.post(`${environment.apiUrl}/Prospect`, prospect, { responseType: 'text' }).pipe(
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
    return this.http.put<void>(`${environment.apiUrl}/Prospect/${id}`, prospect).pipe(
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
    return this.http.delete<void>(`${environment.apiUrl}/Prospect/${id}`).pipe(
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
    return this.http.get<unknown>(`${environment.apiUrl}/DomaineActivite`).pipe(
      map((raw) => {
        const arr = Array.isArray(raw) ? raw : [];
        return arr.map((item) => normalizeDomaineRow(item as Record<string, unknown>)) as DomaineActivite[];
      }),
      catchError((err) => {
        this.error.set('Erreur lors du chargement des domaines d\'activité.');
        return throwError(() => err);
      })
    );
  }

  getModeContacts(): Observable<ModeContact[]> {
    return this.http.get<unknown>(`${environment.apiUrl}/ModeContact`).pipe(
      map((raw) => {
        const arr = Array.isArray(raw) ? raw : [];
        return arr.map((item) => normalizeModeContactRow(item as Record<string, unknown>)) as ModeContact[];
      }),
      catchError((err) => {
        this.error.set(null);
        return of([
          { id: 1, libelle: 'Telephone' },
          { id: 2, libelle: 'Email' },
          { id: 3, libelle: 'Visite' },
          { id: 4, libelle: 'Salon' },
        ]);
      })
    );
  }

  clearError(): void {
    this.error.set(null);
  }
}
