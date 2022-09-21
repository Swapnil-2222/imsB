import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITransfer, NewTransfer } from '../transfer.model';

export type PartialUpdateTransfer = Partial<ITransfer> & Pick<ITransfer, 'id'>;

type RestOf<T extends ITransfer | NewTransfer> = Omit<T, 'tranferDate'> & {
  tranferDate?: string | null;
};

export type RestTransfer = RestOf<ITransfer>;

export type NewRestTransfer = RestOf<NewTransfer>;

export type PartialUpdateRestTransfer = RestOf<PartialUpdateTransfer>;

export type EntityResponseType = HttpResponse<ITransfer>;
export type EntityArrayResponseType = HttpResponse<ITransfer[]>;

@Injectable({ providedIn: 'root' })
export class TransferService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/transfers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(transfer: NewTransfer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(transfer);
    return this.http
      .post<RestTransfer>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(transfer: ITransfer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(transfer);
    return this.http
      .put<RestTransfer>(`${this.resourceUrl}/${this.getTransferIdentifier(transfer)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(transfer: PartialUpdateTransfer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(transfer);
    return this.http
      .patch<RestTransfer>(`${this.resourceUrl}/${this.getTransferIdentifier(transfer)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTransfer>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTransfer[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTransferIdentifier(transfer: Pick<ITransfer, 'id'>): number {
    return transfer.id;
  }

  compareTransfer(o1: Pick<ITransfer, 'id'> | null, o2: Pick<ITransfer, 'id'> | null): boolean {
    return o1 && o2 ? this.getTransferIdentifier(o1) === this.getTransferIdentifier(o2) : o1 === o2;
  }

  addTransferToCollectionIfMissing<Type extends Pick<ITransfer, 'id'>>(
    transferCollection: Type[],
    ...transfersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const transfers: Type[] = transfersToCheck.filter(isPresent);
    if (transfers.length > 0) {
      const transferCollectionIdentifiers = transferCollection.map(transferItem => this.getTransferIdentifier(transferItem)!);
      const transfersToAdd = transfers.filter(transferItem => {
        const transferIdentifier = this.getTransferIdentifier(transferItem);
        if (transferCollectionIdentifiers.includes(transferIdentifier)) {
          return false;
        }
        transferCollectionIdentifiers.push(transferIdentifier);
        return true;
      });
      return [...transfersToAdd, ...transferCollection];
    }
    return transferCollection;
  }

  protected convertDateFromClient<T extends ITransfer | NewTransfer | PartialUpdateTransfer>(transfer: T): RestOf<T> {
    return {
      ...transfer,
      tranferDate: transfer.tranferDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTransfer: RestTransfer): ITransfer {
    return {
      ...restTransfer,
      tranferDate: restTransfer.tranferDate ? dayjs(restTransfer.tranferDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTransfer>): HttpResponse<ITransfer> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTransfer[]>): HttpResponse<ITransfer[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
