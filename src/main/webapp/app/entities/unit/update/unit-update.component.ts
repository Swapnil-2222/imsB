import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { UnitFormService, UnitFormGroup } from './unit-form.service';
import { IUnit } from '../unit.model';
import { UnitService } from '../service/unit.service';

@Component({
  selector: 'jhi-unit-update',
  templateUrl: './unit-update.component.html',
})
export class UnitUpdateComponent implements OnInit {
  isSaving = false;
  unit: IUnit | null = null;

  editForm: UnitFormGroup = this.unitFormService.createUnitFormGroup();

  constructor(protected unitService: UnitService, protected unitFormService: UnitFormService, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ unit }) => {
      this.unit = unit;
      if (unit) {
        this.updateForm(unit);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const unit = this.unitFormService.getUnit(this.editForm);
    if (unit.id !== null) {
      this.subscribeToSaveResponse(this.unitService.update(unit));
    } else {
      this.subscribeToSaveResponse(this.unitService.create(unit));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUnit>>): void {
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

  protected updateForm(unit: IUnit): void {
    this.unit = unit;
    this.unitFormService.resetForm(this.editForm, unit);
  }
}
