import dayjs from 'dayjs/esm';
import { IProduct } from 'app/entities/product/product.model';
import { IPurchaseQuotation } from 'app/entities/purchase-quotation/purchase-quotation.model';
import { IProductTransaction } from 'app/entities/product-transaction/product-transaction.model';
import { IWareHouse } from 'app/entities/ware-house/ware-house.model';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';

export interface IProductInventory {
  id: number;
  inwardOutwardDate?: dayjs.Dayjs | null;
  inwardQty?: string | null;
  outwardQty?: string | null;
  totalQuanity?: string | null;
  pricePerUnit?: number | null;
  lotNo?: string | null;
  expiryDate?: dayjs.Dayjs | null;
  inventoryTypeId?: string | null;
  freeField1?: string | null;
  freeField2?: string | null;
  lastModified?: string | null;
  lastModifiedBy?: string | null;
  isDeleted?: boolean | null;
  isActive?: boolean | null;
  product?: Pick<IProduct, 'id' | 'productName'> | null;
  purchaseQuotation?: Pick<IPurchaseQuotation, 'id'> | null;
  productTransaction?: Pick<IProductTransaction, 'id'> | null;
  wareHouses?: Pick<IWareHouse, 'id' | 'whName'>[] | null;
  securityUsers?: Pick<ISecurityUser, 'id' | 'login'>[] | null;
}

export type NewProductInventory = Omit<IProductInventory, 'id'> & { id: null };
