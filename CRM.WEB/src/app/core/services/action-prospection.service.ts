import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActionProspection, ActionProspectionCreateDto } from '../models/action-prospection.model';

@Injectable({
  providedIn: 'root'
})
export class ActionProspectionService {
  private apiUrl = `${environment.apiUrl}/ActionsProspection`;

  constructor(private http: HttpClient) {}

  getByLigneProspectionId(ligneId: string): Observable<ActionProspection[]> {
    return this.http.get<ActionProspection[]>(`${this.apiUrl}/ligne/${ligneId}`);
  }

  create(dto: ActionProspectionCreateDto): Observable<void> {
    return this.http.post<void>(this.apiUrl, dto);
  }
}
