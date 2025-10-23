import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Department } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private baseUrl = `${environment.apiUrl}/departments`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Department[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<Department>(`${this.baseUrl}/${id}`);
  }

  create(params: any) {
    return this.http.post(this.baseUrl, params);
  }

  update(id: number, params: any) {
    return this.http.put(`${this.baseUrl}/${id}`, params);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
