import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITransferDetails, NewTransferDetails } from '../transfer-details.model';

export type PartialUpdateTransferDetails = Partial<ITransferDetails> & Pick<ITransferDetails, 'id'>;

type RestOf<T extends ITransferDetails | NewTransferDetails> = Omit<T, 'approvalDate'> & {
  approvalDate?: string | null;
};

export type RestTransferDetails = RestOf<ITransferDetails>;

export type NewRestTransferDetails = RestOf<NewTransferDetails>;

export type PartialUpdateRestTransferDetails = RestOf<PartialUpdateTransferDetails>;

export type EntityResponseType = HttpResponse<ITransferDetails>;
export type EntityArrayResponseType = HttpResponse<ITransferDetails[]>;

@Injectable({ providedIn: 'root' })
export class TransferDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/transfer-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(transferDetails: NewTransferDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(transferDetails);
    return this.http
      .post<RestTransferDetails>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(transferDetails: ITransferDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(transferDetails);
    return this.http
      .put<RestTransferDetails>(`${this.resourceUrl}/${this.getTransferDetailsIdentifier(transferDetails)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(transferDetails: PartialUpdateTransferDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(transferDetails);
    return this.http
      .patch<RestTransferDetails>(`${this.resourceUrl}/${this.getTransferDetailsIdentifier(transferDetails)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTransferDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTransferDetails[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTransferDetailsIdentifier(transferDetails: Pick<ITransferDetails, 'id'>): number {
    return transferDetails.id;
  }

  compareTransferDetails(o1: Pick<ITransferDetails, 'id'> | null, o2: Pick<ITransferDetails, 'id'> | null): boolean {
    return o1 && o2 ? this.getTransferDetailsIdentifier(o1) === this.getTransferDetailsIdentifier(o2) : o1 === o2;
  }

  addTransferDetailsToCollectionIfMissing<Type extends Pick<ITransferDetails, 'id'>>(
    transferDetailsCollection: Type[],
    ...transferDetailsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const transferDetails: Type[] = transferDetailsToCheck.filter(isPresent);
    if (transferDetails.length > 0) {
      const transferDetailsCollectionIdentifiers = transferDetailsCollection.map(
        transferDetailsItem => this.getTransferDetailsIdentifier(transferDetailsItem)!
      );
      const transferDetailsToAdd = transferDetails.filter(transferDetailsItem => {
        const transferDetailsIdentifier = this.getTransferDetailsIdentifier(transferDetailsItem);
        if (transferDetailsCollectionIdentifiers.includes(transferDetailsIdentifier)) {
          return false;
        }
        transferDetailsCollectionIdentifiers.push(transferDetailsIdentifier);
        return true;
      });
      return [...transferDetailsToAdd, ...transferDetailsCollection];
    }
    return transferDetailsCollection;
  }

  protected convertDateFromClient<T extends ITransferDetails | NewTransferDetails | PartialUpdateTransferDetails>(
    transferDetails: T
  ): RestOf<T> {
    return {
      ...transferDetails,
      approvalDate: transferDetails.approvalDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTransferDetails: RestTransferDetails): ITransferDetails {
    return {
      ...restTransferDetails,
      approvalDate: restTransferDetails.approvalDate ? dayjs(restTransferDetails.approvalDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTransferDetails>): HttpResponse<ITransferDetails> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTransferDetails[]>): HttpResponse<ITransferDetails[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
