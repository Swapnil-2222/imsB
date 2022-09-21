export interface ICategories {
  id: number;
  categoryName?: string | null;
  categoryDescription?: string | null;
  freeField1?: string | null;
  lastModified?: string | null;
  lastModifiedBy?: string | null;
  isDeleted?: boolean | null;
  isActive?: boolean | null;
}

export type NewCategories = Omit<ICategories, 'id'> & { id: null };
