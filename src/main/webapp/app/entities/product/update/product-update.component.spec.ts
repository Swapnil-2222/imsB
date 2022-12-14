import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProductFormService } from './product-form.service';
import { ProductService } from '../service/product.service';
import { IProduct } from '../product.model';
import { ICategories } from 'app/entities/categories/categories.model';
import { CategoriesService } from 'app/entities/categories/service/categories.service';
import { IUnit } from 'app/entities/unit/unit.model';
import { UnitService } from 'app/entities/unit/service/unit.service';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { SecurityUserService } from 'app/entities/security-user/service/security-user.service';
import { IPurchaseQuotationDetails } from 'app/entities/purchase-quotation-details/purchase-quotation-details.model';
import { PurchaseQuotationDetailsService } from 'app/entities/purchase-quotation-details/service/purchase-quotation-details.service';

import { ProductUpdateComponent } from './product-update.component';

describe('Product Management Update Component', () => {
  let comp: ProductUpdateComponent;
  let fixture: ComponentFixture<ProductUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productFormService: ProductFormService;
  let productService: ProductService;
  let categoriesService: CategoriesService;
  let unitService: UnitService;
  let securityUserService: SecurityUserService;
  let purchaseQuotationDetailsService: PurchaseQuotationDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProductUpdateComponent],
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
      .overrideTemplate(ProductUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productFormService = TestBed.inject(ProductFormService);
    productService = TestBed.inject(ProductService);
    categoriesService = TestBed.inject(CategoriesService);
    unitService = TestBed.inject(UnitService);
    securityUserService = TestBed.inject(SecurityUserService);
    purchaseQuotationDetailsService = TestBed.inject(PurchaseQuotationDetailsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Categories query and add missing value', () => {
      const product: IProduct = { id: 456 };
      const categories: ICategories = { id: 5037 };
      product.categories = categories;

      const categoriesCollection: ICategories[] = [{ id: 42362 }];
      jest.spyOn(categoriesService, 'query').mockReturnValue(of(new HttpResponse({ body: categoriesCollection })));
      const additionalCategories = [categories];
      const expectedCollection: ICategories[] = [...additionalCategories, ...categoriesCollection];
      jest.spyOn(categoriesService, 'addCategoriesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ product });
      comp.ngOnInit();

      expect(categoriesService.query).toHaveBeenCalled();
      expect(categoriesService.addCategoriesToCollectionIfMissing).toHaveBeenCalledWith(
        categoriesCollection,
        ...additionalCategories.map(expect.objectContaining)
      );
      expect(comp.categoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Unit query and add missing value', () => {
      const product: IProduct = { id: 456 };
      const unit: IUnit = { id: 82468 };
      product.unit = unit;

      const unitCollection: IUnit[] = [{ id: 13061 }];
      jest.spyOn(unitService, 'query').mockReturnValue(of(new HttpResponse({ body: unitCollection })));
      const additionalUnits = [unit];
      const expectedCollection: IUnit[] = [...additionalUnits, ...unitCollection];
      jest.spyOn(unitService, 'addUnitToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ product });
      comp.ngOnInit();

      expect(unitService.query).toHaveBeenCalled();
      expect(unitService.addUnitToCollectionIfMissing).toHaveBeenCalledWith(
        unitCollection,
        ...additionalUnits.map(expect.objectContaining)
      );
      expect(comp.unitsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call SecurityUser query and add missing value', () => {
      const product: IProduct = { id: 456 };
      const securityUser: ISecurityUser = { id: 45888 };
      product.securityUser = securityUser;

      const securityUserCollection: ISecurityUser[] = [{ id: 71384 }];
      jest.spyOn(securityUserService, 'query').mockReturnValue(of(new HttpResponse({ body: securityUserCollection })));
      const additionalSecurityUsers = [securityUser];
      const expectedCollection: ISecurityUser[] = [...additionalSecurityUsers, ...securityUserCollection];
      jest.spyOn(securityUserService, 'addSecurityUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ product });
      comp.ngOnInit();

      expect(securityUserService.query).toHaveBeenCalled();
      expect(securityUserService.addSecurityUserToCollectionIfMissing).toHaveBeenCalledWith(
        securityUserCollection,
        ...additionalSecurityUsers.map(expect.objectContaining)
      );
      expect(comp.securityUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PurchaseQuotationDetails query and add missing value', () => {
      const product: IProduct = { id: 456 };
      const purchaseQuotationDetails: IPurchaseQuotationDetails = { id: 2915 };
      product.purchaseQuotationDetails = purchaseQuotationDetails;

      const purchaseQuotationDetailsCollection: IPurchaseQuotationDetails[] = [{ id: 65901 }];
      jest
        .spyOn(purchaseQuotationDetailsService, 'query')
        .mockReturnValue(of(new HttpResponse({ body: purchaseQuotationDetailsCollection })));
      const additionalPurchaseQuotationDetails = [purchaseQuotationDetails];
      const expectedCollection: IPurchaseQuotationDetails[] = [
        ...additionalPurchaseQuotationDetails,
        ...purchaseQuotationDetailsCollection,
      ];
      jest.spyOn(purchaseQuotationDetailsService, 'addPurchaseQuotationDetailsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ product });
      comp.ngOnInit();

      expect(purchaseQuotationDetailsService.query).toHaveBeenCalled();
      expect(purchaseQuotationDetailsService.addPurchaseQuotationDetailsToCollectionIfMissing).toHaveBeenCalledWith(
        purchaseQuotationDetailsCollection,
        ...additionalPurchaseQuotationDetails.map(expect.objectContaining)
      );
      expect(comp.purchaseQuotationDetailsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const product: IProduct = { id: 456 };
      const categories: ICategories = { id: 17858 };
      product.categories = categories;
      const unit: IUnit = { id: 92857 };
      product.unit = unit;
      const securityUser: ISecurityUser = { id: 56495 };
      product.securityUser = securityUser;
      const purchaseQuotationDetails: IPurchaseQuotationDetails = { id: 7746 };
      product.purchaseQuotationDetails = purchaseQuotationDetails;

      activatedRoute.data = of({ product });
      comp.ngOnInit();

      expect(comp.categoriesSharedCollection).toContain(categories);
      expect(comp.unitsSharedCollection).toContain(unit);
      expect(comp.securityUsersSharedCollection).toContain(securityUser);
      expect(comp.purchaseQuotationDetailsSharedCollection).toContain(purchaseQuotationDetails);
      expect(comp.product).toEqual(product);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProduct>>();
      const product = { id: 123 };
      jest.spyOn(productFormService, 'getProduct').mockReturnValue(product);
      jest.spyOn(productService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ product });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: product }));
      saveSubject.complete();

      // THEN
      expect(productFormService.getProduct).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(productService.update).toHaveBeenCalledWith(expect.objectContaining(product));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProduct>>();
      const product = { id: 123 };
      jest.spyOn(productFormService, 'getProduct').mockReturnValue({ id: null });
      jest.spyOn(productService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ product: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: product }));
      saveSubject.complete();

      // THEN
      expect(productFormService.getProduct).toHaveBeenCalled();
      expect(productService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProduct>>();
      const product = { id: 123 };
      jest.spyOn(productService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ product });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCategories', () => {
      it('Should forward to categoriesService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(categoriesService, 'compareCategories');
        comp.compareCategories(entity, entity2);
        expect(categoriesService.compareCategories).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUnit', () => {
      it('Should forward to unitService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(unitService, 'compareUnit');
        comp.compareUnit(entity, entity2);
        expect(unitService.compareUnit).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSecurityUser', () => {
      it('Should forward to securityUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(securityUserService, 'compareSecurityUser');
        comp.compareSecurityUser(entity, entity2);
        expect(securityUserService.compareSecurityUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePurchaseQuotationDetails', () => {
      it('Should forward to purchaseQuotationDetailsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(purchaseQuotationDetailsService, 'comparePurchaseQuotationDetails');
        comp.comparePurchaseQuotationDetails(entity, entity2);
        expect(purchaseQuotationDetailsService.comparePurchaseQuotationDetails).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
