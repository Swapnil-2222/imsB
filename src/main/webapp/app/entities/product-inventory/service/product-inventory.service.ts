import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProductInventory, NewProductInventory } from '../product-inventory.model';

export type PartialUpdateProductInventory = Partial<IProductInventory> & Pick<IProductInventory, 'id'>;

type RestOf<T extends IProductInventory | NewProductInventory> = Omit<T, 'inwardOutwardDate' | 'expiryDate'> & {
  inwardOutwardDate?: string | null;
  expiryDate?: string | null;
};

export type RestProductInventory = RestOf<IProductInventory>;

export type NewRestProductInventory = RestOf<NewProductInventory>;

export type PartialUpdateRestProductInventory = RestOf<PartialUpdateProductInventory>;

export type EntityResponseType = HttpResponse<IProductInventory>;
export type EntityArrayResponseType = HttpResponse<IProductInventory[]>;

@Injectable({ providedIn: 'root' })
export class ProductInventoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/product-inventories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(productInventory: NewProductInventory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productInventory);
    return this.http
      .post<RestProductInventory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(productInventory: IProductInventory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productInventory);
    return this.http
      .put<RestProductInventory>(`${this.resourceUrl}/${this.getProductInventoryIdentifier(productInventory)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(productInventory: PartialUpdateProductInventory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productInventory);
    return this.http
      .patch<RestProductInventory>(`${this.resourceUrl}/${this.getProductInventoryIdentifier(productInventory)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProductInventory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProductInventory[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProductInventoryIdentifier(productInventory: Pick<IProductInventory, 'id'>): number {
    return productInventory.id;
  }

  compareProductInventory(o1: Pick<IProductInventory, 'id'> | null, o2: Pick<IProductInventory, 'id'> | null): boolean {
    return o1 && o2 ? this.getProductInventoryIdentifier(o1) === this.getProductInventoryIdentifier(o2) : o1 === o2;
  }

  addProductInventoryToCollectionIfMissing<Type extends Pick<IProductInventory, 'id'>>(
    productInventoryCollection: Type[],
    ...productInventoriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const productInventories: Type[] = productInventoriesToCheck.filter(isPresent);
    if (productInventories.length > 0) {
      const productInventoryCollectionIdentifiers = productInventoryCollection.map(
        productInventoryItem => this.getProductInventoryIdentifier(productInventoryItem)!
      );
      const productInventoriesToAdd = productInventories.filter(productInventoryItem => {
        const productInventoryIdentifier = this.getProductInventoryIdentifier(productInventoryItem);
        if (productInventoryCollectionIdentifiers.includes(productInventoryIdentifier)) {
          return false;
        }
        productInventoryCollectionIdentifiers.push(productInventoryIdentifier);
        return true;
      });
      return [...productInventoriesToAdd, ...productInventoryCollection];
    }
    return productInventoryCollection;
  }

  protected convertDateFromClient<T extends IProductInventory | NewProductInventory | PartialUpdateProductInventory>(
    productInventory: T
  ): RestOf<T> {
    return {
      ...productInventory,
      inwardOutwardDate: productInventory.inwardOutwardDate?.toJSON() ?? null,
      expiryDate: productInventory.expiryDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restProductInventory: RestProductInventory): IProductInventory {
    return {
      ...restProductInventory,
      inwardOutwardDate: restProductInventory.inwardOutwardDate ? dayjs(restProductInventory.inwardOutwardDate) : undefined,
      expiryDate: restProductInventory.expiryDate ? dayjs(restProductInventory.expiryDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProductInventory>): HttpResponse<IProductInventory> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProductInventory[]>): HttpResponse<IProductInventory[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
