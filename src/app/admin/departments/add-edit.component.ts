import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { DepartmentService, AlertService } from '@app/_services';
import { Department } from '@app/_models';

@Component({
  templateUrl: './add-edit.component.html'
})
export class AddEditComponent implements OnInit {
  form!: FormGroup;
  id?: number;
  isAddMode!: boolean;
  submitting = false;
  employeeCount = 0;   // ✅ added variable for employee count

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    if (!this.isAddMode) {
      this.departmentService.getById(this.id!)
        .pipe(first())
        .subscribe(dept => {
          this.form.patchValue({
            name: dept.name,
            description: dept.description
          });

          // ✅ ensure employee count is available
          if (dept.employees) {
            this.employeeCount = dept.employees.length;
          } else {
            this.employeeCount = 0;
          }
        });
    }
  }

  get f() { return this.form.controls; }

  // ✅ helper function to display employee count
  getEmployeeCount(): number {
    return this.employeeCount;
  }

  onSubmit() {
    this.submitting = true;
    this.alertService.clear();

    if (this.form.invalid) {
      this.submitting = false;
      return;
    }

    const payload: Partial<Department> = {
      name: this.form.value.name,
      description: this.form.value.description
    };

    if (this.isAddMode) {
      this.departmentService.create(payload)
        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success('Department created', { keepAfterRouteChange: true });
            this.router.navigate(['../'], { relativeTo: this.route });
          },
          error: err => {
            this.alertService.error(err);
            this.submitting = false;
          }
        });
    } else {
      this.departmentService.update(this.id!, payload)
        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success('Department updated', { keepAfterRouteChange: true });
            this.router.navigate(['../../'], { relativeTo: this.route });
          },
          error: err => {
            this.alertService.error(err);
            this.submitting = false;
          }
        });
    }
  }
}
