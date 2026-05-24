import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TypeActionProspection } from '../models/type-action-prospection.model';

@Injectable({
  providedIn: 'root'
})
export class TypeActionProspectionService {
  private apiUrl = `${environment.apiUrl}/TypeActionProspection`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TypeActionProspection[]> {
    return this.http.get<TypeActionProspection[]>(this.apiUrl);
  }
}
