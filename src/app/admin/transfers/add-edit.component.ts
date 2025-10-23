import { Component } from '@angular/core';
import { TransferService } from '../../_services/transfer.service';
import { Transfer } from '../../_models/transfer';

@Component({
  selector: 'app-transfer-add-edit',
  templateUrl: './add-edit.component.html'
})
export class AddEditComponent {
  transfer: Transfer = { employeeId: '', toDept: '' };

  constructor(private transferService: TransferService) {}

  save() {
    this.transferService.create(this.transfer).subscribe(res => {
      alert('Transfer created successfully');
      this.transfer = { employeeId: '', toDept: '' };
    });
  }
}
