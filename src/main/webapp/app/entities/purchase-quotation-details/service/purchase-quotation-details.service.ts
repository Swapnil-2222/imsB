import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPurchaseQuotationDetails, NewPurchaseQuotationDetails } from '../purchase-quotation-details.model';

export type PartialUpdatePurchaseQuotationDetails = Partial<IPurchaseQuotationDetails> & Pick<IPurchaseQuotationDetails, 'id'>;

export type EntityResponseType = HttpResponse<IPurchaseQuotationDetails>;
export type EntityArrayResponseType = HttpResponse<IPurchaseQuotationDetails[]>;

@Injectable({ providedIn: 'root' })
export class PurchaseQuotationDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/purchase-quotation-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(purchaseQuotationDetails: NewPurchaseQuotationDetails): Observable<EntityResponseType> {
    return this.http.post<IPurchaseQuotationDetails>(this.resourceUrl, purchaseQuotationDetails, { observe: 'response' });
  }

  update(purchaseQuotationDetails: IPurchaseQuotationDetails): Observable<EntityResponseType> {
    return this.http.put<IPurchaseQuotationDetails>(
      `${this.resourceUrl}/${this.getPurchaseQuotationDetailsIdentifier(purchaseQuotationDetails)}`,
      purchaseQuotationDetails,
      { observe: 'response' }
    );
  }

  partialUpdate(purchaseQuotationDetails: PartialUpdatePurchaseQuotationDetails): Observable<EntityResponseType> {
    return this.http.patch<IPurchaseQuotationDetails>(
      `${this.resourceUrl}/${this.getPurchaseQuotationDetailsIdentifier(purchaseQuotationDetails)}`,
      purchaseQuotationDetails,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPurchaseQuotationDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPurchaseQuotationDetails[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPurchaseQuotationDetailsIdentifier(purchaseQuotationDetails: Pick<IPurchaseQuotationDetails, 'id'>): number {
    return purchaseQuotationDetails.id;
  }

  comparePurchaseQuotationDetails(
    o1: Pick<IPurchaseQuotationDetails, 'id'> | null,
    o2: Pick<IPurchaseQuotationDetails, 'id'> | null
  ): boolean {
    return o1 && o2 ? this.getPurchaseQuotationDetailsIdentifier(o1) === this.getPurchaseQuotationDetailsIdentifier(o2) : o1 === o2;
  }

  addPurchaseQuotationDetailsToCollectionIfMissing<Type extends Pick<IPurchaseQuotationDetails, 'id'>>(
    purchaseQuotationDetailsCollection: Type[],
    ...purchaseQuotationDetailsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const purchaseQuotationDetails: Type[] = purchaseQuotationDetailsToCheck.filter(isPresent);
    if (purchaseQuotationDetails.length > 0) {
      const purchaseQuotationDetailsCollectionIdentifiers = purchaseQuotationDetailsCollection.map(
        purchaseQuotationDetailsItem => this.getPurchaseQuotationDetailsIdentifier(purchaseQuotationDetailsItem)!
      );
      const purchaseQuotationDetailsToAdd = purchaseQuotationDetails.filter(purchaseQuotationDetailsItem => {
        const purchaseQuotationDetailsIdentifier = this.getPurchaseQuotationDetailsIdentifier(purchaseQuotationDetailsItem);
        if (purchaseQuotationDetailsCollectionIdentifiers.includes(purchaseQuotationDetailsIdentifier)) {
          return false;
        }
        purchaseQuotationDetailsCollectionIdentifiers.push(purchaseQuotationDetailsIdentifier);
        return true;
      });
      return [...purchaseQuotationDetailsToAdd, ...purchaseQuotationDetailsCollection];
    }
    return purchaseQuotationDetailsCollection;
  }
}
