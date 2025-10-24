import { Component, OnInit, TemplateRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  currentEmployeeDepartment: string = ''; // ✅ store current department

  constructor(
    private employeeService: EmployeesService,
    private departmentService: DepartmentService,
    private transferService: TransferService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    // Load all employees
    this.employeeService
      .getAll()
      .pipe(first())
      .subscribe((employees: Employee[]) => (this.employees = employees));

    // Load all departments
    this.departmentService
      .getAll()
      .pipe(first())
      .subscribe((departments: any[]) => (this.departments = departments));
  }

  openTransferModal(content: TemplateRef<any>, employee: Employee) {
    this.selectedEmployee = employee;
    this.currentEmployeeDepartment = employee.department || 'Unknown'; // current department
    this.selectedDepartment = ''; // reset selected department
    this.modalService.open(content, { centered: true, backdrop: 'static' });
  }

  confirmTransfer(modal: any) {
  if (!this.selectedEmployee || !this.selectedDepartment) {
    alert('Please select a department.');
    return;
  }

  const payload = {
    employeeId: this.selectedEmployee.employeeId ?? '',
    department: this.selectedDepartment, // must be "department" for backend
    status: 'Pending'
  };

  console.log('Submitting transfer:', payload);

  this.transferService.create(payload).subscribe({
    next: (res) => {
      console.log('Transfer API response:', res);
      alert(`✅ Transfer request created for ${this.selectedEmployee?.employeeId}`);
      modal.close();
    },
    error: (err) => {
      console.error('❌ Transfer failed:', err);
      alert('Transfer request failed. Check console for details.');
    }
  });
}

}
