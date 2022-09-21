import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProductTransaction, NewProductTransaction } from '../product-transaction.model';

export type PartialUpdateProductTransaction = Partial<IProductTransaction> & Pick<IProductTransaction, 'id'>;

export type EntityResponseType = HttpResponse<IProductTransaction>;
export type EntityArrayResponseType = HttpResponse<IProductTransaction[]>;

@Injectable({ providedIn: 'root' })
export class ProductTransactionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/product-transactions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(productTransaction: NewProductTransaction): Observable<EntityResponseType> {
    return this.http.post<IProductTransaction>(this.resourceUrl, productTransaction, { observe: 'response' });
  }

  update(productTransaction: IProductTransaction): Observable<EntityResponseType> {
    return this.http.put<IProductTransaction>(
      `${this.resourceUrl}/${this.getProductTransactionIdentifier(productTransaction)}`,
      productTransaction,
      { observe: 'response' }
    );
  }

  partialUpdate(productTransaction: PartialUpdateProductTransaction): Observable<EntityResponseType> {
    return this.http.patch<IProductTransaction>(
      `${this.resourceUrl}/${this.getProductTransactionIdentifier(productTransaction)}`,
      productTransaction,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProductTransaction>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProductTransaction[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProductTransactionIdentifier(productTransaction: Pick<IProductTransaction, 'id'>): number {
    return productTransaction.id;
  }

  compareProductTransaction(o1: Pick<IProductTransaction, 'id'> | null, o2: Pick<IProductTransaction, 'id'> | null): boolean {
    return o1 && o2 ? this.getProductTransactionIdentifier(o1) === this.getProductTransactionIdentifier(o2) : o1 === o2;
  }

  addProductTransactionToCollectionIfMissing<Type extends Pick<IProductTransaction, 'id'>>(
    productTransactionCollection: Type[],
    ...productTransactionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const productTransactions: Type[] = productTransactionsToCheck.filter(isPresent);
    if (productTransactions.length > 0) {
      const productTransactionCollectionIdentifiers = productTransactionCollection.map(
        productTransactionItem => this.getProductTransactionIdentifier(productTransactionItem)!
      );
      const productTransactionsToAdd = productTransactions.filter(productTransactionItem => {
        const productTransactionIdentifier = this.getProductTransactionIdentifier(productTransactionItem);
        if (productTransactionCollectionIdentifiers.includes(productTransactionIdentifier)) {
          return false;
        }
        productTransactionCollectionIdentifiers.push(productTransactionIdentifier);
        return true;
      });
      return [...productTransactionsToAdd, ...productTransactionCollection];
    }
    return productTransactionCollection;
  }
}
