import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ActionsProspection, TypeActionProspection } from '../models/action-prospection.model';

@Injectable({ providedIn: 'root' })
export class ActionProspectionService {
  constructor(private http: HttpClient) {}

  getByProspectionId(prospectionId: string): Observable<ActionsProspection[]> {
    return this.http.get<ActionsProspection[]>(
      `${environment.apiUrl}/ActionsProspection/prospection/${prospectionId}`
    );
  }

  create(action: Omit<ActionsProspection, 'id' | 'typeAction'>): Observable<void> {
    return this.http
      .post(`${environment.apiUrl}/ActionsProspection`, action, { responseType: 'text' })
      .pipe(map(() => undefined));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete(`${environment.apiUrl}/ActionsProspection/${id}`, { responseType: 'text' })
      .pipe(map(() => undefined));
  }

  getTypesActions(): Observable<TypeActionProspection[]> {
    return this.http.get<TypeActionProspection[]>(`${environment.apiUrl}/TypeActionProspection`);
  }
}
