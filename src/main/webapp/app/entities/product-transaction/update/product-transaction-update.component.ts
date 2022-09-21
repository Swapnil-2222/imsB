import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ProductTransactionFormService, ProductTransactionFormGroup } from './product-transaction-form.service';
import { IProductTransaction } from '../product-transaction.model';
import { ProductTransactionService } from '../service/product-transaction.service';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { SecurityUserService } from 'app/entities/security-user/service/security-user.service';
import { IWareHouse } from 'app/entities/ware-house/ware-house.model';
import { WareHouseService } from 'app/entities/ware-house/service/ware-house.service';
import { TransactionType } from 'app/entities/enumerations/transaction-type.model';
import { Status } from 'app/entities/enumerations/status.model';

@Component({
  selector: 'jhi-product-transaction-update',
  templateUrl: './product-transaction-update.component.html',
})
export class ProductTransactionUpdateComponent implements OnInit {
  isSaving = false;
  productTransaction: IProductTransaction | null = null;
  transactionTypeValues = Object.keys(TransactionType);
  statusValues = Object.keys(Status);

  securityUsersSharedCollection: ISecurityUser[] = [];
  wareHousesSharedCollection: IWareHouse[] = [];

  editForm: ProductTransactionFormGroup = this.productTransactionFormService.createProductTransactionFormGroup();

  constructor(
    protected productTransactionService: ProductTransactionService,
    protected productTransactionFormService: ProductTransactionFormService,
    protected securityUserService: SecurityUserService,
    protected wareHouseService: WareHouseService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSecurityUser = (o1: ISecurityUser | null, o2: ISecurityUser | null): boolean =>
    this.securityUserService.compareSecurityUser(o1, o2);

  compareWareHouse = (o1: IWareHouse | null, o2: IWareHouse | null): boolean => this.wareHouseService.compareWareHouse(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productTransaction }) => {
      this.productTransaction = productTransaction;
      if (productTransaction) {
        this.updateForm(productTransaction);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productTransaction = this.productTransactionFormService.getProductTransaction(this.editForm);
    if (productTransaction.id !== null) {
      this.subscribeToSaveResponse(this.productTransactionService.update(productTransaction));
    } else {
      this.subscribeToSaveResponse(this.productTransactionService.create(productTransaction));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductTransaction>>): void {
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

  protected updateForm(productTransaction: IProductTransaction): void {
    this.productTransaction = productTransaction;
    this.productTransactionFormService.resetForm(this.editForm, productTransaction);

    this.securityUsersSharedCollection = this.securityUserService.addSecurityUserToCollectionIfMissing<ISecurityUser>(
      this.securityUsersSharedCollection,
      productTransaction.securityUser
    );
    this.wareHousesSharedCollection = this.wareHouseService.addWareHouseToCollectionIfMissing<IWareHouse>(
      this.wareHousesSharedCollection,
      productTransaction.wareHouse
    );
  }

  protected loadRelationshipsOptions(): void {
    this.securityUserService
      .query()
      .pipe(map((res: HttpResponse<ISecurityUser[]>) => res.body ?? []))
      .pipe(
        map((securityUsers: ISecurityUser[]) =>
          this.securityUserService.addSecurityUserToCollectionIfMissing<ISecurityUser>(securityUsers, this.productTransaction?.securityUser)
        )
      )
      .subscribe((securityUsers: ISecurityUser[]) => (this.securityUsersSharedCollection = securityUsers));

    this.wareHouseService
      .query()
      .pipe(map((res: HttpResponse<IWareHouse[]>) => res.body ?? []))
      .pipe(
        map((wareHouses: IWareHouse[]) =>
          this.wareHouseService.addWareHouseToCollectionIfMissing<IWareHouse>(wareHouses, this.productTransaction?.wareHouse)
        )
      )
      .subscribe((wareHouses: IWareHouse[]) => (this.wareHousesSharedCollection = wareHouses));
  }
}
