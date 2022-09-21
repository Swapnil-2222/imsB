import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISecurityRole, NewSecurityRole } from '../security-role.model';

export type PartialUpdateSecurityRole = Partial<ISecurityRole> & Pick<ISecurityRole, 'id'>;

export type EntityResponseType = HttpResponse<ISecurityRole>;
export type EntityArrayResponseType = HttpResponse<ISecurityRole[]>;

@Injectable({ providedIn: 'root' })
export class SecurityRoleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/security-roles');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(securityRole: NewSecurityRole): Observable<EntityResponseType> {
    return this.http.post<ISecurityRole>(this.resourceUrl, securityRole, { observe: 'response' });
  }

  update(securityRole: ISecurityRole): Observable<EntityResponseType> {
    return this.http.put<ISecurityRole>(`${this.resourceUrl}/${this.getSecurityRoleIdentifier(securityRole)}`, securityRole, {
      observe: 'response',
    });
  }

  partialUpdate(securityRole: PartialUpdateSecurityRole): Observable<EntityResponseType> {
    return this.http.patch<ISecurityRole>(`${this.resourceUrl}/${this.getSecurityRoleIdentifier(securityRole)}`, securityRole, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISecurityRole>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISecurityRole[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSecurityRoleIdentifier(securityRole: Pick<ISecurityRole, 'id'>): number {
    return securityRole.id;
  }

  compareSecurityRole(o1: Pick<ISecurityRole, 'id'> | null, o2: Pick<ISecurityRole, 'id'> | null): boolean {
    return o1 && o2 ? this.getSecurityRoleIdentifier(o1) === this.getSecurityRoleIdentifier(o2) : o1 === o2;
  }

  addSecurityRoleToCollectionIfMissing<Type extends Pick<ISecurityRole, 'id'>>(
    securityRoleCollection: Type[],
    ...securityRolesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const securityRoles: Type[] = securityRolesToCheck.filter(isPresent);
    if (securityRoles.length > 0) {
      const securityRoleCollectionIdentifiers = securityRoleCollection.map(
        securityRoleItem => this.getSecurityRoleIdentifier(securityRoleItem)!
      );
      const securityRolesToAdd = securityRoles.filter(securityRoleItem => {
        const securityRoleIdentifier = this.getSecurityRoleIdentifier(securityRoleItem);
        if (securityRoleCollectionIdentifiers.includes(securityRoleIdentifier)) {
          return false;
        }
        securityRoleCollectionIdentifiers.push(securityRoleIdentifier);
        return true;
      });
      return [...securityRolesToAdd, ...securityRoleCollection];
    }
    return securityRoleCollection;
  }
}
