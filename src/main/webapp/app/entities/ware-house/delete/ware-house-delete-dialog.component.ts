import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IWareHouse } from '../ware-house.model';
import { WareHouseService } from '../service/ware-house.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './ware-house-delete-dialog.component.html',
})
export class WareHouseDeleteDialogComponent {
  wareHouse?: IWareHouse;

  constructor(protected wareHouseService: WareHouseService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.wareHouseService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
