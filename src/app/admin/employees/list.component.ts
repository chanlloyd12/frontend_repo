import { Component, OnInit, TemplateRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http'; // ✅ FIXED missing import
import { Employee } from '@app/_models/employee';
import { EmployeesService } from '@app/_services/employee.service';
import { TransferService } from '@app/_services/transfer.service';
import { DepartmentService } from '@app/_services/department.service';

@Component({
  selector: 'app-employees-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  employees?: Employee[];
  departments: any[] = [];
  selectedEmployee?: Employee;
  selectedDepartment: string = '';
  currentEmployeeDepartment: string = '';

  // ✅ Add missing properties
  message: string | null = null;
  isError: boolean = false;
  messageTimeout: any = null;

  successMessage: string = ''; // shown only on main page
  modalMessage: string = '';   // shown only inside modal for errors
  submitting = false;

  constructor(
    private employeeService: EmployeesService,
    private departmentService: DepartmentService,
    private transferService: TransferService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadEmployees();

    this.departmentService
      .getAll()
      .pipe(first())
      .subscribe((departments: any[]) => (this.departments = departments));
  }

  // ✅ Add loadEmployees() (was missing)
  loadEmployees() {
    this.employeeService
      .getAll()
      .pipe(first())
      .subscribe((employees: Employee[]) => (this.employees = employees));
  }

  openTransferModal(content: TemplateRef<any>, employee: Employee) {
    this.selectedEmployee = employee;
    this.currentEmployeeDepartment = employee.department || 'Unknown';
    this.selectedDepartment = '';
    this.modalMessage = '';
    this.submitting = false;
    this.modalService.open(content, { centered: true, backdrop: 'static' });
  }

  // ✅ Display temporary success/error message on main page
  private showMessage(msg: string, isError = false) {
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
    this.message = msg;
    this.isError = isError;

    this.messageTimeout = setTimeout(() => {
      this.message = null;
      this.isError = false;
    }, 4000);
  }

  // ✅ Error message extractor
  private async extractErrorMessage(err: any): Promise<string> {
    console.error('Full transfer error object:', err);

    if (err instanceof HttpErrorResponse) {
      const e = err.error;

      if (e instanceof Blob) {
        try {
          const text = await e.text();
          try {
            const parsed = JSON.parse(text);
            if (parsed?.message) return String(parsed.message);
            return JSON.stringify(parsed).slice(0, 1000);
          } catch {
            return text.trim();
          }
        } catch {
          return 'An unexpected error occurred.';
        }
      }

      if (e && typeof e === 'object') {
        if (typeof e.message === 'string' && e.message.trim()) return e.message.trim();
        if ((e as any).errors) {
          const errs = (e as any).errors;
          if (Array.isArray(errs) && errs.length) {
            const first = errs.find((x: any) => x.msg || x.message) || errs[0];
            return String(first.msg || first.message || JSON.stringify(first));
          }
        }
      }

      if (typeof e === 'string' && e.trim()) return e.trim();
      if (err.statusText) return `${err.status} ${err.statusText}`;
      if (err.message) return String(err.message);
    }

    if (err?.error?.message) return String(err.error.message);
    if (err?.message) return String(err.message);
    if (typeof err === 'string') return err;
    return 'An unexpected error occurred.';
  }

  confirmTransfer(modal: any) {
    this.modalMessage = '';
    if (!this.selectedEmployee || !this.selectedDepartment) {
      this.modalMessage = 'Please select a department.';
      return;
    }

    const payload = {
      employeeId: this.selectedEmployee.employeeId as string,
      department: this.selectedDepartment,
      status: 'Pending'
    };

    this.submitting = true;

    this.transferService.create(payload).subscribe({
      next: (res: any) => {
        this.submitting = false;
        this.successMessage =
          res?.message ||
          `Transfer request created for ${this.selectedEmployee?.employeeId} to ${this.selectedDepartment}.`;

        this.showMessage(this.successMessage, false); // ✅ show success alert
        this.loadEmployees();
        modal.close();
      },
      error: async (err) => {
        this.submitting = false;
        const msg = await this.extractErrorMessage(err);
        const cleaned = msg.replace(/^Error:\s*/i, '').trim();
        this.modalMessage = cleaned || 'An unexpected error occurred.';
      }
    });
  }
}
