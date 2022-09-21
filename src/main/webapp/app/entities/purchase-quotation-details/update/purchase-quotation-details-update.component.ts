import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PurchaseQuotationDetailsFormService, PurchaseQuotationDetailsFormGroup } from './purchase-quotation-details-form.service';
import { IPurchaseQuotationDetails } from '../purchase-quotation-details.model';
import { PurchaseQuotationDetailsService } from '../service/purchase-quotation-details.service';
import { IPurchaseQuotation } from 'app/entities/purchase-quotation/purchase-quotation.model';
import { PurchaseQuotationService } from 'app/entities/purchase-quotation/service/purchase-quotation.service';

@Component({
  selector: 'jhi-purchase-quotation-details-update',
  templateUrl: './purchase-quotation-details-update.component.html',
})
export class PurchaseQuotationDetailsUpdateComponent implements OnInit {
  isSaving = false;
  purchaseQuotationDetails: IPurchaseQuotationDetails | null = null;

  purchaseQuotationsSharedCollection: IPurchaseQuotation[] = [];

  editForm: PurchaseQuotationDetailsFormGroup = this.purchaseQuotationDetailsFormService.createPurchaseQuotationDetailsFormGroup();

  constructor(
    protected purchaseQuotationDetailsService: PurchaseQuotationDetailsService,
    protected purchaseQuotationDetailsFormService: PurchaseQuotationDetailsFormService,
    protected purchaseQuotationService: PurchaseQuotationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePurchaseQuotation = (o1: IPurchaseQuotation | null, o2: IPurchaseQuotation | null): boolean =>
    this.purchaseQuotationService.comparePurchaseQuotation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ purchaseQuotationDetails }) => {
      this.purchaseQuotationDetails = purchaseQuotationDetails;
      if (purchaseQuotationDetails) {
        this.updateForm(purchaseQuotationDetails);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const purchaseQuotationDetails = this.purchaseQuotationDetailsFormService.getPurchaseQuotationDetails(this.editForm);
    if (purchaseQuotationDetails.id !== null) {
      this.subscribeToSaveResponse(this.purchaseQuotationDetailsService.update(purchaseQuotationDetails));
    } else {
      this.subscribeToSaveResponse(this.purchaseQuotationDetailsService.create(purchaseQuotationDetails));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPurchaseQuotationDetails>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(purchaseQuotationDetails: IPurchaseQuotationDetails): void {
    this.purchaseQuotationDetails = purchaseQuotationDetails;
    this.purchaseQuotationDetailsFormService.resetForm(this.editForm, purchaseQuotationDetails);

    this.purchaseQuotationsSharedCollection = this.purchaseQuotationService.addPurchaseQuotationToCollectionIfMissing<IPurchaseQuotation>(
      this.purchaseQuotationsSharedCollection,
      purchaseQuotationDetails.purchaseQuotation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.purchaseQuotationService
      .query()
      .pipe(map((res: HttpResponse<IPurchaseQuotation[]>) => res.body ?? []))
      .pipe(
        map((purchaseQuotations: IPurchaseQuotation[]) =>
          this.purchaseQuotationService.addPurchaseQuotationToCollectionIfMissing<IPurchaseQuotation>(
            purchaseQuotations,
            this.purchaseQuotationDetails?.purchaseQuotation
          )
        )
      )
      .subscribe((purchaseQuotations: IPurchaseQuotation[]) => (this.purchaseQuotationsSharedCollection = purchaseQuotations));
  }
}
