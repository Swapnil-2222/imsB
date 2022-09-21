import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConsumptionDetails } from '../consumption-details.model';
import { ConsumptionDetailsService } from '../service/consumption-details.service';

@Injectable({ providedIn: 'root' })
export class ConsumptionDetailsRoutingResolveService implements Resolve<IConsumptionDetails | null> {
  constructor(protected service: ConsumptionDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IConsumptionDetails | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((consumptionDetails: HttpResponse<IConsumptionDetails>) => {
          if (consumptionDetails.body) {
            return of(consumptionDetails.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
