import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TransferDetailsApprovalsFormService, TransferDetailsApprovalsFormGroup } from './transfer-details-approvals-form.service';
import { ITransferDetailsApprovals } from '../transfer-details-approvals.model';
import { TransferDetailsApprovalsService } from '../service/transfer-details-approvals.service';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { SecurityUserService } from 'app/entities/security-user/service/security-user.service';
import { ITransfer } from 'app/entities/transfer/transfer.model';
import { TransferService } from 'app/entities/transfer/service/transfer.service';

@Component({
  selector: 'jhi-transfer-details-approvals-update',
  templateUrl: './transfer-details-approvals-update.component.html',
})
export class TransferDetailsApprovalsUpdateComponent implements OnInit {
  isSaving = false;
  transferDetailsApprovals: ITransferDetailsApprovals | null = null;

  securityUsersSharedCollection: ISecurityUser[] = [];
  transfersSharedCollection: ITransfer[] = [];

  editForm: TransferDetailsApprovalsFormGroup = this.transferDetailsApprovalsFormService.createTransferDetailsApprovalsFormGroup();

  constructor(
    protected transferDetailsApprovalsService: TransferDetailsApprovalsService,
    protected transferDetailsApprovalsFormService: TransferDetailsApprovalsFormService,
    protected securityUserService: SecurityUserService,
    protected transferService: TransferService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSecurityUser = (o1: ISecurityUser | null, o2: ISecurityUser | null): boolean =>
    this.securityUserService.compareSecurityUser(o1, o2);

  compareTransfer = (o1: ITransfer | null, o2: ITransfer | null): boolean => this.transferService.compareTransfer(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transferDetailsApprovals }) => {
      this.transferDetailsApprovals = transferDetailsApprovals;
      if (transferDetailsApprovals) {
        this.updateForm(transferDetailsApprovals);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const transferDetailsApprovals = this.transferDetailsApprovalsFormService.getTransferDetailsApprovals(this.editForm);
    if (transferDetailsApprovals.id !== null) {
      this.subscribeToSaveResponse(this.transferDetailsApprovalsService.update(transferDetailsApprovals));
    } else {
      this.subscribeToSaveResponse(this.transferDetailsApprovalsService.create(transferDetailsApprovals));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITransferDetailsApprovals>>): void {
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

  protected updateForm(transferDetailsApprovals: ITransferDetailsApprovals): void {
    this.transferDetailsApprovals = transferDetailsApprovals;
    this.transferDetailsApprovalsFormService.resetForm(this.editForm, transferDetailsApprovals);

    this.securityUsersSharedCollection = this.securityUserService.addSecurityUserToCollectionIfMissing<ISecurityUser>(
      this.securityUsersSharedCollection,
      transferDetailsApprovals.securityUser
    );
    this.transfersSharedCollection = this.transferService.addTransferToCollectionIfMissing<ITransfer>(
      this.transfersSharedCollection,
      transferDetailsApprovals.transfer
    );
  }

  protected loadRelationshipsOptions(): void {
    this.securityUserService
      .query()
      .pipe(map((res: HttpResponse<ISecurityUser[]>) => res.body ?? []))
      .pipe(
        map((securityUsers: ISecurityUser[]) =>
          this.securityUserService.addSecurityUserToCollectionIfMissing<ISecurityUser>(
            securityUsers,
            this.transferDetailsApprovals?.securityUser
          )
        )
      )
      .subscribe((securityUsers: ISecurityUser[]) => (this.securityUsersSharedCollection = securityUsers));

    this.transferService
      .query()
      .pipe(map((res: HttpResponse<ITransfer[]>) => res.body ?? []))
      .pipe(
        map((transfers: ITransfer[]) =>
          this.transferService.addTransferToCollectionIfMissing<ITransfer>(transfers, this.transferDetailsApprovals?.transfer)
        )
      )
      .subscribe((transfers: ITransfer[]) => (this.transfersSharedCollection = transfers));
  }
}
