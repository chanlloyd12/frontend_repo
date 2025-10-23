import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '../../_services/workflow.service';
import { Workflow } from '../../_models/workflow';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-workflow-list',
  templateUrl: './list.component.html'
})
export class WorkflowListComponent implements OnInit {
  workflows: Workflow[] = [];
  employeeId!: string;
  loading: boolean = false;

  constructor(
    private workflowService: WorkflowService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('employeeId')!;
    this.loadWorkflows();
  }

  loadWorkflows() {
    this.loading = true;
    this.workflowService.getByEmployeeId(this.employeeId)
      .pipe(first())
      .subscribe({
        next: (data) => {
          // Format the workflows
          this.workflows = data.map(wf => {
            if (wf.type === 'Request Approval' && wf.request) {
              wf.details =
                `requestId: ${wf.request.requestId}\n` +
                `requestType: ${wf.request.type}\n` +
                `requesterId: ${wf.request.employeeId}\n` +
                `message: Review ${wf.request.type} request #${wf.request.requestId} from Employee ID ${wf.request.employeeId}.`;
            } else if (wf.type === 'Department Transfer' && wf.transfer) {
              wf.details = `Transfer request from ${wf.transfer.fromDept} to ${wf.transfer.toDept}`;
            }
            return wf;
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Failed to load workflows:', error);
          this.loading = false;
        }
      });
}


  updateStatus(wf: Workflow) {
    if (wf.id === undefined) {
      console.error('Workflow id missing', wf);
      return;
    }

    const newStatus = wf.status;

    this.workflowService.update(wf.id, { status: newStatus })
      .pipe(first())
      .subscribe({
        next: (updated) => {
          // Replace the local item with the backend-returned updated object to keep nested request/transfer sync
          const idx = this.workflows.findIndex(x => x.id === wf.id);
          if (idx > -1) this.workflows[idx] = updated;
        },
        error: (error) => {
          console.error('Failed to update workflow:', error);
          // reload to ensure UI consistency
          this.loadWorkflows();
        }
      });
  }
}
