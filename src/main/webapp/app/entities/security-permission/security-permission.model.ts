import { ISecurityRole } from 'app/entities/security-role/security-role.model';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';

export interface ISecurityPermission {
  id: number;
  name?: string | null;
  description?: string | null;
  lastModified?: string | null;
  lastModifiedBy?: string | null;
  securityRoles?: Pick<ISecurityRole, 'id' | 'name'>[] | null;
  securityUsers?: Pick<ISecurityUser, 'id' | 'login'>[] | null;
}

export type NewSecurityPermission = Omit<ISecurityPermission, 'id'> & { id: null };
