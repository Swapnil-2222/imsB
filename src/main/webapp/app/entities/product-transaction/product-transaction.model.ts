import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { IWareHouse } from 'app/entities/ware-house/ware-house.model';
import { TransactionType } from 'app/entities/enumerations/transaction-type.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IProductTransaction {
  id: number;
  refrenceId?: number | null;
  transactionType?: TransactionType | null;
  transactionStatus?: Status | null;
  transactionDate?: string | null;
  description?: string | null;
  freeField1?: string | null;
  freeField2?: string | null;
  lastModified?: string | null;
  lastModifiedBy?: string | null;
  securityUser?: Pick<ISecurityUser, 'id' | 'login'> | null;
  wareHouse?: Pick<IWareHouse, 'id' | 'whName'> | null;
}

export type NewProductTransaction = Omit<IProductTransaction, 'id'> & { id: null };
