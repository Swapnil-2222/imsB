import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { WareHouseFormService, WareHouseFormGroup } from './ware-house-form.service';
import { IWareHouse } from '../ware-house.model';
import { WareHouseService } from '../service/ware-house.service';

@Component({
  selector: 'jhi-ware-house-update',
  templateUrl: './ware-house-update.component.html',
})
export class WareHouseUpdateComponent implements OnInit {
  isSaving = false;
  wareHouse: IWareHouse | null = null;

  editForm: WareHouseFormGroup = this.wareHouseFormService.createWareHouseFormGroup();

  constructor(
    protected wareHouseService: WareHouseService,
    protected wareHouseFormService: WareHouseFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ wareHouse }) => {
      this.wareHouse = wareHouse;
      if (wareHouse) {
        this.updateForm(wareHouse);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const wareHouse = this.wareHouseFormService.getWareHouse(this.editForm);
    if (wareHouse.id !== null) {
      this.subscribeToSaveResponse(this.wareHouseService.update(wareHouse));
    } else {
      this.subscribeToSaveResponse(this.wareHouseService.create(wareHouse));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWareHouse>>): void {
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

  protected updateForm(wareHouse: IWareHouse): void {
    this.wareHouse = wareHouse;
    this.wareHouseFormService.resetForm(this.editForm, wareHouse);
  }
}
