import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PurchaseQuotationFormService, PurchaseQuotationFormGroup } from './purchase-quotation-form.service';
import { IPurchaseQuotation } from '../purchase-quotation.model';
import { PurchaseQuotationService } from '../service/purchase-quotation.service';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { SecurityUserService } from 'app/entities/security-user/service/security-user.service';
import { OrderType } from 'app/entities/enumerations/order-type.model';
import { Status } from 'app/entities/enumerations/status.model';

@Component({
  selector: 'jhi-purchase-quotation-update',
  templateUrl: './purchase-quotation-update.component.html',
})
export class PurchaseQuotationUpdateComponent implements OnInit {
  isSaving = false;
  purchaseQuotation: IPurchaseQuotation | null = null;
  orderTypeValues = Object.keys(OrderType);
  statusValues = Object.keys(Status);

  securityUsersSharedCollection: ISecurityUser[] = [];

  editForm: PurchaseQuotationFormGroup = this.purchaseQuotationFormService.createPurchaseQuotationFormGroup();

  constructor(
    protected purchaseQuotationService: PurchaseQuotationService,
    protected purchaseQuotationFormService: PurchaseQuotationFormService,
    protected securityUserService: SecurityUserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSecurityUser = (o1: ISecurityUser | null, o2: ISecurityUser | null): boolean =>
    this.securityUserService.compareSecurityUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ purchaseQuotation }) => {
      this.purchaseQuotation = purchaseQuotation;
      if (purchaseQuotation) {
        this.updateForm(purchaseQuotation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const purchaseQuotation = this.purchaseQuotationFormService.getPurchaseQuotation(this.editForm);
    if (purchaseQuotation.id !== null) {
      this.subscribeToSaveResponse(this.purchaseQuotationService.update(purchaseQuotation));
    } else {
      this.subscribeToSaveResponse(this.purchaseQuotationService.create(purchaseQuotation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPurchaseQuotation>>): void {
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

  protected updateForm(purchaseQuotation: IPurchaseQuotation): void {
    this.purchaseQuotation = purchaseQuotation;
    this.purchaseQuotationFormService.resetForm(this.editForm, purchaseQuotation);

    this.securityUsersSharedCollection = this.securityUserService.addSecurityUserToCollectionIfMissing<ISecurityUser>(
      this.securityUsersSharedCollection,
      purchaseQuotation.securityUser
    );
  }

  protected loadRelationshipsOptions(): void {
    this.securityUserService
      .query()
      .pipe(map((res: HttpResponse<ISecurityUser[]>) => res.body ?? []))
      .pipe(
        map((securityUsers: ISecurityUser[]) =>
          this.securityUserService.addSecurityUserToCollectionIfMissing<ISecurityUser>(securityUsers, this.purchaseQuotation?.securityUser)
        )
      )
      .subscribe((securityUsers: ISecurityUser[]) => (this.securityUsersSharedCollection = securityUsers));
  }
}
