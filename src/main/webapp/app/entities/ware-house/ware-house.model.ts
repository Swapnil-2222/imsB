import { IProductInventory } from 'app/entities/product-inventory/product-inventory.model';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';

export interface IWareHouse {
  id: number;
  whName?: string | null;
  address?: string | null;
  pincode?: number | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  gSTDetails?: string | null;
  managerName?: string | null;
  managerEmail?: string | null;
  managerContact?: string | null;
  contact?: string | null;
  isDeleted?: boolean | null;
  isActive?: boolean | null;
  wareHouseId?: number | null;
  lastModified?: string | null;
  lastModifiedBy?: string | null;
  productInventories?: Pick<IProductInventory, 'id'>[] | null;
  securityUsers?: Pick<ISecurityUser, 'id' | 'login'>[] | null;
}

export type NewWareHouse = Omit<IWareHouse, 'id'> & { id: null };
