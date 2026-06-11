import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UpdateUserRoleRequest, UserDto, UserStatusRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${environment.apiUrl}/users`);
  }

  updateUserStatus(id: string, request: UserStatusRequest): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}/users/${id}/status`, request);
  }

  updateUserRole(id: string, request: UpdateUserRoleRequest): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}/users/${id}/role`, request);
  }
}
