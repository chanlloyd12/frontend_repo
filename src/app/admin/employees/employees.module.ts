import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // ✅ combine imports
import { EmployeesRoutingModule } from './employees-routing.module';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,             // ✅ should be here
    EmployeesRoutingModule
  ],
  declarations: [
    ListComponent,
    AddEditComponent          // ✅ only declare components
  ]
})
export class EmployeesModule {}
