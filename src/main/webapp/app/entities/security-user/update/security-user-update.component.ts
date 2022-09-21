import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SecurityUserFormService, SecurityUserFormGroup } from './security-user-form.service';
import { ISecurityUser } from '../security-user.model';
import { SecurityUserService } from '../service/security-user.service';
import { ISecurityPermission } from 'app/entities/security-permission/security-permission.model';
import { SecurityPermissionService } from 'app/entities/security-permission/service/security-permission.service';
import { ISecurityRole } from 'app/entities/security-role/security-role.model';
import { SecurityRoleService } from 'app/entities/security-role/service/security-role.service';
import { IWareHouse } from 'app/entities/ware-house/ware-house.model';
import { WareHouseService } from 'app/entities/ware-house/service/ware-house.service';

@Component({
  selector: 'jhi-security-user-update',
  templateUrl: './security-user-update.component.html',
})
export class SecurityUserUpdateComponent implements OnInit {
  isSaving = false;
  securityUser: ISecurityUser | null = null;

  securityPermissionsSharedCollection: ISecurityPermission[] = [];
  securityRolesSharedCollection: ISecurityRole[] = [];
  wareHousesSharedCollection: IWareHouse[] = [];

  editForm: SecurityUserFormGroup = this.securityUserFormService.createSecurityUserFormGroup();

  constructor(
    protected securityUserService: SecurityUserService,
    protected securityUserFormService: SecurityUserFormService,
    protected securityPermissionService: SecurityPermissionService,
    protected securityRoleService: SecurityRoleService,
    protected wareHouseService: WareHouseService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSecurityPermission = (o1: ISecurityPermission | null, o2: ISecurityPermission | null): boolean =>
    this.securityPermissionService.compareSecurityPermission(o1, o2);

  compareSecurityRole = (o1: ISecurityRole | null, o2: ISecurityRole | null): boolean =>
    this.securityRoleService.compareSecurityRole(o1, o2);

  compareWareHouse = (o1: IWareHouse | null, o2: IWareHouse | null): boolean => this.wareHouseService.compareWareHouse(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ securityUser }) => {
      this.securityUser = securityUser;
      if (securityUser) {
        this.updateForm(securityUser);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const securityUser = this.securityUserFormService.getSecurityUser(this.editForm);
    if (securityUser.id !== null) {
      this.subscribeToSaveResponse(this.securityUserService.update(securityUser));
    } else {
      this.subscribeToSaveResponse(this.securityUserService.create(securityUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISecurityUser>>): void {
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

  protected updateForm(securityUser: ISecurityUser): void {
    this.securityUser = securityUser;
    this.securityUserFormService.resetForm(this.editForm, securityUser);

    this.securityPermissionsSharedCollection =
      this.securityPermissionService.addSecurityPermissionToCollectionIfMissing<ISecurityPermission>(
        this.securityPermissionsSharedCollection,
        ...(securityUser.securityPermissions ?? [])
      );
    this.securityRolesSharedCollection = this.securityRoleService.addSecurityRoleToCollectionIfMissing<ISecurityRole>(
      this.securityRolesSharedCollection,
      ...(securityUser.securityRoles ?? [])
    );
    this.wareHousesSharedCollection = this.wareHouseService.addWareHouseToCollectionIfMissing<IWareHouse>(
      this.wareHousesSharedCollection,
      ...(securityUser.wareHouses ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.securityPermissionService
      .query()
      .pipe(map((res: HttpResponse<ISecurityPermission[]>) => res.body ?? []))
      .pipe(
        map((securityPermissions: ISecurityPermission[]) =>
          this.securityPermissionService.addSecurityPermissionToCollectionIfMissing<ISecurityPermission>(
            securityPermissions,
            ...(this.securityUser?.securityPermissions ?? [])
          )
        )
      )
      .subscribe((securityPermissions: ISecurityPermission[]) => (this.securityPermissionsSharedCollection = securityPermissions));

    this.securityRoleService
      .query()
      .pipe(map((res: HttpResponse<ISecurityRole[]>) => res.body ?? []))
      .pipe(
        map((securityRoles: ISecurityRole[]) =>
          this.securityRoleService.addSecurityRoleToCollectionIfMissing<ISecurityRole>(
            securityRoles,
            ...(this.securityUser?.securityRoles ?? [])
          )
        )
      )
      .subscribe((securityRoles: ISecurityRole[]) => (this.securityRolesSharedCollection = securityRoles));

    this.wareHouseService
      .query()
      .pipe(map((res: HttpResponse<IWareHouse[]>) => res.body ?? []))
      .pipe(
        map((wareHouses: IWareHouse[]) =>
          this.wareHouseService.addWareHouseToCollectionIfMissing<IWareHouse>(wareHouses, ...(this.securityUser?.wareHouses ?? []))
        )
      )
      .subscribe((wareHouses: IWareHouse[]) => (this.wareHousesSharedCollection = wareHouses));
  }
}
