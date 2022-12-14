import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IWareHouse } from '../ware-house.model';
import { WareHouseService } from '../service/ware-house.service';

@Injectable({ providedIn: 'root' })
export class WareHouseRoutingResolveService implements Resolve<IWareHouse | null> {
  constructor(protected service: WareHouseService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IWareHouse | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((wareHouse: HttpResponse<IWareHouse>) => {
          if (wareHouse.body) {
            return of(wareHouse.body);
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
