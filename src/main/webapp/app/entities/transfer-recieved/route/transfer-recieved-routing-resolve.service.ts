import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITransferRecieved } from '../transfer-recieved.model';
import { TransferRecievedService } from '../service/transfer-recieved.service';

@Injectable({ providedIn: 'root' })
export class TransferRecievedRoutingResolveService implements Resolve<ITransferRecieved | null> {
  constructor(protected service: TransferRecievedService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITransferRecieved | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((transferRecieved: HttpResponse<ITransferRecieved>) => {
          if (transferRecieved.body) {
            return of(transferRecieved.body);
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
