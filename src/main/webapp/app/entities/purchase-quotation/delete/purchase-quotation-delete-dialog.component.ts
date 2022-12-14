import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPurchaseQuotation } from '../purchase-quotation.model';
import { PurchaseQuotationService } from '../service/purchase-quotation.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './purchase-quotation-delete-dialog.component.html',
})
export class PurchaseQuotationDeleteDialogComponent {
  purchaseQuotation?: IPurchaseQuotation;

  constructor(protected purchaseQuotationService: PurchaseQuotationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.purchaseQuotationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
