import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CauseEchec {
  id: number;
  libelle?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CauseEchecService {
  private apiUrl = `${environment.apiUrl}/CauseEchec`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<CauseEchec[]> {
    return this.http.get<CauseEchec[]>(this.apiUrl);
  }

  getById(id: number): Observable<CauseEchec> {
    return this.http.get<CauseEchec>(`${this.apiUrl}/${id}`);
  }
}
