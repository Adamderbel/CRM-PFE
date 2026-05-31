import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Commande, CommandeDetailDto, CommandeLigne } from '../models/commande.model';

@Injectable({ providedIn: 'root' })
export class CommandeService {
  private commandeList = signal<Commande[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);

  readonly commandes = this.commandeList.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly errorMessage = this.error.asReadonly();

  constructor(private http: HttpClient) { }

  getByClient(clientId: string): Observable<Commande[]> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<Commande[]>(`${environment.apiUrl}/commandes/client/${clientId}`).pipe(
      tap((data) => {
        this.commandeList.set(data);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set('Erreur lors du chargement des commandes client.');
        return throwError(() => err);
      })
    );
  }

  getDetails(refCommande: string): Observable<CommandeDetailDto> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<CommandeDetailDto>(`${environment.apiUrl}/commandes/${refCommande}/details`).pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.loading.set(false);
        this.error.set('Erreur lors du chargement des détails de la commande.');
        return throwError(() => err);
      })
    );
  }

  getLignes(refCommande: string): Observable<CommandeLigne[]> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<CommandeLigne[]>(`${environment.apiUrl}/commandes/${refCommande}/lignes`).pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.loading.set(false);
        this.error.set('Erreur lors du chargement des lignes de commande.');
        return throwError(() => err);
      })
    );
  }

  clearError(): void {
    this.error.set(null);
  }
}
