import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProductTransactionFormService } from './product-transaction-form.service';
import { ProductTransactionService } from '../service/product-transaction.service';
import { IProductTransaction } from '../product-transaction.model';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { SecurityUserService } from 'app/entities/security-user/service/security-user.service';
import { IWareHouse } from 'app/entities/ware-house/ware-house.model';
import { WareHouseService } from 'app/entities/ware-house/service/ware-house.service';

import { ProductTransactionUpdateComponent } from './product-transaction-update.component';

describe('ProductTransaction Management Update Component', () => {
  let comp: ProductTransactionUpdateComponent;
  let fixture: ComponentFixture<ProductTransactionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productTransactionFormService: ProductTransactionFormService;
  let productTransactionService: ProductTransactionService;
  let securityUserService: SecurityUserService;
  let wareHouseService: WareHouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProductTransactionUpdateComponent],
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
      .overrideTemplate(ProductTransactionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductTransactionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productTransactionFormService = TestBed.inject(ProductTransactionFormService);
    productTransactionService = TestBed.inject(ProductTransactionService);
    securityUserService = TestBed.inject(SecurityUserService);
    wareHouseService = TestBed.inject(WareHouseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call SecurityUser query and add missing value', () => {
      const productTransaction: IProductTransaction = { id: 456 };
      const securityUser: ISecurityUser = { id: 5073 };
      productTransaction.securityUser = securityUser;

      const securityUserCollection: ISecurityUser[] = [{ id: 78260 }];
      jest.spyOn(securityUserService, 'query').mockReturnValue(of(new HttpResponse({ body: securityUserCollection })));
      const additionalSecurityUsers = [securityUser];
      const expectedCollection: ISecurityUser[] = [...additionalSecurityUsers, ...securityUserCollection];
      jest.spyOn(securityUserService, 'addSecurityUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productTransaction });
      comp.ngOnInit();

      expect(securityUserService.query).toHaveBeenCalled();
      expect(securityUserService.addSecurityUserToCollectionIfMissing).toHaveBeenCalledWith(
        securityUserCollection,
        ...additionalSecurityUsers.map(expect.objectContaining)
      );
      expect(comp.securityUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call WareHouse query and add missing value', () => {
      const productTransaction: IProductTransaction = { id: 456 };
      const wareHouse: IWareHouse = { id: 81938 };
      productTransaction.wareHouse = wareHouse;

      const wareHouseCollection: IWareHouse[] = [{ id: 41318 }];
      jest.spyOn(wareHouseService, 'query').mockReturnValue(of(new HttpResponse({ body: wareHouseCollection })));
      const additionalWareHouses = [wareHouse];
      const expectedCollection: IWareHouse[] = [...additionalWareHouses, ...wareHouseCollection];
      jest.spyOn(wareHouseService, 'addWareHouseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productTransaction });
      comp.ngOnInit();

      expect(wareHouseService.query).toHaveBeenCalled();
      expect(wareHouseService.addWareHouseToCollectionIfMissing).toHaveBeenCalledWith(
        wareHouseCollection,
        ...additionalWareHouses.map(expect.objectContaining)
      );
      expect(comp.wareHousesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const productTransaction: IProductTransaction = { id: 456 };
      const securityUser: ISecurityUser = { id: 99846 };
      productTransaction.securityUser = securityUser;
      const wareHouse: IWareHouse = { id: 90830 };
      productTransaction.wareHouse = wareHouse;

      activatedRoute.data = of({ productTransaction });
      comp.ngOnInit();

      expect(comp.securityUsersSharedCollection).toContain(securityUser);
      expect(comp.wareHousesSharedCollection).toContain(wareHouse);
      expect(comp.productTransaction).toEqual(productTransaction);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductTransaction>>();
      const productTransaction = { id: 123 };
      jest.spyOn(productTransactionFormService, 'getProductTransaction').mockReturnValue(productTransaction);
      jest.spyOn(productTransactionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productTransaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productTransaction }));
      saveSubject.complete();

      // THEN
      expect(productTransactionFormService.getProductTransaction).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(productTransactionService.update).toHaveBeenCalledWith(expect.objectContaining(productTransaction));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductTransaction>>();
      const productTransaction = { id: 123 };
      jest.spyOn(productTransactionFormService, 'getProductTransaction').mockReturnValue({ id: null });
      jest.spyOn(productTransactionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productTransaction: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productTransaction }));
      saveSubject.complete();

      // THEN
      expect(productTransactionFormService.getProductTransaction).toHaveBeenCalled();
      expect(productTransactionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductTransaction>>();
      const productTransaction = { id: 123 };
      jest.spyOn(productTransactionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productTransaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productTransactionService.update).toHaveBeenCalled();
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

    describe('compareWareHouse', () => {
      it('Should forward to wareHouseService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(wareHouseService, 'compareWareHouse');
        comp.compareWareHouse(entity, entity2);
        expect(wareHouseService.compareWareHouse).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
