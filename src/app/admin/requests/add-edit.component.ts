import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../_services/request.service';
import { EmployeesService } from '../../_services/employee.service'; 
import { Request } from '../../_models/request';
import { Employee } from '../../_models/employee'; 
import { forkJoin, of } from 'rxjs'; // Import necessary RxJS operators
import { switchMap } from 'rxjs/operators';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
  form!: FormGroup;
  id?: number;
  isAddMode = true;

  // RESTORED PROPERTIES
  title: string = '';
  loading: boolean = false;
  submitted: boolean = false;
  submitting: boolean = false;
  employees: Employee[] = []; 
  
  // Property to hold save errors
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private employeeService: EmployeesService 
  ) {}

  // Helper function to mark all controls in a form group/array as touched
  private markAllControlsAsTouched(control: AbstractControl) {
    control.markAsTouched();
    if (control instanceof FormGroup || control instanceof FormArray) {
      Object.values(control.controls).forEach(subControl => this.markAllControlsAsTouched(subControl));
    }
  }

  // RESTORED GETTER for easy template access
  get f() { return this.form.controls; }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    this.title = this.isAddMode ? 'ADD REQUEST' : 'EDIT REQUEST'; 

    this.form = this.fb.group({
      employeeId: ['', Validators.required],
      type: ['Equipment', Validators.required],
      status: ['Pending'],
      items: this.fb.array([], Validators.required) 
    });

    // --- FIX: Ensure employees are loaded before patching in Edit Mode ---
    this.loading = true;

    // 1. Get the employee list observable
    const employees$ = this.employeeService.getAll();

    if (this.isAddMode) {
      employees$.subscribe(data => {
        this.employees = data;
        this.addItem();
        this.loading = false;
      });
    } else {
      // 2. Combine employee list and specific request data observables
      forkJoin({
        employees: employees$,
        request: this.requestService.getById(this.id!)
      }).subscribe({
        next: ({ employees, request }) => {
          this.employees = employees; // Load employee list first
          this.form.patchValue(request); // Then patch the form value

          if (request.items) {
            request.items.forEach(item => this.items.push(this.createItem(item.name, item.qty)));
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading request or employees:', err);
          this.error = 'Failed to load request data.';
          this.loading = false;
        }
      });
    }
    // --- END FIX ---
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  createItem(name = '', qty = 1) {
    return this.fb.group({
      name: [name, Validators.required],
      qty: [qty, [Validators.required, Validators.min(1)]]
    });
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  onSubmit() {
    this.submitted = true; 
    this.error = null; // Clear previous errors
    
    // Mark all controls as touched to ensure all validation messages are visible
    this.markAllControlsAsTouched(this.form);

    // Check form validity before submission
    if (this.form.invalid) {
        console.error('Form validation failed. Check nested controls.', this.form.errors, this.form.value);
        return;
    }

    this.submitting = true; 
    
    // Note: The disabled employeeId field is not included in this.form.value by default.
    // If your backend requires the employeeId in Edit Mode, you should manually merge it here:
    // const request: Request = { ...this.form.value, employeeId: this.f.employeeId.value }; 
    const request: Request = this.form.value;

    console.log('Attempting to save request payload:', request);

    // Helper function for error handling
    const handleSaveError = (err: any) => {
        console.error('Request save failed:', err); // Log detailed error to console
        this.submitting = false;
        // Set a user-friendly error message
        this.error = 'Failed to save the request. Please check your network connection or console for details.'; 
    };

    if (this.isAddMode) {
      this.requestService.create(request).subscribe({
        next: () => this.router.navigate(['/admin/requests']),
        error: (err) => handleSaveError(err)
      });
    } else {
      // In Edit Mode, we need to ensure the ID is included in the payload
      const updatePayload = {
        ...request,
        id: this.id,
        employeeId: this.form.get('employeeId')?.value // Ensure the disabled employeeId value is included
      } as Request;

      this.requestService.update(this.id!, updatePayload).subscribe({
        next: () => this.router.navigate(['/admin/requests']),
        error: (err) => handleSaveError(err)
      });
    }
  }
}