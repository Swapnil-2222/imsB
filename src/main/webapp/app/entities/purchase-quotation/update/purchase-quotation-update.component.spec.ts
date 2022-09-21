import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PurchaseQuotationFormService } from './purchase-quotation-form.service';
import { PurchaseQuotationService } from '../service/purchase-quotation.service';
import { IPurchaseQuotation } from '../purchase-quotation.model';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { SecurityUserService } from 'app/entities/security-user/service/security-user.service';

import { PurchaseQuotationUpdateComponent } from './purchase-quotation-update.component';

describe('PurchaseQuotation Management Update Component', () => {
  let comp: PurchaseQuotationUpdateComponent;
  let fixture: ComponentFixture<PurchaseQuotationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let purchaseQuotationFormService: PurchaseQuotationFormService;
  let purchaseQuotationService: PurchaseQuotationService;
  let securityUserService: SecurityUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PurchaseQuotationUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PurchaseQuotationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PurchaseQuotationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    purchaseQuotationFormService = TestBed.inject(PurchaseQuotationFormService);
    purchaseQuotationService = TestBed.inject(PurchaseQuotationService);
    securityUserService = TestBed.inject(SecurityUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call SecurityUser query and add missing value', () => {
      const purchaseQuotation: IPurchaseQuotation = { id: 456 };
      const securityUser: ISecurityUser = { id: 16779 };
      purchaseQuotation.securityUser = securityUser;

      const securityUserCollection: ISecurityUser[] = [{ id: 6187 }];
      jest.spyOn(securityUserService, 'query').mockReturnValue(of(new HttpResponse({ body: securityUserCollection })));
      const additionalSecurityUsers = [securityUser];
      const expectedCollection: ISecurityUser[] = [...additionalSecurityUsers, ...securityUserCollection];
      jest.spyOn(securityUserService, 'addSecurityUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ purchaseQuotation });
      comp.ngOnInit();

      expect(securityUserService.query).toHaveBeenCalled();
      expect(securityUserService.addSecurityUserToCollectionIfMissing).toHaveBeenCalledWith(
        securityUserCollection,
        ...additionalSecurityUsers.map(expect.objectContaining)
      );
      expect(comp.securityUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const purchaseQuotation: IPurchaseQuotation = { id: 456 };
      const securityUser: ISecurityUser = { id: 32982 };
      purchaseQuotation.securityUser = securityUser;

      activatedRoute.data = of({ purchaseQuotation });
      comp.ngOnInit();

      expect(comp.securityUsersSharedCollection).toContain(securityUser);
      expect(comp.purchaseQuotation).toEqual(purchaseQuotation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchaseQuotation>>();
      const purchaseQuotation = { id: 123 };
      jest.spyOn(purchaseQuotationFormService, 'getPurchaseQuotation').mockReturnValue(purchaseQuotation);
      jest.spyOn(purchaseQuotationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchaseQuotation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: purchaseQuotation }));
      saveSubject.complete();

      // THEN
      expect(purchaseQuotationFormService.getPurchaseQuotation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(purchaseQuotationService.update).toHaveBeenCalledWith(expect.objectContaining(purchaseQuotation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchaseQuotation>>();
      const purchaseQuotation = { id: 123 };
      jest.spyOn(purchaseQuotationFormService, 'getPurchaseQuotation').mockReturnValue({ id: null });
      jest.spyOn(purchaseQuotationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchaseQuotation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: purchaseQuotation }));
      saveSubject.complete();

      // THEN
      expect(purchaseQuotationFormService.getPurchaseQuotation).toHaveBeenCalled();
      expect(purchaseQuotationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchaseQuotation>>();
      const purchaseQuotation = { id: 123 };
      jest.spyOn(purchaseQuotationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchaseQuotation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(purchaseQuotationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSecurityUser', () => {
      it('Should forward to securityUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(securityUserService, 'compareSecurityUser');
        comp.compareSecurityUser(entity, entity2);
        expect(securityUserService.compareSecurityUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
