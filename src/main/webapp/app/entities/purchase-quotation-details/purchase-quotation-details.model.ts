import { IPurchaseQuotation } from 'app/entities/purchase-quotation/purchase-quotation.model';

export interface IPurchaseQuotationDetails {
  id: number;
  qtyordered?: number | null;
  gstTaxPercentage?: number | null;
  pricePerUnit?: number | null;
  totalPrice?: number | null;
  discount?: number | null;
  lastModified?: string | null;
  lastModifiedBy?: string | null;
  freeField1?: string | null;
  freeField2?: string | null;
  purchaseQuotation?: Pick<IPurchaseQuotation, 'id'> | null;
}

export type NewPurchaseQuotationDetails = Omit<IPurchaseQuotationDetails, 'id'> & { id: null };
