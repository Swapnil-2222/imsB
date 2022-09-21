import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPurchaseQuotation, NewPurchaseQuotation } from '../purchase-quotation.model';

export type PartialUpdatePurchaseQuotation = Partial<IPurchaseQuotation> & Pick<IPurchaseQuotation, 'id'>;

type RestOf<T extends IPurchaseQuotation | NewPurchaseQuotation> = Omit<T, 'expectedDeliveryDate' | 'poDate'> & {
  expectedDeliveryDate?: string | null;
  poDate?: string | null;
};

export type RestPurchaseQuotation = RestOf<IPurchaseQuotation>;

export type NewRestPurchaseQuotation = RestOf<NewPurchaseQuotation>;

export type PartialUpdateRestPurchaseQuotation = RestOf<PartialUpdatePurchaseQuotation>;

export type EntityResponseType = HttpResponse<IPurchaseQuotation>;
export type EntityArrayResponseType = HttpResponse<IPurchaseQuotation[]>;

@Injectable({ providedIn: 'root' })
export class PurchaseQuotationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/purchase-quotations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(purchaseQuotation: NewPurchaseQuotation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(purchaseQuotation);
    return this.http
      .post<RestPurchaseQuotation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(purchaseQuotation: IPurchaseQuotation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(purchaseQuotation);
    return this.http
      .put<RestPurchaseQuotation>(`${this.resourceUrl}/${this.getPurchaseQuotationIdentifier(purchaseQuotation)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(purchaseQuotation: PartialUpdatePurchaseQuotation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(purchaseQuotation);
    return this.http
      .patch<RestPurchaseQuotation>(`${this.resourceUrl}/${this.getPurchaseQuotationIdentifier(purchaseQuotation)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPurchaseQuotation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPurchaseQuotation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPurchaseQuotationIdentifier(purchaseQuotation: Pick<IPurchaseQuotation, 'id'>): number {
    return purchaseQuotation.id;
  }

  comparePurchaseQuotation(o1: Pick<IPurchaseQuotation, 'id'> | null, o2: Pick<IPurchaseQuotation, 'id'> | null): boolean {
    return o1 && o2 ? this.getPurchaseQuotationIdentifier(o1) === this.getPurchaseQuotationIdentifier(o2) : o1 === o2;
  }

  addPurchaseQuotationToCollectionIfMissing<Type extends Pick<IPurchaseQuotation, 'id'>>(
    purchaseQuotationCollection: Type[],
    ...purchaseQuotationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const purchaseQuotations: Type[] = purchaseQuotationsToCheck.filter(isPresent);
    if (purchaseQuotations.length > 0) {
      const purchaseQuotationCollectionIdentifiers = purchaseQuotationCollection.map(
        purchaseQuotationItem => this.getPurchaseQuotationIdentifier(purchaseQuotationItem)!
      );
      const purchaseQuotationsToAdd = purchaseQuotations.filter(purchaseQuotationItem => {
        const purchaseQuotationIdentifier = this.getPurchaseQuotationIdentifier(purchaseQuotationItem);
        if (purchaseQuotationCollectionIdentifiers.includes(purchaseQuotationIdentifier)) {
          return false;
        }
        purchaseQuotationCollectionIdentifiers.push(purchaseQuotationIdentifier);
        return true;
      });
      return [...purchaseQuotationsToAdd, ...purchaseQuotationCollection];
    }
    return purchaseQuotationCollection;
  }

  protected convertDateFromClient<T extends IPurchaseQuotation | NewPurchaseQuotation | PartialUpdatePurchaseQuotation>(
    purchaseQuotation: T
  ): RestOf<T> {
    return {
      ...purchaseQuotation,
      expectedDeliveryDate: purchaseQuotation.expectedDeliveryDate?.toJSON() ?? null,
      poDate: purchaseQuotation.poDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPurchaseQuotation: RestPurchaseQuotation): IPurchaseQuotation {
    return {
      ...restPurchaseQuotation,
      expectedDeliveryDate: restPurchaseQuotation.expectedDeliveryDate ? dayjs(restPurchaseQuotation.expectedDeliveryDate) : undefined,
      poDate: restPurchaseQuotation.poDate ? dayjs(restPurchaseQuotation.poDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPurchaseQuotation>): HttpResponse<IPurchaseQuotation> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPurchaseQuotation[]>): HttpResponse<IPurchaseQuotation[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
