import { ISecurityPermission } from 'app/entities/security-permission/security-permission.model';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';

export interface ISecurityRole {
  id: number;
  name?: string | null;
  description?: string | null;
  lastModified?: string | null;
  lastModifiedBy?: string | null;
  securityPermissions?: Pick<ISecurityPermission, 'id' | 'name'>[] | null;
  securityUsers?: Pick<ISecurityUser, 'id' | 'login'>[] | null;
}

export type NewSecurityRole = Omit<ISecurityRole, 'id'> & { id: null };
