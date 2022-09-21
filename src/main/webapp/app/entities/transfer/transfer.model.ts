import dayjs from 'dayjs/esm';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { IWareHouse } from 'app/entities/ware-house/ware-house.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface ITransfer {
  id: number;
  tranferDate?: dayjs.Dayjs | null;
  comment?: string | null;
  status?: Status | null;
  sourceWareHouse?: string | null;
  destinationWareHouse?: string | null;
  freeField1?: string | null;
  lastModified?: string | null;
  lastModifiedBy?: string | null;
  securityUser?: Pick<ISecurityUser, 'id' | 'login'> | null;
  wareHouse?: Pick<IWareHouse, 'id' | 'whName'> | null;
}

export type NewTransfer = Omit<ITransfer, 'id'> & { id: null };
