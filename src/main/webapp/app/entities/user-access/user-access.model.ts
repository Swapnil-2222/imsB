import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { AccessLevel } from 'app/entities/enumerations/access-level.model';

export interface IUserAccess {
  id: number;
  level?: AccessLevel | null;
  accessId?: number | null;
  lastModified?: string | null;
  lastModifiedBy?: string | null;
  securityUser?: Pick<ISecurityUser, 'id' | 'login'> | null;
}

export type NewUserAccess = Omit<IUserAccess, 'id'> & { id: null };
