import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';  // ✅ add this

import { AccountsRoutingModule } from './accounts-routing.module'; // ✅ correct one
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule, 
    AccountsRoutingModule
  ],
  declarations: [
    ListComponent,
    AddEditComponent
  ]
})
export class AccountsModule {}
