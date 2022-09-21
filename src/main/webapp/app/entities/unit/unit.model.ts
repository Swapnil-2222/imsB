export interface IUnit {
  id: number;
  unitName?: string | null;
  shortName?: string | null;
  freeField1?: string | null;
  lastModified?: string | null;
  lastModifiedBy?: string | null;
  isDeleted?: boolean | null;
  isActive?: boolean | null;
}

export type NewUnit = Omit<IUnit, 'id'> & { id: null };
