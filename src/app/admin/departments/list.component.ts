// src/app/admin/departments/list.component.ts
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { DepartmentService } from '@app/_services/department.service';

@Component({
  selector: 'app-departments-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  departments: any[] = [];

  constructor(private departmentService: DepartmentService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.departmentService.getAll().pipe(first()).subscribe(d => this.departments = d || []);
  }

  deleteDepartment(id: any) {
    if (!confirm('Delete department?')) return;
    this.departmentService.delete(id).pipe(first()).subscribe(() => {
      this.departments = this.departments.filter(x => x.id !== id);
    });
  }
}
