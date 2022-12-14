import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITransferRecieved } from '../transfer-recieved.model';
import { TransferRecievedService } from '../service/transfer-recieved.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './transfer-recieved-delete-dialog.component.html',
})
export class TransferRecievedDeleteDialogComponent {
  transferRecieved?: ITransferRecieved;

  constructor(protected transferRecievedService: TransferRecievedService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.transferRecievedService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
