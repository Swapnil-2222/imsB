import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUnit } from '../unit.model';
import { UnitService } from '../service/unit.service';

@Injectable({ providedIn: 'root' })
export class UnitRoutingResolveService implements Resolve<IUnit | null> {
  constructor(protected service: UnitService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUnit | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((unit: HttpResponse<IUnit>) => {
          if (unit.body) {
            return of(unit.body);
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
