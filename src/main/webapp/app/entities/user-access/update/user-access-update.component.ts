import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserAccessFormService, UserAccessFormGroup } from './user-access-form.service';
import { IUserAccess } from '../user-access.model';
import { UserAccessService } from '../service/user-access.service';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { SecurityUserService } from 'app/entities/security-user/service/security-user.service';
import { AccessLevel } from 'app/entities/enumerations/access-level.model';

@Component({
  selector: 'jhi-user-access-update',
  templateUrl: './user-access-update.component.html',
})
export class UserAccessUpdateComponent implements OnInit {
  isSaving = false;
  userAccess: IUserAccess | null = null;
  accessLevelValues = Object.keys(AccessLevel);

  securityUsersSharedCollection: ISecurityUser[] = [];

  editForm: UserAccessFormGroup = this.userAccessFormService.createUserAccessFormGroup();

  constructor(
    protected userAccessService: UserAccessService,
    protected userAccessFormService: UserAccessFormService,
    protected securityUserService: SecurityUserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSecurityUser = (o1: ISecurityUser | null, o2: ISecurityUser | null): boolean =>
    this.securityUserService.compareSecurityUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userAccess }) => {
      this.userAccess = userAccess;
      if (userAccess) {
        this.updateForm(userAccess);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userAccess = this.userAccessFormService.getUserAccess(this.editForm);
    if (userAccess.id !== null) {
      this.subscribeToSaveResponse(this.userAccessService.update(userAccess));
    } else {
      this.subscribeToSaveResponse(this.userAccessService.create(userAccess));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserAccess>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(userAccess: IUserAccess): void {
    this.userAccess = userAccess;
    this.userAccessFormService.resetForm(this.editForm, userAccess);

    this.securityUsersSharedCollection = this.securityUserService.addSecurityUserToCollectionIfMissing<ISecurityUser>(
      this.securityUsersSharedCollection,
      userAccess.securityUser
    );
  }

  protected loadRelationshipsOptions(): void {
    this.securityUserService
      .query()
      .pipe(map((res: HttpResponse<ISecurityUser[]>) => res.body ?? []))
      .pipe(
        map((securityUsers: ISecurityUser[]) =>
          this.securityUserService.addSecurityUserToCollectionIfMissing<ISecurityUser>(securityUsers, this.userAccess?.securityUser)
        )
      )
      .subscribe((securityUsers: ISecurityUser[]) => (this.securityUsersSharedCollection = securityUsers));
  }
}
