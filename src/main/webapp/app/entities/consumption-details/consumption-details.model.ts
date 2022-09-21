import dayjs from 'dayjs/esm';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { IProject } from 'app/entities/project/project.model';
import { IProductInventory } from 'app/entities/product-inventory/product-inventory.model';

export interface IConsumptionDetails {
  id: number;
  comsumptionDate?: dayjs.Dayjs | null;
  qtyConsumed?: number | null;
  freeField1?: string | null;
  freeField2?: string | null;
  lastModified?: string | null;
  lastModifiedBy?: string | null;
  securityUser?: Pick<ISecurityUser, 'id' | 'login'> | null;
  project?: Pick<IProject, 'id' | 'name'> | null;
  productInventory?: Pick<IProductInventory, 'id'> | null;
}

export type NewConsumptionDetails = Omit<IConsumptionDetails, 'id'> & { id: null };
