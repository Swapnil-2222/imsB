import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISecurityPermission, NewSecurityPermission } from '../security-permission.model';

export type PartialUpdateSecurityPermission = Partial<ISecurityPermission> & Pick<ISecurityPermission, 'id'>;

export type EntityResponseType = HttpResponse<ISecurityPermission>;
export type EntityArrayResponseType = HttpResponse<ISecurityPermission[]>;

@Injectable({ providedIn: 'root' })
export class SecurityPermissionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/security-permissions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(securityPermission: NewSecurityPermission): Observable<EntityResponseType> {
    return this.http.post<ISecurityPermission>(this.resourceUrl, securityPermission, { observe: 'response' });
  }

  update(securityPermission: ISecurityPermission): Observable<EntityResponseType> {
    return this.http.put<ISecurityPermission>(
      `${this.resourceUrl}/${this.getSecurityPermissionIdentifier(securityPermission)}`,
      securityPermission,
      { observe: 'response' }
    );
  }

  partialUpdate(securityPermission: PartialUpdateSecurityPermission): Observable<EntityResponseType> {
    return this.http.patch<ISecurityPermission>(
      `${this.resourceUrl}/${this.getSecurityPermissionIdentifier(securityPermission)}`,
      securityPermission,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISecurityPermission>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISecurityPermission[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSecurityPermissionIdentifier(securityPermission: Pick<ISecurityPermission, 'id'>): number {
    return securityPermission.id;
  }

  compareSecurityPermission(o1: Pick<ISecurityPermission, 'id'> | null, o2: Pick<ISecurityPermission, 'id'> | null): boolean {
    return o1 && o2 ? this.getSecurityPermissionIdentifier(o1) === this.getSecurityPermissionIdentifier(o2) : o1 === o2;
  }

  addSecurityPermissionToCollectionIfMissing<Type extends Pick<ISecurityPermission, 'id'>>(
    securityPermissionCollection: Type[],
    ...securityPermissionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const securityPermissions: Type[] = securityPermissionsToCheck.filter(isPresent);
    if (securityPermissions.length > 0) {
      const securityPermissionCollectionIdentifiers = securityPermissionCollection.map(
        securityPermissionItem => this.getSecurityPermissionIdentifier(securityPermissionItem)!
      );
      const securityPermissionsToAdd = securityPermissions.filter(securityPermissionItem => {
        const securityPermissionIdentifier = this.getSecurityPermissionIdentifier(securityPermissionItem);
        if (securityPermissionCollectionIdentifiers.includes(securityPermissionIdentifier)) {
          return false;
        }
        securityPermissionCollectionIdentifiers.push(securityPermissionIdentifier);
        return true;
      });
      return [...securityPermissionsToAdd, ...securityPermissionCollection];
    }
    return securityPermissionCollection;
  }
}
