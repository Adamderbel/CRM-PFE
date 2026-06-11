import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Reclamation, ReclamationCreateDto } from '../models/reclamation.model';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private apiUrl = `${environment.apiUrl}/Reclamation`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.apiUrl);
  }

  create(data: ReclamationCreateDto): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getById(id: string): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.apiUrl}/${id}`);
  }

  update(id: string, data: Partial<Reclamation>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
