import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITransferDetailsApprovals, NewTransferDetailsApprovals } from '../transfer-details-approvals.model';

export type PartialUpdateTransferDetailsApprovals = Partial<ITransferDetailsApprovals> & Pick<ITransferDetailsApprovals, 'id'>;

type RestOf<T extends ITransferDetailsApprovals | NewTransferDetailsApprovals> = Omit<T, 'approvalDate'> & {
  approvalDate?: string | null;
};

export type RestTransferDetailsApprovals = RestOf<ITransferDetailsApprovals>;

export type NewRestTransferDetailsApprovals = RestOf<NewTransferDetailsApprovals>;

export type PartialUpdateRestTransferDetailsApprovals = RestOf<PartialUpdateTransferDetailsApprovals>;

export type EntityResponseType = HttpResponse<ITransferDetailsApprovals>;
export type EntityArrayResponseType = HttpResponse<ITransferDetailsApprovals[]>;

@Injectable({ providedIn: 'root' })
export class TransferDetailsApprovalsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/transfer-details-approvals');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(transferDetailsApprovals: NewTransferDetailsApprovals): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(transferDetailsApprovals);
    return this.http
      .post<RestTransferDetailsApprovals>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(transferDetailsApprovals: ITransferDetailsApprovals): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(transferDetailsApprovals);
    return this.http
      .put<RestTransferDetailsApprovals>(
        `${this.resourceUrl}/${this.getTransferDetailsApprovalsIdentifier(transferDetailsApprovals)}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(transferDetailsApprovals: PartialUpdateTransferDetailsApprovals): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(transferDetailsApprovals);
    return this.http
      .patch<RestTransferDetailsApprovals>(
        `${this.resourceUrl}/${this.getTransferDetailsApprovalsIdentifier(transferDetailsApprovals)}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTransferDetailsApprovals>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTransferDetailsApprovals[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTransferDetailsApprovalsIdentifier(transferDetailsApprovals: Pick<ITransferDetailsApprovals, 'id'>): number {
    return transferDetailsApprovals.id;
  }

  compareTransferDetailsApprovals(
    o1: Pick<ITransferDetailsApprovals, 'id'> | null,
    o2: Pick<ITransferDetailsApprovals, 'id'> | null
  ): boolean {
    return o1 && o2 ? this.getTransferDetailsApprovalsIdentifier(o1) === this.getTransferDetailsApprovalsIdentifier(o2) : o1 === o2;
  }

  addTransferDetailsApprovalsToCollectionIfMissing<Type extends Pick<ITransferDetailsApprovals, 'id'>>(
    transferDetailsApprovalsCollection: Type[],
    ...transferDetailsApprovalsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const transferDetailsApprovals: Type[] = transferDetailsApprovalsToCheck.filter(isPresent);
    if (transferDetailsApprovals.length > 0) {
      const transferDetailsApprovalsCollectionIdentifiers = transferDetailsApprovalsCollection.map(
        transferDetailsApprovalsItem => this.getTransferDetailsApprovalsIdentifier(transferDetailsApprovalsItem)!
      );
      const transferDetailsApprovalsToAdd = transferDetailsApprovals.filter(transferDetailsApprovalsItem => {
        const transferDetailsApprovalsIdentifier = this.getTransferDetailsApprovalsIdentifier(transferDetailsApprovalsItem);
        if (transferDetailsApprovalsCollectionIdentifiers.includes(transferDetailsApprovalsIdentifier)) {
          return false;
        }
        transferDetailsApprovalsCollectionIdentifiers.push(transferDetailsApprovalsIdentifier);
        return true;
      });
      return [...transferDetailsApprovalsToAdd, ...transferDetailsApprovalsCollection];
    }
    return transferDetailsApprovalsCollection;
  }

  protected convertDateFromClient<
    T extends ITransferDetailsApprovals | NewTransferDetailsApprovals | PartialUpdateTransferDetailsApprovals
  >(transferDetailsApprovals: T): RestOf<T> {
    return {
      ...transferDetailsApprovals,
      approvalDate: transferDetailsApprovals.approvalDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTransferDetailsApprovals: RestTransferDetailsApprovals): ITransferDetailsApprovals {
    return {
      ...restTransferDetailsApprovals,
      approvalDate: restTransferDetailsApprovals.approvalDate ? dayjs(restTransferDetailsApprovals.approvalDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTransferDetailsApprovals>): HttpResponse<ITransferDetailsApprovals> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTransferDetailsApprovals[]>): HttpResponse<ITransferDetailsApprovals[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
