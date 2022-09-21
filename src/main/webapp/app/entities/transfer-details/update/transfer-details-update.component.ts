import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TransferDetailsFormService, TransferDetailsFormGroup } from './transfer-details-form.service';
import { ITransferDetails } from '../transfer-details.model';
import { TransferDetailsService } from '../service/transfer-details.service';
import { IWareHouse } from 'app/entities/ware-house/ware-house.model';
import { WareHouseService } from 'app/entities/ware-house/service/ware-house.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ITransfer } from 'app/entities/transfer/transfer.model';
import { TransferService } from 'app/entities/transfer/service/transfer.service';

@Component({
  selector: 'jhi-transfer-details-update',
  templateUrl: './transfer-details-update.component.html',
})
export class TransferDetailsUpdateComponent implements OnInit {
  isSaving = false;
  transferDetails: ITransferDetails | null = null;

  wareHousesSharedCollection: IWareHouse[] = [];
  productsSharedCollection: IProduct[] = [];
  transfersSharedCollection: ITransfer[] = [];

  editForm: TransferDetailsFormGroup = this.transferDetailsFormService.createTransferDetailsFormGroup();

  constructor(
    protected transferDetailsService: TransferDetailsService,
    protected transferDetailsFormService: TransferDetailsFormService,
    protected wareHouseService: WareHouseService,
    protected productService: ProductService,
    protected transferService: TransferService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareWareHouse = (o1: IWareHouse | null, o2: IWareHouse | null): boolean => this.wareHouseService.compareWareHouse(o1, o2);

  compareProduct = (o1: IProduct | null, o2: IProduct | null): boolean => this.productService.compareProduct(o1, o2);

  compareTransfer = (o1: ITransfer | null, o2: ITransfer | null): boolean => this.transferService.compareTransfer(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transferDetails }) => {
      this.transferDetails = transferDetails;
      if (transferDetails) {
        this.updateForm(transferDetails);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const transferDetails = this.transferDetailsFormService.getTransferDetails(this.editForm);
    if (transferDetails.id !== null) {
      this.subscribeToSaveResponse(this.transferDetailsService.update(transferDetails));
    } else {
      this.subscribeToSaveResponse(this.transferDetailsService.create(transferDetails));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITransferDetails>>): void {
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

  protected updateForm(transferDetails: ITransferDetails): void {
    this.transferDetails = transferDetails;
    this.transferDetailsFormService.resetForm(this.editForm, transferDetails);

    this.wareHousesSharedCollection = this.wareHouseService.addWareHouseToCollectionIfMissing<IWareHouse>(
      this.wareHousesSharedCollection,
      transferDetails.wareHouse
    );
    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing<IProduct>(
      this.productsSharedCollection,
      transferDetails.product
    );
    this.transfersSharedCollection = this.transferService.addTransferToCollectionIfMissing<ITransfer>(
      this.transfersSharedCollection,
      transferDetails.transfer
    );
  }

  protected loadRelationshipsOptions(): void {
    this.wareHouseService
      .query()
      .pipe(map((res: HttpResponse<IWareHouse[]>) => res.body ?? []))
      .pipe(
        map((wareHouses: IWareHouse[]) =>
          this.wareHouseService.addWareHouseToCollectionIfMissing<IWareHouse>(wareHouses, this.transferDetails?.wareHouse)
        )
      )
      .subscribe((wareHouses: IWareHouse[]) => (this.wareHousesSharedCollection = wareHouses));

    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) =>
          this.productService.addProductToCollectionIfMissing<IProduct>(products, this.transferDetails?.product)
        )
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));

    this.transferService
      .query()
      .pipe(map((res: HttpResponse<ITransfer[]>) => res.body ?? []))
      .pipe(
        map((transfers: ITransfer[]) =>
          this.transferService.addTransferToCollectionIfMissing<ITransfer>(transfers, this.transferDetails?.transfer)
        )
      )
      .subscribe((transfers: ITransfer[]) => (this.transfersSharedCollection = transfers));
  }
}
