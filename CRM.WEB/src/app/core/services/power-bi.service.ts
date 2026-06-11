import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PowerBiEmbedConfig {
  message?: string;
  embedUrl: string;
  groupId: string;
  reportId: string;
  configured: boolean;
  accessMode?: string;
}

export interface PowerBiReportInfo {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

@Injectable({ providedIn: 'root' })
export class PowerBiService {
  constructor(private http: HttpClient) {}

  getEmbedConfig(): Observable<PowerBiEmbedConfig> {
    return this.http.get<PowerBiEmbedConfig>(`${environment.apiUrl}/PowerBi/embed-config`);
  }

  getReports(): Observable<PowerBiReportInfo[]> {
    return this.http.get<PowerBiReportInfo[]>(`${environment.apiUrl}/PowerBi/reports`);
  }
}
