import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITransferDetails } from '../transfer-details.model';
import { TransferDetailsService } from '../service/transfer-details.service';

@Injectable({ providedIn: 'root' })
export class TransferDetailsRoutingResolveService implements Resolve<ITransferDetails | null> {
  constructor(protected service: TransferDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITransferDetails | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((transferDetails: HttpResponse<ITransferDetails>) => {
          if (transferDetails.body) {
            return of(transferDetails.body);
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
