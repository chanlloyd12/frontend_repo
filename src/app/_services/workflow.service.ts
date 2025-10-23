import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workflow } from '../_models/workflow';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private baseUrl = `${environment.apiUrl}/workflows`; // use environment.apiUrl

  constructor(private http: HttpClient) { }

  getAll(): Observable<Workflow[]> {
    return this.http.get<Workflow[]>(`${this.baseUrl}`);
  }

  getById(id: number): Observable<Workflow> {
    return this.http.get<Workflow>(`${this.baseUrl}/${id}`);
  }

  create(params: Partial<Workflow>): Observable<Workflow> {
    return this.http.post<Workflow>(`${this.baseUrl}`, params);
  }

  update(id: number, params: Partial<Workflow>): Observable<Workflow> {
    return this.http.put<Workflow>(`${this.baseUrl}/${id}`, params);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getByEmployeeId(employeeId: string): Observable<Workflow[]> {
    return this.http.get<Workflow[]>(`${this.baseUrl}/employee/${employeeId}`);
  }
}
