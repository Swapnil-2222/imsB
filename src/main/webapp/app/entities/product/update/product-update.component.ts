import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ProductFormService, ProductFormGroup } from './product-form.service';
import { IProduct } from '../product.model';
import { ProductService } from '../service/product.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ICategories } from 'app/entities/categories/categories.model';
import { CategoriesService } from 'app/entities/categories/service/categories.service';
import { IUnit } from 'app/entities/unit/unit.model';
import { UnitService } from 'app/entities/unit/service/unit.service';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { SecurityUserService } from 'app/entities/security-user/service/security-user.service';
import { IPurchaseQuotationDetails } from 'app/entities/purchase-quotation-details/purchase-quotation-details.model';
import { PurchaseQuotationDetailsService } from 'app/entities/purchase-quotation-details/service/purchase-quotation-details.service';
import { ProductType } from 'app/entities/enumerations/product-type.model';

@Component({
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html',
})
export class ProductUpdateComponent implements OnInit {
  isSaving = false;
  product: IProduct | null = null;
  productTypeValues = Object.keys(ProductType);

  categoriesSharedCollection: ICategories[] = [];
  unitsSharedCollection: IUnit[] = [];
  securityUsersSharedCollection: ISecurityUser[] = [];
  purchaseQuotationDetailsSharedCollection: IPurchaseQuotationDetails[] = [];

  editForm: ProductFormGroup = this.productFormService.createProductFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected productService: ProductService,
    protected productFormService: ProductFormService,
    protected categoriesService: CategoriesService,
    protected unitService: UnitService,
    protected securityUserService: SecurityUserService,
    protected purchaseQuotationDetailsService: PurchaseQuotationDetailsService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCategories = (o1: ICategories | null, o2: ICategories | null): boolean => this.categoriesService.compareCategories(o1, o2);

  compareUnit = (o1: IUnit | null, o2: IUnit | null): boolean => this.unitService.compareUnit(o1, o2);

  compareSecurityUser = (o1: ISecurityUser | null, o2: ISecurityUser | null): boolean =>
    this.securityUserService.compareSecurityUser(o1, o2);

  comparePurchaseQuotationDetails = (o1: IPurchaseQuotationDetails | null, o2: IPurchaseQuotationDetails | null): boolean =>
    this.purchaseQuotationDetailsService.comparePurchaseQuotationDetails(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.product = product;
      if (product) {
        this.updateForm(product);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('imsBApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.productFormService.getProduct(this.editForm);
    if (product.id !== null) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
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

  protected updateForm(product: IProduct): void {
    this.product = product;
    this.productFormService.resetForm(this.editForm, product);

    this.categoriesSharedCollection = this.categoriesService.addCategoriesToCollectionIfMissing<ICategories>(
      this.categoriesSharedCollection,
      product.categories
    );
    this.unitsSharedCollection = this.unitService.addUnitToCollectionIfMissing<IUnit>(this.unitsSharedCollection, product.unit);
    this.securityUsersSharedCollection = this.securityUserService.addSecurityUserToCollectionIfMissing<ISecurityUser>(
      this.securityUsersSharedCollection,
      product.securityUser
    );
    this.purchaseQuotationDetailsSharedCollection =
      this.purchaseQuotationDetailsService.addPurchaseQuotationDetailsToCollectionIfMissing<IPurchaseQuotationDetails>(
        this.purchaseQuotationDetailsSharedCollection,
        product.purchaseQuotationDetails
      );
  }

  protected loadRelationshipsOptions(): void {
    this.categoriesService
      .query()
      .pipe(map((res: HttpResponse<ICategories[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategories[]) =>
          this.categoriesService.addCategoriesToCollectionIfMissing<ICategories>(categories, this.product?.categories)
        )
      )
      .subscribe((categories: ICategories[]) => (this.categoriesSharedCollection = categories));

    this.unitService
      .query()
      .pipe(map((res: HttpResponse<IUnit[]>) => res.body ?? []))
      .pipe(map((units: IUnit[]) => this.unitService.addUnitToCollectionIfMissing<IUnit>(units, this.product?.unit)))
      .subscribe((units: IUnit[]) => (this.unitsSharedCollection = units));

    this.securityUserService
      .query()
      .pipe(map((res: HttpResponse<ISecurityUser[]>) => res.body ?? []))
      .pipe(
        map((securityUsers: ISecurityUser[]) =>
          this.securityUserService.addSecurityUserToCollectionIfMissing<ISecurityUser>(securityUsers, this.product?.securityUser)
        )
      )
      .subscribe((securityUsers: ISecurityUser[]) => (this.securityUsersSharedCollection = securityUsers));

    this.purchaseQuotationDetailsService
      .query()
      .pipe(map((res: HttpResponse<IPurchaseQuotationDetails[]>) => res.body ?? []))
      .pipe(
        map((purchaseQuotationDetails: IPurchaseQuotationDetails[]) =>
          this.purchaseQuotationDetailsService.addPurchaseQuotationDetailsToCollectionIfMissing<IPurchaseQuotationDetails>(
            purchaseQuotationDetails,
            this.product?.purchaseQuotationDetails
          )
        )
      )
      .subscribe(
        (purchaseQuotationDetails: IPurchaseQuotationDetails[]) =>
          (this.purchaseQuotationDetailsSharedCollection = purchaseQuotationDetails)
      );
  }
}
