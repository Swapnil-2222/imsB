import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUnit, NewUnit } from '../unit.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUnit for edit and NewUnitFormGroupInput for create.
 */
type UnitFormGroupInput = IUnit | PartialWithRequiredKeyOf<NewUnit>;

type UnitFormDefaults = Pick<NewUnit, 'id' | 'isDeleted' | 'isActive'>;

type UnitFormGroupContent = {
  id: FormControl<IUnit['id'] | NewUnit['id']>;
  unitName: FormControl<IUnit['unitName']>;
  shortName: FormControl<IUnit['shortName']>;
  freeField1: FormControl<IUnit['freeField1']>;
  lastModified: FormControl<IUnit['lastModified']>;
  lastModifiedBy: FormControl<IUnit['lastModifiedBy']>;
  isDeleted: FormControl<IUnit['isDeleted']>;
  isActive: FormControl<IUnit['isActive']>;
};

export type UnitFormGroup = FormGroup<UnitFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UnitFormService {
  createUnitFormGroup(unit: UnitFormGroupInput = { id: null }): UnitFormGroup {
    const unitRawValue = {
      ...this.getFormDefaults(),
      ...unit,
    };
    return new FormGroup<UnitFormGroupContent>({
      id: new FormControl(
        { value: unitRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      unitName: new FormControl(unitRawValue.unitName),
      shortName: new FormControl(unitRawValue.shortName),
      freeField1: new FormControl(unitRawValue.freeField1),
      lastModified: new FormControl(unitRawValue.lastModified),
      lastModifiedBy: new FormControl(unitRawValue.lastModifiedBy),
      isDeleted: new FormControl(unitRawValue.isDeleted),
      isActive: new FormControl(unitRawValue.isActive),
    });
  }

  getUnit(form: UnitFormGroup): IUnit | NewUnit {
    return form.getRawValue() as IUnit | NewUnit;
  }

  resetForm(form: UnitFormGroup, unit: UnitFormGroupInput): void {
    const unitRawValue = { ...this.getFormDefaults(), ...unit };
    form.reset(
      {
        ...unitRawValue,
        id: { value: unitRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UnitFormDefaults {
    return {
      id: null,
      isDeleted: false,
      isActive: false,
    };
  }
}
