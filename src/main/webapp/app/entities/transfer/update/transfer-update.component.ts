import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TransferFormService, TransferFormGroup } from './transfer-form.service';
import { ITransfer } from '../transfer.model';
import { TransferService } from '../service/transfer.service';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { SecurityUserService } from 'app/entities/security-user/service/security-user.service';
import { IWareHouse } from 'app/entities/ware-house/ware-house.model';
import { WareHouseService } from 'app/entities/ware-house/service/ware-house.service';
import { Status } from 'app/entities/enumerations/status.model';

@Component({
  selector: 'jhi-transfer-update',
  templateUrl: './transfer-update.component.html',
})
export class TransferUpdateComponent implements OnInit {
  isSaving = false;
  transfer: ITransfer | null = null;
  statusValues = Object.keys(Status);

  securityUsersSharedCollection: ISecurityUser[] = [];
  wareHousesSharedCollection: IWareHouse[] = [];

  editForm: TransferFormGroup = this.transferFormService.createTransferFormGroup();

  constructor(
    protected transferService: TransferService,
    protected transferFormService: TransferFormService,
    protected securityUserService: SecurityUserService,
    protected wareHouseService: WareHouseService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSecurityUser = (o1: ISecurityUser | null, o2: ISecurityUser | null): boolean =>
    this.securityUserService.compareSecurityUser(o1, o2);

  compareWareHouse = (o1: IWareHouse | null, o2: IWareHouse | null): boolean => this.wareHouseService.compareWareHouse(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transfer }) => {
      this.transfer = transfer;
      if (transfer) {
        this.updateForm(transfer);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const transfer = this.transferFormService.getTransfer(this.editForm);
    if (transfer.id !== null) {
      this.subscribeToSaveResponse(this.transferService.update(transfer));
    } else {
      this.subscribeToSaveResponse(this.transferService.create(transfer));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITransfer>>): void {
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

  protected updateForm(transfer: ITransfer): void {
    this.transfer = transfer;
    this.transferFormService.resetForm(this.editForm, transfer);

    this.securityUsersSharedCollection = this.securityUserService.addSecurityUserToCollectionIfMissing<ISecurityUser>(
      this.securityUsersSharedCollection,
      transfer.securityUser
    );
    this.wareHousesSharedCollection = this.wareHouseService.addWareHouseToCollectionIfMissing<IWareHouse>(
      this.wareHousesSharedCollection,
      transfer.wareHouse
    );
  }

  protected loadRelationshipsOptions(): void {
    this.securityUserService
      .query()
      .pipe(map((res: HttpResponse<ISecurityUser[]>) => res.body ?? []))
      .pipe(
        map((securityUsers: ISecurityUser[]) =>
          this.securityUserService.addSecurityUserToCollectionIfMissing<ISecurityUser>(securityUsers, this.transfer?.securityUser)
        )
      )
      .subscribe((securityUsers: ISecurityUser[]) => (this.securityUsersSharedCollection = securityUsers));

    this.wareHouseService
      .query()
      .pipe(map((res: HttpResponse<IWareHouse[]>) => res.body ?? []))
      .pipe(
        map((wareHouses: IWareHouse[]) =>
          this.wareHouseService.addWareHouseToCollectionIfMissing<IWareHouse>(wareHouses, this.transfer?.wareHouse)
        )
      )
      .subscribe((wareHouses: IWareHouse[]) => (this.wareHousesSharedCollection = wareHouses));
  }
}
