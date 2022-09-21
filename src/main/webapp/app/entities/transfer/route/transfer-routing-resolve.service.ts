import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITransfer } from '../transfer.model';
import { TransferService } from '../service/transfer.service';

@Injectable({ providedIn: 'root' })
export class TransferRoutingResolveService implements Resolve<ITransfer | null> {
  constructor(protected service: TransferService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITransfer | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((transfer: HttpResponse<ITransfer>) => {
          if (transfer.body) {
            return of(transfer.body);
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
