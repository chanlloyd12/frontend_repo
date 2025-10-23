import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkflowListComponent } from './list.component';

const routes: Routes = [
  { path: 'employee/:employeeId', component: WorkflowListComponent },
  { path: '', component: WorkflowListComponent } // optional: list all workflows
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowsRoutingModule { }
