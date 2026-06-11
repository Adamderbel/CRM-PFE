import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ModeContact } from '../models/mode-contact.model';
import { normalizeModeContactRow } from '../utils/normalize-api';

@Injectable({
  providedIn: 'root'
})
export class ModeContactService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<ModeContact[]> {
    return this.http.get<unknown>(`${environment.apiUrl}/ModeContact`).pipe(
      map((raw) => {
        const arr = Array.isArray(raw) ? raw : [];
        return arr.map((item) => normalizeModeContactRow(item as Record<string, unknown>)) as ModeContact[];
      }),
      catchError(() =>
        of([
          { id: 1, libelle: 'Telephone' },
          { id: 2, libelle: 'Email' },
          { id: 3, libelle: 'Visite' },
          { id: 4, libelle: 'Salon' },
        ])
      )
    );
  }
}
