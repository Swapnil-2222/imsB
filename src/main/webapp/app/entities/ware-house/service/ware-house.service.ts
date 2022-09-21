import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWareHouse, NewWareHouse } from '../ware-house.model';

export type PartialUpdateWareHouse = Partial<IWareHouse> & Pick<IWareHouse, 'id'>;

export type EntityResponseType = HttpResponse<IWareHouse>;
export type EntityArrayResponseType = HttpResponse<IWareHouse[]>;

@Injectable({ providedIn: 'root' })
export class WareHouseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ware-houses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(wareHouse: NewWareHouse): Observable<EntityResponseType> {
    return this.http.post<IWareHouse>(this.resourceUrl, wareHouse, { observe: 'response' });
  }

  update(wareHouse: IWareHouse): Observable<EntityResponseType> {
    return this.http.put<IWareHouse>(`${this.resourceUrl}/${this.getWareHouseIdentifier(wareHouse)}`, wareHouse, { observe: 'response' });
  }

  partialUpdate(wareHouse: PartialUpdateWareHouse): Observable<EntityResponseType> {
    return this.http.patch<IWareHouse>(`${this.resourceUrl}/${this.getWareHouseIdentifier(wareHouse)}`, wareHouse, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IWareHouse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IWareHouse[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getWareHouseIdentifier(wareHouse: Pick<IWareHouse, 'id'>): number {
    return wareHouse.id;
  }

  compareWareHouse(o1: Pick<IWareHouse, 'id'> | null, o2: Pick<IWareHouse, 'id'> | null): boolean {
    return o1 && o2 ? this.getWareHouseIdentifier(o1) === this.getWareHouseIdentifier(o2) : o1 === o2;
  }

  addWareHouseToCollectionIfMissing<Type extends Pick<IWareHouse, 'id'>>(
    wareHouseCollection: Type[],
    ...wareHousesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const wareHouses: Type[] = wareHousesToCheck.filter(isPresent);
    if (wareHouses.length > 0) {
      const wareHouseCollectionIdentifiers = wareHouseCollection.map(wareHouseItem => this.getWareHouseIdentifier(wareHouseItem)!);
      const wareHousesToAdd = wareHouses.filter(wareHouseItem => {
        const wareHouseIdentifier = this.getWareHouseIdentifier(wareHouseItem);
        if (wareHouseCollectionIdentifiers.includes(wareHouseIdentifier)) {
          return false;
        }
        wareHouseCollectionIdentifiers.push(wareHouseIdentifier);
        return true;
      });
      return [...wareHousesToAdd, ...wareHouseCollection];
    }
    return wareHouseCollection;
  }
}
