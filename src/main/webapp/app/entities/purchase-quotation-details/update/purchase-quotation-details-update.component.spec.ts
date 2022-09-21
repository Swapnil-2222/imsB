import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PurchaseQuotationDetailsFormService } from './purchase-quotation-details-form.service';
import { PurchaseQuotationDetailsService } from '../service/purchase-quotation-details.service';
import { IPurchaseQuotationDetails } from '../purchase-quotation-details.model';
import { IPurchaseQuotation } from 'app/entities/purchase-quotation/purchase-quotation.model';
import { PurchaseQuotationService } from 'app/entities/purchase-quotation/service/purchase-quotation.service';

import { PurchaseQuotationDetailsUpdateComponent } from './purchase-quotation-details-update.component';

describe('PurchaseQuotationDetails Management Update Component', () => {
  let comp: PurchaseQuotationDetailsUpdateComponent;
  let fixture: ComponentFixture<PurchaseQuotationDetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let purchaseQuotationDetailsFormService: PurchaseQuotationDetailsFormService;
  let purchaseQuotationDetailsService: PurchaseQuotationDetailsService;
  let purchaseQuotationService: PurchaseQuotationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PurchaseQuotationDetailsUpdateComponent],
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
      .overrideTemplate(PurchaseQuotationDetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PurchaseQuotationDetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    purchaseQuotationDetailsFormService = TestBed.inject(PurchaseQuotationDetailsFormService);
    purchaseQuotationDetailsService = TestBed.inject(PurchaseQuotationDetailsService);
    purchaseQuotationService = TestBed.inject(PurchaseQuotationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call PurchaseQuotation query and add missing value', () => {
      const purchaseQuotationDetails: IPurchaseQuotationDetails = { id: 456 };
      const purchaseQuotation: IPurchaseQuotation = { id: 97167 };
      purchaseQuotationDetails.purchaseQuotation = purchaseQuotation;

      const purchaseQuotationCollection: IPurchaseQuotation[] = [{ id: 65991 }];
      jest.spyOn(purchaseQuotationService, 'query').mockReturnValue(of(new HttpResponse({ body: purchaseQuotationCollection })));
      const additionalPurchaseQuotations = [purchaseQuotation];
      const expectedCollection: IPurchaseQuotation[] = [...additionalPurchaseQuotations, ...purchaseQuotationCollection];
      jest.spyOn(purchaseQuotationService, 'addPurchaseQuotationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ purchaseQuotationDetails });
      comp.ngOnInit();

      expect(purchaseQuotationService.query).toHaveBeenCalled();
      expect(purchaseQuotationService.addPurchaseQuotationToCollectionIfMissing).toHaveBeenCalledWith(
        purchaseQuotationCollection,
        ...additionalPurchaseQuotations.map(expect.objectContaining)
      );
      expect(comp.purchaseQuotationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const purchaseQuotationDetails: IPurchaseQuotationDetails = { id: 456 };
      const purchaseQuotation: IPurchaseQuotation = { id: 95286 };
      purchaseQuotationDetails.purchaseQuotation = purchaseQuotation;

      activatedRoute.data = of({ purchaseQuotationDetails });
      comp.ngOnInit();

      expect(comp.purchaseQuotationsSharedCollection).toContain(purchaseQuotation);
      expect(comp.purchaseQuotationDetails).toEqual(purchaseQuotationDetails);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchaseQuotationDetails>>();
      const purchaseQuotationDetails = { id: 123 };
      jest.spyOn(purchaseQuotationDetailsFormService, 'getPurchaseQuotationDetails').mockReturnValue(purchaseQuotationDetails);
      jest.spyOn(purchaseQuotationDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchaseQuotationDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: purchaseQuotationDetails }));
      saveSubject.complete();

      // THEN
      expect(purchaseQuotationDetailsFormService.getPurchaseQuotationDetails).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(purchaseQuotationDetailsService.update).toHaveBeenCalledWith(expect.objectContaining(purchaseQuotationDetails));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchaseQuotationDetails>>();
      const purchaseQuotationDetails = { id: 123 };
      jest.spyOn(purchaseQuotationDetailsFormService, 'getPurchaseQuotationDetails').mockReturnValue({ id: null });
      jest.spyOn(purchaseQuotationDetailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchaseQuotationDetails: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: purchaseQuotationDetails }));
      saveSubject.complete();

      // THEN
      expect(purchaseQuotationDetailsFormService.getPurchaseQuotationDetails).toHaveBeenCalled();
      expect(purchaseQuotationDetailsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchaseQuotationDetails>>();
      const purchaseQuotationDetails = { id: 123 };
      jest.spyOn(purchaseQuotationDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchaseQuotationDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(purchaseQuotationDetailsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePurchaseQuotation', () => {
      it('Should forward to purchaseQuotationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(purchaseQuotationService, 'comparePurchaseQuotation');
        comp.comparePurchaseQuotation(entity, entity2);
        expect(purchaseQuotationService.comparePurchaseQuotation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
