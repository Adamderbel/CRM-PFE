import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Prospection, ProspectionCreateDto, ProspectionUpdateDto } from '../models/prospection.model';
import { normalizeStatutRow } from '../utils/normalize-api';

@Injectable({ providedIn: 'root' })
export class ProspectionService {
  private prospectionList = signal<Prospection[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);

  readonly prospections = this.prospectionList.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly errorMessage = this.error.asReadonly();
  readonly prospectionCount = computed(() => this.prospectionList().length);

  constructor(private http: HttpClient) { }

  getStatuts(): Observable<{ id: number; libelle: string }[]> {
    return this.http.get<unknown>(`${environment.apiUrl}/StatutProspection`).pipe(
      map((raw) => {
        const arr = Array.isArray(raw) ? raw : [];
        return arr.map((item) => normalizeStatutRow(item as Record<string, unknown>));
      })
    );
  }

  getTypesActions(): Observable<{ id: number; libelle: string }[]> {
    return this.http.get<unknown>(`${environment.apiUrl}/TypeActionProspection`).pipe(
      map((raw) => {
        const arr = Array.isArray(raw) ? raw : [];
        return arr.map((item) => normalizeStatutRow(item as Record<string, unknown>));
      })
    );
  }

  getAll(): Observable<Prospection[]> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<Prospection[]>(`${environment.apiUrl}/Prospection`).pipe(
      tap((data) => {
        this.prospectionList.set(data);
        this.loading.set(false);
      }),
      catchError((err) => {
        console.error('API Error:', err);
        this.loading.set(false);
        const backendMessage = err.error?.details || err.error?.message || err.message;
        const innerDetails = err.error?.innerDetails ? ` -> ${err.error.innerDetails}` : '';
        this.error.set('Erreur: ' + backendMessage + innerDetails);
        return throwError(() => err);
      })
    );
  }

  getById(id: string): Observable<Prospection> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<Prospection>(`${environment.apiUrl}/Prospection/${id}`).pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.loading.set(false);
        this.error.set('Erreur lors du chargement de la prospection.');
        return throwError(() => err);
      })
    );
  }

  getByProspectId(prospectId: string): Observable<Prospection[]> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<Prospection[]>(`${environment.apiUrl}/Prospection/prospect/${prospectId}`).pipe(
      tap((data) => {
        this.prospectionList.set(data);
        this.loading.set(false);
      }),
      catchError((err) => {
        console.error('API Error:', err);
        this.loading.set(false);
        this.error.set('Erreur lors du chargement des prospections du prospect.');
        return throwError(() => err);
      })
    );
  }

  create(prospection: ProspectionCreateDto): Observable<any> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.post<{ message?: string }>(`${environment.apiUrl}/Prospection`, prospection).pipe(
      tap(() => {
        this.loading.set(false);
        this.getAll().subscribe();
      }),
      catchError((err: HttpErrorResponse) => {
        this.loading.set(false);
        const build = err.headers?.get('X-CRM-Build');
        console.error('[ProspectionService.create] Erreur', err.status, 'X-CRM-Build=', build ?? '(absent = ancienne API ?)', err.error);
        let errorMsg = 'Erreur lors de la création de la prospection.';
        const b = err.error;
        if (typeof b === 'string') errorMsg = b;
        else if (b && typeof b === 'object') {
          errorMsg = (b as { detail?: string }).detail
            || (b as { message?: string }).message
            || JSON.stringify(b);
        }
        this.error.set(errorMsg);
        return throwError(() => err);
      })
    );
  }

  update(id: string, prospection: ProspectionUpdateDto): Observable<any> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.put(`${environment.apiUrl}/Prospection/${id}`, prospection, { responseType: 'text' }).pipe(
      tap(() => {
        this.loading.set(false);
        this.getAll().subscribe(); // Refresh list after update
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set('Erreur lors de la mise à jour de la prospection.');
        return throwError(() => err);
      })
    );
  }

  delete(id: string): Observable<any> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.delete(`${environment.apiUrl}/Prospection/${id}`, { responseType: 'text' }).pipe(
      tap(() => {
        this.loading.set(false);
        this.getAll().subscribe(); // Refresh list after deletion
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set('Erreur lors de la suppression de la prospection.');
        return throwError(() => err);
      })
    );
  }
}
