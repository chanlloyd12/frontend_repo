import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { EmployeesService, AlertService, AccountService, DepartmentService } from '@app/_services';

@Component({
  selector: 'app-employee-add-edit',
  templateUrl: './add-edit.component.html'
})
export class AddEditComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  id?: string;
  title!: string;
  loading = false;
  submitting = false;
  submitted = false;
  private routeSub!: Subscription;
  isEditMode: boolean = false; // <-- New property to track mode

  accounts: any[] = [];
  departments: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeesService,
    private accountService: AccountService,
    private departmentService: DepartmentService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    // load accounts
    this.accountService.getAll()
      .pipe(first())
      .subscribe({
        next: (data: any[]) => {
          this.accounts = data.filter(acc => acc.status === 'Active');
        },
        error: (err) => console.error('Error loading accounts', err)
      });

    // load departments
    this.departmentService.getAll()
      .pipe(first())
      .subscribe({
        next: (data: any[]) => {
          this.departments = data;
        },
        error: (err) => console.error('Error loading departments', err)
      });

    this.routeSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.isEditMode = !!this.id; // <-- Set the edit mode flag
      this.initForm();

      this.title = this.id ? 'Edit Employee' : 'Create Employee';

      if (this.id) {
        // editing
        this.loading = true;
        // Disable accountId if editing, similar to employeeId
        this.form.get('accountId')?.disable(); // <-- Disable accountId in edit mode
        
        this.employeeService.getById(this.id)
          .pipe(first())
          .subscribe({
            next: (x: any) => {
              this.form.patchValue({
                employeeId: x.employeeId,
                accountId: x.accountId,
                position: x.position,
                department: x.department,
                hireDate: x.hireDate,
                status: x.status ?? 'Active'
              });
              this.loading = false;
            },
            error: () => { this.loading = false; }
          });
      } else {
        // ✅ creating → fetch next employeeId
        this.employeeService.getNextId()
          .pipe(first())
          .subscribe({
            next: (res) => {
              this.form.patchValue({ employeeId: res.employeeId });
            },
            error: (err) => console.error('Error fetching next employeeId', err)
          });
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      // employeeId is always disabled
      employeeId: [{ value: '', disabled: true }], 
      // accountId is not disabled initially; it is disabled later in ngOnInit if in edit mode
      accountId: ['', Validators.required], 
      position: ['', Validators.required],
      department: ['', Validators.required],
      hireDate: ['', Validators.required],
      status: ['Active', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();

    if (this.form.invalid) return;

    this.submitting = true;

    // Use getRawValue() to include values from disabled form controls (employeeId and accountId)
    const payload = { ...this.form.getRawValue() };

    let request$;
    let message: string;

    if (this.id) {
      request$ = this.employeeService.update(this.id!, payload);
      message = 'Employee updated';
    } else {
      request$ = this.employeeService.create(payload);
      message = 'Employee created';
    }

    request$.pipe(first()).subscribe({
      next: () => {
        this.alertService.success(message, { keepAfterRouteChange: true });
        this.router.navigateByUrl('/admin/employees');
      },
      error: (error: any) => {
        this.alertService.error(error);
        this.submitting = false;
      }
    });
  }
}
