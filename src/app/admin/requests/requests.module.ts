import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { RequestsRoutingModule } from './requests-routing.module';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RequestsRoutingModule   // ✅ import routing
  ],
  declarations: [
    ListComponent,
    AddEditComponent
  ]
})
export class RequestsModule {}
