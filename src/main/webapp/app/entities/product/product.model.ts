import { ICategories } from 'app/entities/categories/categories.model';
import { IUnit } from 'app/entities/unit/unit.model';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { IPurchaseQuotationDetails } from 'app/entities/purchase-quotation-details/purchase-quotation-details.model';
import { ProductType } from 'app/entities/enumerations/product-type.model';

export interface IProduct {
  id: number;
  shortName?: string | null;
  chemicalFormula?: string | null;
  hsnNo?: string | null;
  materialImage?: string | null;
  materialImageContentType?: string | null;
  isDeleted?: boolean | null;
  isActive?: boolean | null;
  productName?: string | null;
  alertUnits?: string | null;
  casNumber?: string | null;
  catlogNumber?: string | null;
  molecularWt?: number | null;
  molecularFormula?: string | null;
  chemicalName?: string | null;
  structureImg?: string | null;
  description?: string | null;
  qrCode?: string | null;
  barCode?: string | null;
  gstPercentage?: number | null;
  productType?: ProductType | null;
  lastModified?: string | null;
  lastModifiedBy?: string | null;
  freeField1?: string | null;
  freeField2?: string | null;
  categories?: Pick<ICategories, 'id'> | null;
  unit?: Pick<IUnit, 'id'> | null;
  securityUser?: Pick<ISecurityUser, 'id' | 'login'> | null;
  purchaseQuotationDetails?: Pick<IPurchaseQuotationDetails, 'id'> | null;
}

export type NewProduct = Omit<IProduct, 'id'> & { id: null };
