import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardMetrics {
  totalProspects: number;
  totalClients: number;
  totalProspections: number;
  totalLignesProspection: number;
  totalActionsCommerciales: number;
  totalReclamations: number;
  tauxConversion: number;
  nouveauxProspectsMois: number;
  prospectionsEnCours: number;
}

export interface CommercialHistoryItem {
  actionId: string;
  dateAction: string;
  typeActionLibelle?: string | null;
  prospectionId: string;
  contactType?: 'prospect' | 'client' | null;
  contactId?: string | null;
  contactNom?: string | null;
  prospectNomComplet?: string | null;
  commentaire?: string | null;
  resultat?: string | null;
  ligneProspectionId?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${environment.apiUrl}/dashboard/metrics`);
  }

  getHistoriqueCommercial(limit = 120): Observable<CommercialHistoryItem[]> {
    return this.http.get<CommercialHistoryItem[]>(
      `${environment.apiUrl}/dashboard/historique-commercial`,
      { params: { limit: String(limit) } }
    );
  }
}
