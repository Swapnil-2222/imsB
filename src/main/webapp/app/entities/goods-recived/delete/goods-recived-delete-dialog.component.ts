import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGoodsRecived } from '../goods-recived.model';
import { GoodsRecivedService } from '../service/goods-recived.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './goods-recived-delete-dialog.component.html',
})
export class GoodsRecivedDeleteDialogComponent {
  goodsRecived?: IGoodsRecived;

  constructor(protected goodsRecivedService: GoodsRecivedService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.goodsRecivedService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
