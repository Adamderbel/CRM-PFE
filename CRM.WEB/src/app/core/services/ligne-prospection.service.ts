import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LigneProspection, LigneProspectionCreateDto, LigneProspectionUpdateDto } from '../models/ligne-prospection.model';

@Injectable({
  providedIn: 'root'
})
export class LigneProspectionService {
  private apiUrl = `${environment.apiUrl}/LigneProspection`;

  // State
  ligneProspections = signal<LigneProspection[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor(private http: HttpClient) { }

  getFamilleProduits(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/FamilleProduit`);
  }

  getSocietes(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Societe`);
  }

  getStatuts(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/StatutProspection`);
  }

  getSupportProduits(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/SupportProduit`);
  }

  getAll(): Observable<LigneProspection[]> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    return this.http.get<LigneProspection[]>(this.apiUrl).pipe(
      tap((data) => {
        this.ligneProspections.set(data);
        this.isLoading.set(false);
      }),
      catchError((error) => this.handleError(error))
    );
  }

  getById(id: string): Observable<LigneProspection> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    return this.http.get<LigneProspection>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.isLoading.set(false)),
      catchError((error) => this.handleError(error))
    );
  }

  create(dto: LigneProspectionCreateDto): Observable<any> { // API returns string message
    this.isLoading.set(true);
    this.errorMessage.set(null);

    return this.http.post(this.apiUrl, dto, { responseType: 'text' }).pipe(
      tap(() => {
        this.isLoading.set(false);
        this.getAll().subscribe(); // Refresh the list
      }),
      catchError((error) => this.handleError(error))
    );
  }

  update(id: string, dto: LigneProspectionUpdateDto): Observable<any> { // API returns string message
    this.isLoading.set(true);
    this.errorMessage.set(null);

    return this.http.put(`${this.apiUrl}/${id}`, dto, { responseType: 'text' }).pipe(
      tap(() => {
        this.isLoading.set(false);
        this.getAll().subscribe(); // Refresh the list
      }),
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.isLoading.set(false);
    let errorMsg = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMsg = `Erreur: ${error.error.message}`;
    } else {
      errorMsg = `Code: ${error.status}, Message: ${error.error || error.message}`;
    }
    this.errorMessage.set(errorMsg);
    return throwError(() => new Error(errorMsg));
  }
}
