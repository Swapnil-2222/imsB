import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserAccess, NewUserAccess } from '../user-access.model';

export type PartialUpdateUserAccess = Partial<IUserAccess> & Pick<IUserAccess, 'id'>;

export type EntityResponseType = HttpResponse<IUserAccess>;
export type EntityArrayResponseType = HttpResponse<IUserAccess[]>;

@Injectable({ providedIn: 'root' })
export class UserAccessService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-accesses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userAccess: NewUserAccess): Observable<EntityResponseType> {
    return this.http.post<IUserAccess>(this.resourceUrl, userAccess, { observe: 'response' });
  }

  update(userAccess: IUserAccess): Observable<EntityResponseType> {
    return this.http.put<IUserAccess>(`${this.resourceUrl}/${this.getUserAccessIdentifier(userAccess)}`, userAccess, {
      observe: 'response',
    });
  }

  partialUpdate(userAccess: PartialUpdateUserAccess): Observable<EntityResponseType> {
    return this.http.patch<IUserAccess>(`${this.resourceUrl}/${this.getUserAccessIdentifier(userAccess)}`, userAccess, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserAccess>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserAccess[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserAccessIdentifier(userAccess: Pick<IUserAccess, 'id'>): number {
    return userAccess.id;
  }

  compareUserAccess(o1: Pick<IUserAccess, 'id'> | null, o2: Pick<IUserAccess, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserAccessIdentifier(o1) === this.getUserAccessIdentifier(o2) : o1 === o2;
  }

  addUserAccessToCollectionIfMissing<Type extends Pick<IUserAccess, 'id'>>(
    userAccessCollection: Type[],
    ...userAccessesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userAccesses: Type[] = userAccessesToCheck.filter(isPresent);
    if (userAccesses.length > 0) {
      const userAccessCollectionIdentifiers = userAccessCollection.map(userAccessItem => this.getUserAccessIdentifier(userAccessItem)!);
      const userAccessesToAdd = userAccesses.filter(userAccessItem => {
        const userAccessIdentifier = this.getUserAccessIdentifier(userAccessItem);
        if (userAccessCollectionIdentifiers.includes(userAccessIdentifier)) {
          return false;
        }
        userAccessCollectionIdentifiers.push(userAccessIdentifier);
        return true;
      });
      return [...userAccessesToAdd, ...userAccessCollection];
    }
    return userAccessCollection;
  }
}
