import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ConsumptionDetailsFormService, ConsumptionDetailsFormGroup } from './consumption-details-form.service';
import { IConsumptionDetails } from '../consumption-details.model';
import { ConsumptionDetailsService } from '../service/consumption-details.service';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { SecurityUserService } from 'app/entities/security-user/service/security-user.service';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';
import { IProductInventory } from 'app/entities/product-inventory/product-inventory.model';
import { ProductInventoryService } from 'app/entities/product-inventory/service/product-inventory.service';

@Component({
  selector: 'jhi-consumption-details-update',
  templateUrl: './consumption-details-update.component.html',
})
export class ConsumptionDetailsUpdateComponent implements OnInit {
  isSaving = false;
  consumptionDetails: IConsumptionDetails | null = null;

  securityUsersSharedCollection: ISecurityUser[] = [];
  projectsSharedCollection: IProject[] = [];
  productInventoriesSharedCollection: IProductInventory[] = [];

  editForm: ConsumptionDetailsFormGroup = this.consumptionDetailsFormService.createConsumptionDetailsFormGroup();

  constructor(
    protected consumptionDetailsService: ConsumptionDetailsService,
    protected consumptionDetailsFormService: ConsumptionDetailsFormService,
    protected securityUserService: SecurityUserService,
    protected projectService: ProjectService,
    protected productInventoryService: ProductInventoryService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSecurityUser = (o1: ISecurityUser | null, o2: ISecurityUser | null): boolean =>
    this.securityUserService.compareSecurityUser(o1, o2);

  compareProject = (o1: IProject | null, o2: IProject | null): boolean => this.projectService.compareProject(o1, o2);

  compareProductInventory = (o1: IProductInventory | null, o2: IProductInventory | null): boolean =>
    this.productInventoryService.compareProductInventory(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ consumptionDetails }) => {
      this.consumptionDetails = consumptionDetails;
      if (consumptionDetails) {
        this.updateForm(consumptionDetails);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const consumptionDetails = this.consumptionDetailsFormService.getConsumptionDetails(this.editForm);
    if (consumptionDetails.id !== null) {
      this.subscribeToSaveResponse(this.consumptionDetailsService.update(consumptionDetails));
    } else {
      this.subscribeToSaveResponse(this.consumptionDetailsService.create(consumptionDetails));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConsumptionDetails>>): void {
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

  protected updateForm(consumptionDetails: IConsumptionDetails): void {
    this.consumptionDetails = consumptionDetails;
    this.consumptionDetailsFormService.resetForm(this.editForm, consumptionDetails);

    this.securityUsersSharedCollection = this.securityUserService.addSecurityUserToCollectionIfMissing<ISecurityUser>(
      this.securityUsersSharedCollection,
      consumptionDetails.securityUser
    );
    this.projectsSharedCollection = this.projectService.addProjectToCollectionIfMissing<IProject>(
      this.projectsSharedCollection,
      consumptionDetails.project
    );
    this.productInventoriesSharedCollection = this.productInventoryService.addProductInventoryToCollectionIfMissing<IProductInventory>(
      this.productInventoriesSharedCollection,
      consumptionDetails.productInventory
    );
  }

  protected loadRelationshipsOptions(): void {
    this.securityUserService
      .query()
      .pipe(map((res: HttpResponse<ISecurityUser[]>) => res.body ?? []))
      .pipe(
        map((securityUsers: ISecurityUser[]) =>
          this.securityUserService.addSecurityUserToCollectionIfMissing<ISecurityUser>(securityUsers, this.consumptionDetails?.securityUser)
        )
      )
      .subscribe((securityUsers: ISecurityUser[]) => (this.securityUsersSharedCollection = securityUsers));

    this.projectService
      .query()
      .pipe(map((res: HttpResponse<IProject[]>) => res.body ?? []))
      .pipe(
        map((projects: IProject[]) =>
          this.projectService.addProjectToCollectionIfMissing<IProject>(projects, this.consumptionDetails?.project)
        )
      )
      .subscribe((projects: IProject[]) => (this.projectsSharedCollection = projects));

    this.productInventoryService
      .query()
      .pipe(map((res: HttpResponse<IProductInventory[]>) => res.body ?? []))
      .pipe(
        map((productInventories: IProductInventory[]) =>
          this.productInventoryService.addProductInventoryToCollectionIfMissing<IProductInventory>(
            productInventories,
            this.consumptionDetails?.productInventory
          )
        )
      )
      .subscribe((productInventories: IProductInventory[]) => (this.productInventoriesSharedCollection = productInventories));
  }
}
