import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICategories, NewCategories } from '../categories.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICategories for edit and NewCategoriesFormGroupInput for create.
 */
type CategoriesFormGroupInput = ICategories | PartialWithRequiredKeyOf<NewCategories>;

type CategoriesFormDefaults = Pick<NewCategories, 'id' | 'isDeleted' | 'isActive'>;

type CategoriesFormGroupContent = {
  id: FormControl<ICategories['id'] | NewCategories['id']>;
  categoryName: FormControl<ICategories['categoryName']>;
  categoryDescription: FormControl<ICategories['categoryDescription']>;
  freeField1: FormControl<ICategories['freeField1']>;
  lastModified: FormControl<ICategories['lastModified']>;
  lastModifiedBy: FormControl<ICategories['lastModifiedBy']>;
  isDeleted: FormControl<ICategories['isDeleted']>;
  isActive: FormControl<ICategories['isActive']>;
};

export type CategoriesFormGroup = FormGroup<CategoriesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CategoriesFormService {
  createCategoriesFormGroup(categories: CategoriesFormGroupInput = { id: null }): CategoriesFormGroup {
    const categoriesRawValue = {
      ...this.getFormDefaults(),
      ...categories,
    };
    return new FormGroup<CategoriesFormGroupContent>({
      id: new FormControl(
        { value: categoriesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      categoryName: new FormControl(categoriesRawValue.categoryName),
      categoryDescription: new FormControl(categoriesRawValue.categoryDescription),
      freeField1: new FormControl(categoriesRawValue.freeField1),
      lastModified: new FormControl(categoriesRawValue.lastModified),
      lastModifiedBy: new FormControl(categoriesRawValue.lastModifiedBy),
      isDeleted: new FormControl(categoriesRawValue.isDeleted),
      isActive: new FormControl(categoriesRawValue.isActive),
    });
  }

  getCategories(form: CategoriesFormGroup): ICategories | NewCategories {
    return form.getRawValue() as ICategories | NewCategories;
  }

  resetForm(form: CategoriesFormGroup, categories: CategoriesFormGroupInput): void {
    const categoriesRawValue = { ...this.getFormDefaults(), ...categories };
    form.reset(
      {
        ...categoriesRawValue,
        id: { value: categoriesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CategoriesFormDefaults {
    return {
      id: null,
      isDeleted: false,
      isActive: false,
    };
  }
}
