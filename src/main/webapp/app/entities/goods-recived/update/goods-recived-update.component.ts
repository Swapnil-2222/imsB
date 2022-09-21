import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { GoodsRecivedFormService, GoodsRecivedFormGroup } from './goods-recived-form.service';
import { IGoodsRecived } from '../goods-recived.model';
import { GoodsRecivedService } from '../service/goods-recived.service';
import { IPurchaseQuotation } from 'app/entities/purchase-quotation/purchase-quotation.model';
import { PurchaseQuotationService } from 'app/entities/purchase-quotation/service/purchase-quotation.service';

@Component({
  selector: 'jhi-goods-recived-update',
  templateUrl: './goods-recived-update.component.html',
})
export class GoodsRecivedUpdateComponent implements OnInit {
  isSaving = false;
  goodsRecived: IGoodsRecived | null = null;

  purchaseQuotationsSharedCollection: IPurchaseQuotation[] = [];

  editForm: GoodsRecivedFormGroup = this.goodsRecivedFormService.createGoodsRecivedFormGroup();

  constructor(
    protected goodsRecivedService: GoodsRecivedService,
    protected goodsRecivedFormService: GoodsRecivedFormService,
    protected purchaseQuotationService: PurchaseQuotationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePurchaseQuotation = (o1: IPurchaseQuotation | null, o2: IPurchaseQuotation | null): boolean =>
    this.purchaseQuotationService.comparePurchaseQuotation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ goodsRecived }) => {
      this.goodsRecived = goodsRecived;
      if (goodsRecived) {
        this.updateForm(goodsRecived);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const goodsRecived = this.goodsRecivedFormService.getGoodsRecived(this.editForm);
    if (goodsRecived.id !== null) {
      this.subscribeToSaveResponse(this.goodsRecivedService.update(goodsRecived));
    } else {
      this.subscribeToSaveResponse(this.goodsRecivedService.create(goodsRecived));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGoodsRecived>>): void {
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

  protected updateForm(goodsRecived: IGoodsRecived): void {
    this.goodsRecived = goodsRecived;
    this.goodsRecivedFormService.resetForm(this.editForm, goodsRecived);

    this.purchaseQuotationsSharedCollection = this.purchaseQuotationService.addPurchaseQuotationToCollectionIfMissing<IPurchaseQuotation>(
      this.purchaseQuotationsSharedCollection,
      goodsRecived.purchaseQuotation
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
            this.goodsRecived?.purchaseQuotation
          )
        )
      )
      .subscribe((purchaseQuotations: IPurchaseQuotation[]) => (this.purchaseQuotationsSharedCollection = purchaseQuotations));
  }
}
