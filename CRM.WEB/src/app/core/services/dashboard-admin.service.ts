import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StatusCount {
  statutId: number;
  libelle: string;
  count: number;
}

export interface MonthlyCount {
  month: string;
  count: number;
}

export interface RecentProspection {
  id: string;
  prospect: string;
  statut: string;
  statutId: number;
  dateDebut: string;
  dateFin: string;
}

export interface DashboardStats {
  totalProspections: number;
  prospectionsGagnees: number;
  tauxConversion: number;
  prospectionsEnCours: number;
  prospectionsByStatus: StatusCount[];
  lignesByStatus: StatusCount[];
  monthlyTrend: MonthlyCount[];
  recentProspections: RecentProspection[];
}

@Injectable({ providedIn: 'root' })
export class DashboardAdminService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${environment.apiUrl}/Dashboard/stats`);
  }
}
