import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Request } from '../_models/request';
import { environment } from '../../environments/environment';

const baseUrl = 'http://localhost:4000/requests';

@Injectable({ providedIn: 'root' })
export class RequestService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Request[]> {
    return this.http.get<Request[]>(baseUrl);
  }

  getById(id: number): Observable<Request> {
    return this.http.get<Request>(`${baseUrl}/${id}`);
  }

  create(request: Request): Observable<Request> {
    return this.http.post<Request>(baseUrl, request);
  }

  update(id: number, request: Request): Observable<Request> {
    return this.http.put<Request>(`${baseUrl}/${id}`, request);
  }

  getByEmployeeId(employeeId: string) {
  return this.http.get<Request[]>(`${environment.apiUrl}/requests/employee/${employeeId}`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
