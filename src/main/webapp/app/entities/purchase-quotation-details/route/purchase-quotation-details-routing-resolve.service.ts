import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPurchaseQuotationDetails } from '../purchase-quotation-details.model';
import { PurchaseQuotationDetailsService } from '../service/purchase-quotation-details.service';

@Injectable({ providedIn: 'root' })
export class PurchaseQuotationDetailsRoutingResolveService implements Resolve<IPurchaseQuotationDetails | null> {
  constructor(protected service: PurchaseQuotationDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPurchaseQuotationDetails | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((purchaseQuotationDetails: HttpResponse<IPurchaseQuotationDetails>) => {
          if (purchaseQuotationDetails.body) {
            return of(purchaseQuotationDetails.body);
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
