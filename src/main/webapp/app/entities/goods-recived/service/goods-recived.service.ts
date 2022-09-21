import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGoodsRecived, NewGoodsRecived } from '../goods-recived.model';

export type PartialUpdateGoodsRecived = Partial<IGoodsRecived> & Pick<IGoodsRecived, 'id'>;

type RestOf<T extends IGoodsRecived | NewGoodsRecived> = Omit<T, 'grDate' | 'manufacturingDate' | 'expiryDate'> & {
  grDate?: string | null;
  manufacturingDate?: string | null;
  expiryDate?: string | null;
};

export type RestGoodsRecived = RestOf<IGoodsRecived>;

export type NewRestGoodsRecived = RestOf<NewGoodsRecived>;

export type PartialUpdateRestGoodsRecived = RestOf<PartialUpdateGoodsRecived>;

export type EntityResponseType = HttpResponse<IGoodsRecived>;
export type EntityArrayResponseType = HttpResponse<IGoodsRecived[]>;

@Injectable({ providedIn: 'root' })
export class GoodsRecivedService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/goods-reciveds');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(goodsRecived: NewGoodsRecived): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(goodsRecived);
    return this.http
      .post<RestGoodsRecived>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(goodsRecived: IGoodsRecived): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(goodsRecived);
    return this.http
      .put<RestGoodsRecived>(`${this.resourceUrl}/${this.getGoodsRecivedIdentifier(goodsRecived)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(goodsRecived: PartialUpdateGoodsRecived): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(goodsRecived);
    return this.http
      .patch<RestGoodsRecived>(`${this.resourceUrl}/${this.getGoodsRecivedIdentifier(goodsRecived)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestGoodsRecived>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestGoodsRecived[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGoodsRecivedIdentifier(goodsRecived: Pick<IGoodsRecived, 'id'>): number {
    return goodsRecived.id;
  }

  compareGoodsRecived(o1: Pick<IGoodsRecived, 'id'> | null, o2: Pick<IGoodsRecived, 'id'> | null): boolean {
    return o1 && o2 ? this.getGoodsRecivedIdentifier(o1) === this.getGoodsRecivedIdentifier(o2) : o1 === o2;
  }

  addGoodsRecivedToCollectionIfMissing<Type extends Pick<IGoodsRecived, 'id'>>(
    goodsRecivedCollection: Type[],
    ...goodsRecivedsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const goodsReciveds: Type[] = goodsRecivedsToCheck.filter(isPresent);
    if (goodsReciveds.length > 0) {
      const goodsRecivedCollectionIdentifiers = goodsRecivedCollection.map(
        goodsRecivedItem => this.getGoodsRecivedIdentifier(goodsRecivedItem)!
      );
      const goodsRecivedsToAdd = goodsReciveds.filter(goodsRecivedItem => {
        const goodsRecivedIdentifier = this.getGoodsRecivedIdentifier(goodsRecivedItem);
        if (goodsRecivedCollectionIdentifiers.includes(goodsRecivedIdentifier)) {
          return false;
        }
        goodsRecivedCollectionIdentifiers.push(goodsRecivedIdentifier);
        return true;
      });
      return [...goodsRecivedsToAdd, ...goodsRecivedCollection];
    }
    return goodsRecivedCollection;
  }

  protected convertDateFromClient<T extends IGoodsRecived | NewGoodsRecived | PartialUpdateGoodsRecived>(goodsRecived: T): RestOf<T> {
    return {
      ...goodsRecived,
      grDate: goodsRecived.grDate?.toJSON() ?? null,
      manufacturingDate: goodsRecived.manufacturingDate?.toJSON() ?? null,
      expiryDate: goodsRecived.expiryDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restGoodsRecived: RestGoodsRecived): IGoodsRecived {
    return {
      ...restGoodsRecived,
      grDate: restGoodsRecived.grDate ? dayjs(restGoodsRecived.grDate) : undefined,
      manufacturingDate: restGoodsRecived.manufacturingDate ? dayjs(restGoodsRecived.manufacturingDate) : undefined,
      expiryDate: restGoodsRecived.expiryDate ? dayjs(restGoodsRecived.expiryDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestGoodsRecived>): HttpResponse<IGoodsRecived> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestGoodsRecived[]>): HttpResponse<IGoodsRecived[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
