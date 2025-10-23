import { Component } from '@angular/core';
import { WorkflowService } from '../../_services/workflow.service';
import { Workflow } from '../../_models/workflow';

@Component({
  selector: 'app-workflow-add-edit',
  templateUrl: './add-edit.component.html'
})
export class AddEditComponent {
  workflow: Workflow = { employeeId: '', type: '', details: '', status: 'Pending' };

  constructor(private workflowService: WorkflowService) {}

  save() {
    this.workflowService.create(this.workflow).subscribe(res => {
      alert('Workflow created successfully');
      this.workflow = { employeeId: '', type: '', details: '', status: 'Pending' };
    });
  }
}
