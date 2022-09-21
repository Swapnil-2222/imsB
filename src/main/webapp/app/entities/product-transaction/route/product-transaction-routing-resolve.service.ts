import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProductTransaction } from '../product-transaction.model';
import { ProductTransactionService } from '../service/product-transaction.service';

@Injectable({ providedIn: 'root' })
export class ProductTransactionRoutingResolveService implements Resolve<IProductTransaction | null> {
  constructor(protected service: ProductTransactionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductTransaction | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productTransaction: HttpResponse<IProductTransaction>) => {
          if (productTransaction.body) {
            return of(productTransaction.body);
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
