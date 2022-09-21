import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITransferRecieved, NewTransferRecieved } from '../transfer-recieved.model';

export type PartialUpdateTransferRecieved = Partial<ITransferRecieved> & Pick<ITransferRecieved, 'id'>;

type RestOf<T extends ITransferRecieved | NewTransferRecieved> = Omit<T, 'transferDate'> & {
  transferDate?: string | null;
};

export type RestTransferRecieved = RestOf<ITransferRecieved>;

export type NewRestTransferRecieved = RestOf<NewTransferRecieved>;

export type PartialUpdateRestTransferRecieved = RestOf<PartialUpdateTransferRecieved>;

export type EntityResponseType = HttpResponse<ITransferRecieved>;
export type EntityArrayResponseType = HttpResponse<ITransferRecieved[]>;

@Injectable({ providedIn: 'root' })
export class TransferRecievedService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/transfer-recieveds');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(transferRecieved: NewTransferRecieved): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(transferRecieved);
    return this.http
      .post<RestTransferRecieved>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(transferRecieved: ITransferRecieved): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(transferRecieved);
    return this.http
      .put<RestTransferRecieved>(`${this.resourceUrl}/${this.getTransferRecievedIdentifier(transferRecieved)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(transferRecieved: PartialUpdateTransferRecieved): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(transferRecieved);
    return this.http
      .patch<RestTransferRecieved>(`${this.resourceUrl}/${this.getTransferRecievedIdentifier(transferRecieved)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTransferRecieved>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTransferRecieved[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTransferRecievedIdentifier(transferRecieved: Pick<ITransferRecieved, 'id'>): number {
    return transferRecieved.id;
  }

  compareTransferRecieved(o1: Pick<ITransferRecieved, 'id'> | null, o2: Pick<ITransferRecieved, 'id'> | null): boolean {
    return o1 && o2 ? this.getTransferRecievedIdentifier(o1) === this.getTransferRecievedIdentifier(o2) : o1 === o2;
  }

  addTransferRecievedToCollectionIfMissing<Type extends Pick<ITransferRecieved, 'id'>>(
    transferRecievedCollection: Type[],
    ...transferRecievedsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const transferRecieveds: Type[] = transferRecievedsToCheck.filter(isPresent);
    if (transferRecieveds.length > 0) {
      const transferRecievedCollectionIdentifiers = transferRecievedCollection.map(
        transferRecievedItem => this.getTransferRecievedIdentifier(transferRecievedItem)!
      );
      const transferRecievedsToAdd = transferRecieveds.filter(transferRecievedItem => {
        const transferRecievedIdentifier = this.getTransferRecievedIdentifier(transferRecievedItem);
        if (transferRecievedCollectionIdentifiers.includes(transferRecievedIdentifier)) {
          return false;
        }
        transferRecievedCollectionIdentifiers.push(transferRecievedIdentifier);
        return true;
      });
      return [...transferRecievedsToAdd, ...transferRecievedCollection];
    }
    return transferRecievedCollection;
  }

  protected convertDateFromClient<T extends ITransferRecieved | NewTransferRecieved | PartialUpdateTransferRecieved>(
    transferRecieved: T
  ): RestOf<T> {
    return {
      ...transferRecieved,
      transferDate: transferRecieved.transferDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTransferRecieved: RestTransferRecieved): ITransferRecieved {
    return {
      ...restTransferRecieved,
      transferDate: restTransferRecieved.transferDate ? dayjs(restTransferRecieved.transferDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTransferRecieved>): HttpResponse<ITransferRecieved> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTransferRecieved[]>): HttpResponse<ITransferRecieved[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
