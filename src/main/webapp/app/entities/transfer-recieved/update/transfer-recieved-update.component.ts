import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TransferRecievedFormService, TransferRecievedFormGroup } from './transfer-recieved-form.service';
import { ITransferRecieved } from '../transfer-recieved.model';
import { TransferRecievedService } from '../service/transfer-recieved.service';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { SecurityUserService } from 'app/entities/security-user/service/security-user.service';
import { ITransfer } from 'app/entities/transfer/transfer.model';
import { TransferService } from 'app/entities/transfer/service/transfer.service';

@Component({
  selector: 'jhi-transfer-recieved-update',
  templateUrl: './transfer-recieved-update.component.html',
})
export class TransferRecievedUpdateComponent implements OnInit {
  isSaving = false;
  transferRecieved: ITransferRecieved | null = null;

  securityUsersSharedCollection: ISecurityUser[] = [];
  transfersSharedCollection: ITransfer[] = [];

  editForm: TransferRecievedFormGroup = this.transferRecievedFormService.createTransferRecievedFormGroup();

  constructor(
    protected transferRecievedService: TransferRecievedService,
    protected transferRecievedFormService: TransferRecievedFormService,
    protected securityUserService: SecurityUserService,
    protected transferService: TransferService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSecurityUser = (o1: ISecurityUser | null, o2: ISecurityUser | null): boolean =>
    this.securityUserService.compareSecurityUser(o1, o2);

  compareTransfer = (o1: ITransfer | null, o2: ITransfer | null): boolean => this.transferService.compareTransfer(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transferRecieved }) => {
      this.transferRecieved = transferRecieved;
      if (transferRecieved) {
        this.updateForm(transferRecieved);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const transferRecieved = this.transferRecievedFormService.getTransferRecieved(this.editForm);
    if (transferRecieved.id !== null) {
      this.subscribeToSaveResponse(this.transferRecievedService.update(transferRecieved));
    } else {
      this.subscribeToSaveResponse(this.transferRecievedService.create(transferRecieved));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITransferRecieved>>): void {
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

  protected updateForm(transferRecieved: ITransferRecieved): void {
    this.transferRecieved = transferRecieved;
    this.transferRecievedFormService.resetForm(this.editForm, transferRecieved);

    this.securityUsersSharedCollection = this.securityUserService.addSecurityUserToCollectionIfMissing<ISecurityUser>(
      this.securityUsersSharedCollection,
      transferRecieved.securityUser
    );
    this.transfersSharedCollection = this.transferService.addTransferToCollectionIfMissing<ITransfer>(
      this.transfersSharedCollection,
      transferRecieved.transfer
    );
  }

  protected loadRelationshipsOptions(): void {
    this.securityUserService
      .query()
      .pipe(map((res: HttpResponse<ISecurityUser[]>) => res.body ?? []))
      .pipe(
        map((securityUsers: ISecurityUser[]) =>
          this.securityUserService.addSecurityUserToCollectionIfMissing<ISecurityUser>(securityUsers, this.transferRecieved?.securityUser)
        )
      )
      .subscribe((securityUsers: ISecurityUser[]) => (this.securityUsersSharedCollection = securityUsers));

    this.transferService
      .query()
      .pipe(map((res: HttpResponse<ITransfer[]>) => res.body ?? []))
      .pipe(
        map((transfers: ITransfer[]) =>
          this.transferService.addTransferToCollectionIfMissing<ITransfer>(transfers, this.transferRecieved?.transfer)
        )
      )
      .subscribe((transfers: ITransfer[]) => (this.transfersSharedCollection = transfers));
  }
}
