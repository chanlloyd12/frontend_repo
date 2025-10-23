import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TransferService {
  private apiUrl = `${environment.apiUrl}/transfers`;

  constructor(private http: HttpClient) {}

  // ⚡ Update the payload type to match backend
  create(payload: { employeeId: string; department: string; status: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
