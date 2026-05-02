import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClientCerm } from '../models/client-cerm.model';

@Injectable({ providedIn: 'root' })
export class ClientCermService {
  private clientList = signal<ClientCerm[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);

  readonly clients = this.clientList.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly errorMessage = this.error.asReadonly();

  constructor(private http: HttpClient) { }

  recherche(filters: { refClient?: string; nom?: string; limit?: number } = {}): Observable<ClientCerm[]> {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    if (filters.refClient) params = params.set('refClient', filters.refClient);
    if (filters.nom) params = params.set('nom', filters.nom);
    if (filters.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<ClientCerm[]>(`${environment.apiUrl}/ClientCerm/recherche`, { params }).pipe(
      tap((data) => {
        this.clientList.set(data);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set('Erreur lors du chargement des clients.');
        return throwError(() => err);
      })
    );
  }

  getById(id: number): Observable<ClientCerm> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<ClientCerm>(`${environment.apiUrl}/ClientCerm/${id}`).pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.loading.set(false);
        this.error.set('Erreur lors du chargement du client.');
        return throwError(() => err);
      })
    );
  }

  clearError(): void {
    this.error.set(null);
  }
}
