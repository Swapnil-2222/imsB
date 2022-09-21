import dayjs from 'dayjs/esm';
import { ISecurityPermission } from 'app/entities/security-permission/security-permission.model';
import { ISecurityRole } from 'app/entities/security-role/security-role.model';
import { IWareHouse } from 'app/entities/ware-house/ware-house.model';
import { IProductInventory } from 'app/entities/product-inventory/product-inventory.model';

export interface ISecurityUser {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  designation?: string | null;
  businessTitle?: string | null;
  login?: string | null;
  passwordHash?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  activated?: boolean | null;
  langKey?: string | null;
  activationKey?: string | null;
  resetKey?: string | null;
  resetDate?: dayjs.Dayjs | null;
  mobileNo?: string | null;
  oneTimePassword?: string | null;
  otpExpiryTime?: dayjs.Dayjs | null;
  lastModified?: string | null;
  lastModifiedBy?: string | null;
  securityPermissions?: Pick<ISecurityPermission, 'id' | 'name'>[] | null;
  securityRoles?: Pick<ISecurityRole, 'id' | 'name'>[] | null;
  wareHouses?: Pick<IWareHouse, 'id' | 'whName'>[] | null;
  productInventories?: Pick<IProductInventory, 'id'>[] | null;
}

export type NewSecurityUser = Omit<ISecurityUser, 'id'> & { id: null };
