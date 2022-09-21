import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConsumptionDetails, NewConsumptionDetails } from '../consumption-details.model';

export type PartialUpdateConsumptionDetails = Partial<IConsumptionDetails> & Pick<IConsumptionDetails, 'id'>;

type RestOf<T extends IConsumptionDetails | NewConsumptionDetails> = Omit<T, 'comsumptionDate'> & {
  comsumptionDate?: string | null;
};

export type RestConsumptionDetails = RestOf<IConsumptionDetails>;

export type NewRestConsumptionDetails = RestOf<NewConsumptionDetails>;

export type PartialUpdateRestConsumptionDetails = RestOf<PartialUpdateConsumptionDetails>;

export type EntityResponseType = HttpResponse<IConsumptionDetails>;
export type EntityArrayResponseType = HttpResponse<IConsumptionDetails[]>;

@Injectable({ providedIn: 'root' })
export class ConsumptionDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/consumption-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(consumptionDetails: NewConsumptionDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(consumptionDetails);
    return this.http
      .post<RestConsumptionDetails>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(consumptionDetails: IConsumptionDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(consumptionDetails);
    return this.http
      .put<RestConsumptionDetails>(`${this.resourceUrl}/${this.getConsumptionDetailsIdentifier(consumptionDetails)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(consumptionDetails: PartialUpdateConsumptionDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(consumptionDetails);
    return this.http
      .patch<RestConsumptionDetails>(`${this.resourceUrl}/${this.getConsumptionDetailsIdentifier(consumptionDetails)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestConsumptionDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestConsumptionDetails[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getConsumptionDetailsIdentifier(consumptionDetails: Pick<IConsumptionDetails, 'id'>): number {
    return consumptionDetails.id;
  }

  compareConsumptionDetails(o1: Pick<IConsumptionDetails, 'id'> | null, o2: Pick<IConsumptionDetails, 'id'> | null): boolean {
    return o1 && o2 ? this.getConsumptionDetailsIdentifier(o1) === this.getConsumptionDetailsIdentifier(o2) : o1 === o2;
  }

  addConsumptionDetailsToCollectionIfMissing<Type extends Pick<IConsumptionDetails, 'id'>>(
    consumptionDetailsCollection: Type[],
    ...consumptionDetailsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const consumptionDetails: Type[] = consumptionDetailsToCheck.filter(isPresent);
    if (consumptionDetails.length > 0) {
      const consumptionDetailsCollectionIdentifiers = consumptionDetailsCollection.map(
        consumptionDetailsItem => this.getConsumptionDetailsIdentifier(consumptionDetailsItem)!
      );
      const consumptionDetailsToAdd = consumptionDetails.filter(consumptionDetailsItem => {
        const consumptionDetailsIdentifier = this.getConsumptionDetailsIdentifier(consumptionDetailsItem);
        if (consumptionDetailsCollectionIdentifiers.includes(consumptionDetailsIdentifier)) {
          return false;
        }
        consumptionDetailsCollectionIdentifiers.push(consumptionDetailsIdentifier);
        return true;
      });
      return [...consumptionDetailsToAdd, ...consumptionDetailsCollection];
    }
    return consumptionDetailsCollection;
  }

  protected convertDateFromClient<T extends IConsumptionDetails | NewConsumptionDetails | PartialUpdateConsumptionDetails>(
    consumptionDetails: T
  ): RestOf<T> {
    return {
      ...consumptionDetails,
      comsumptionDate: consumptionDetails.comsumptionDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restConsumptionDetails: RestConsumptionDetails): IConsumptionDetails {
    return {
      ...restConsumptionDetails,
      comsumptionDate: restConsumptionDetails.comsumptionDate ? dayjs(restConsumptionDetails.comsumptionDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestConsumptionDetails>): HttpResponse<IConsumptionDetails> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestConsumptionDetails[]>): HttpResponse<IConsumptionDetails[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
