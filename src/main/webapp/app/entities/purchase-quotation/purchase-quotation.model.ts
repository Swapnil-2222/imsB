import dayjs from 'dayjs/esm';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { OrderType } from 'app/entities/enumerations/order-type.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IPurchaseQuotation {
  id: number;
  totalPOAmount?: number | null;
  totalGSTAmount?: number | null;
  expectedDeliveryDate?: dayjs.Dayjs | null;
  poDate?: dayjs.Dayjs | null;
  orderType?: OrderType | null;
  orderStatus?: Status | null;
  clientName?: string | null;
  clientMobile?: string | null;
  clientEmail?: string | null;
  termsAndCondition?: string | null;
  notes?: string | null;
  lastModified?: string | null;
  lastModifiedBy?: string | null;
  freeField1?: string | null;
  freeField2?: string | null;
  securityUser?: Pick<ISecurityUser, 'id' | 'login'> | null;
}

export type NewPurchaseQuotation = Omit<IPurchaseQuotation, 'id'> & { id: null };
