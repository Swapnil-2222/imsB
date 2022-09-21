import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ProductInventoryFormService, ProductInventoryFormGroup } from './product-inventory-form.service';
import { IProductInventory } from '../product-inventory.model';
import { ProductInventoryService } from '../service/product-inventory.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IPurchaseQuotation } from 'app/entities/purchase-quotation/purchase-quotation.model';
import { PurchaseQuotationService } from 'app/entities/purchase-quotation/service/purchase-quotation.service';
import { IProductTransaction } from 'app/entities/product-transaction/product-transaction.model';
import { ProductTransactionService } from 'app/entities/product-transaction/service/product-transaction.service';
import { IWareHouse } from 'app/entities/ware-house/ware-house.model';
import { WareHouseService } from 'app/entities/ware-house/service/ware-house.service';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { SecurityUserService } from 'app/entities/security-user/service/security-user.service';

@Component({
  selector: 'jhi-product-inventory-update',
  templateUrl: './product-inventory-update.component.html',
})
export class ProductInventoryUpdateComponent implements OnInit {
  isSaving = false;
  productInventory: IProductInventory | null = null;

  productsSharedCollection: IProduct[] = [];
  purchaseQuotationsSharedCollection: IPurchaseQuotation[] = [];
  productTransactionsSharedCollection: IProductTransaction[] = [];
  wareHousesSharedCollection: IWareHouse[] = [];
  securityUsersSharedCollection: ISecurityUser[] = [];

  editForm: ProductInventoryFormGroup = this.productInventoryFormService.createProductInventoryFormGroup();

  constructor(
    protected productInventoryService: ProductInventoryService,
    protected productInventoryFormService: ProductInventoryFormService,
    protected productService: ProductService,
    protected purchaseQuotationService: PurchaseQuotationService,
    protected productTransactionService: ProductTransactionService,
    protected wareHouseService: WareHouseService,
    protected securityUserService: SecurityUserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareProduct = (o1: IProduct | null, o2: IProduct | null): boolean => this.productService.compareProduct(o1, o2);

  comparePurchaseQuotation = (o1: IPurchaseQuotation | null, o2: IPurchaseQuotation | null): boolean =>
    this.purchaseQuotationService.comparePurchaseQuotation(o1, o2);

  compareProductTransaction = (o1: IProductTransaction | null, o2: IProductTransaction | null): boolean =>
    this.productTransactionService.compareProductTransaction(o1, o2);

  compareWareHouse = (o1: IWareHouse | null, o2: IWareHouse | null): boolean => this.wareHouseService.compareWareHouse(o1, o2);

  compareSecurityUser = (o1: ISecurityUser | null, o2: ISecurityUser | null): boolean =>
    this.securityUserService.compareSecurityUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productInventory }) => {
      this.productInventory = productInventory;
      if (productInventory) {
        this.updateForm(productInventory);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productInventory = this.productInventoryFormService.getProductInventory(this.editForm);
    if (productInventory.id !== null) {
      this.subscribeToSaveResponse(this.productInventoryService.update(productInventory));
    } else {
      this.subscribeToSaveResponse(this.productInventoryService.create(productInventory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductInventory>>): void {
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

  protected updateForm(productInventory: IProductInventory): void {
    this.productInventory = productInventory;
    this.productInventoryFormService.resetForm(this.editForm, productInventory);

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing<IProduct>(
      this.productsSharedCollection,
      productInventory.product
    );
    this.purchaseQuotationsSharedCollection = this.purchaseQuotationService.addPurchaseQuotationToCollectionIfMissing<IPurchaseQuotation>(
      this.purchaseQuotationsSharedCollection,
      productInventory.purchaseQuotation
    );
    this.productTransactionsSharedCollection =
      this.productTransactionService.addProductTransactionToCollectionIfMissing<IProductTransaction>(
        this.productTransactionsSharedCollection,
        productInventory.productTransaction
      );
    this.wareHousesSharedCollection = this.wareHouseService.addWareHouseToCollectionIfMissing<IWareHouse>(
      this.wareHousesSharedCollection,
      ...(productInventory.wareHouses ?? [])
    );
    this.securityUsersSharedCollection = this.securityUserService.addSecurityUserToCollectionIfMissing<ISecurityUser>(
      this.securityUsersSharedCollection,
      ...(productInventory.securityUsers ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) =>
          this.productService.addProductToCollectionIfMissing<IProduct>(products, this.productInventory?.product)
        )
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));

    this.purchaseQuotationService
      .query()
      .pipe(map((res: HttpResponse<IPurchaseQuotation[]>) => res.body ?? []))
      .pipe(
        map((purchaseQuotations: IPurchaseQuotation[]) =>
          this.purchaseQuotationService.addPurchaseQuotationToCollectionIfMissing<IPurchaseQuotation>(
            purchaseQuotations,
            this.productInventory?.purchaseQuotation
          )
        )
      )
      .subscribe((purchaseQuotations: IPurchaseQuotation[]) => (this.purchaseQuotationsSharedCollection = purchaseQuotations));

    this.productTransactionService
      .query()
      .pipe(map((res: HttpResponse<IProductTransaction[]>) => res.body ?? []))
      .pipe(
        map((productTransactions: IProductTransaction[]) =>
          this.productTransactionService.addProductTransactionToCollectionIfMissing<IProductTransaction>(
            productTransactions,
            this.productInventory?.productTransaction
          )
        )
      )
      .subscribe((productTransactions: IProductTransaction[]) => (this.productTransactionsSharedCollection = productTransactions));

    this.wareHouseService
      .query()
      .pipe(map((res: HttpResponse<IWareHouse[]>) => res.body ?? []))
      .pipe(
        map((wareHouses: IWareHouse[]) =>
          this.wareHouseService.addWareHouseToCollectionIfMissing<IWareHouse>(wareHouses, ...(this.productInventory?.wareHouses ?? []))
        )
      )
      .subscribe((wareHouses: IWareHouse[]) => (this.wareHousesSharedCollection = wareHouses));

    this.securityUserService
      .query()
      .pipe(map((res: HttpResponse<ISecurityUser[]>) => res.body ?? []))
      .pipe(
        map((securityUsers: ISecurityUser[]) =>
          this.securityUserService.addSecurityUserToCollectionIfMissing<ISecurityUser>(
            securityUsers,
            ...(this.productInventory?.securityUsers ?? [])
          )
        )
      )
      .subscribe((securityUsers: ISecurityUser[]) => (this.securityUsersSharedCollection = securityUsers));
  }
}
