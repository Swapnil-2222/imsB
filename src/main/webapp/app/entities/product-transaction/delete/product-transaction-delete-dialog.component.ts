import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductTransaction } from '../product-transaction.model';
import { ProductTransactionService } from '../service/product-transaction.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './product-transaction-delete-dialog.component.html',
})
export class ProductTransactionDeleteDialogComponent {
  productTransaction?: IProductTransaction;

  constructor(protected productTransactionService: ProductTransactionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productTransactionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
