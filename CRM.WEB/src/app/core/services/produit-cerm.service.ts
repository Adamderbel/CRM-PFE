import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProduitCerm } from '../models/produit-cerm.model';

@Injectable({ providedIn: 'root' })
export class ProduitCermService {
  private produitList = signal<ProduitCerm[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);

  readonly produits = this.produitList.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly errorMessage = this.error.asReadonly();

  constructor(private http: HttpClient) {}

  getAll(filters: { refArt?: string; designation?: string; limit?: number } = {}): Observable<ProduitCerm[]> {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    if (filters.refArt) params = params.set('refArt', filters.refArt);
    if (filters.designation) params = params.set('designation', filters.designation);
    if (filters.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<ProduitCerm[]>(`${environment.apiUrl}/api/ProduitCerm`, { params }).pipe(
      tap((data) => {
        this.produitList.set(data);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set('Erreur lors du chargement des produits.');
        return throwError(() => err);
      })
    );
  }

  getById(id: number): Observable<ProduitCerm> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<ProduitCerm>(`${environment.apiUrl}/api/ProduitCerm/${id}`).pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.loading.set(false);
        this.error.set('Erreur lors du chargement du produit.');
        return throwError(() => err);
      })
    );
  }

  clearError(): void {
    this.error.set(null);
  }
}
