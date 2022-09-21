import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProductInventoryFormService } from './product-inventory-form.service';
import { ProductInventoryService } from '../service/product-inventory.service';
import { IProductInventory } from '../product-inventory.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IPurchaseQuotation } from 'app/entities/purchase-quotation/purchase-quotation.model';
import { PurchaseQuotationService } from 'app/entities/purchase-quotation/service/purchase-quotation.service';
import { IProductTransaction } from 'app/entities/product-transaction/product-transaction.model';
import { ProductTransactionService } from 'app/entities/product-transaction/service/product-transaction.service';
import { IWareHouse } from 'app/entities/ware-house/ware-house.model';
import { WareHouseService } from 'app/entities/ware-house/service/ware-house.service';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { SecurityUserService } from 'app/entities/security-user/service/security-user.service';

import { ProductInventoryUpdateComponent } from './product-inventory-update.component';

describe('ProductInventory Management Update Component', () => {
  let comp: ProductInventoryUpdateComponent;
  let fixture: ComponentFixture<ProductInventoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productInventoryFormService: ProductInventoryFormService;
  let productInventoryService: ProductInventoryService;
  let productService: ProductService;
  let purchaseQuotationService: PurchaseQuotationService;
  let productTransactionService: ProductTransactionService;
  let wareHouseService: WareHouseService;
  let securityUserService: SecurityUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProductInventoryUpdateComponent],
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
      .overrideTemplate(ProductInventoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductInventoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productInventoryFormService = TestBed.inject(ProductInventoryFormService);
    productInventoryService = TestBed.inject(ProductInventoryService);
    productService = TestBed.inject(ProductService);
    purchaseQuotationService = TestBed.inject(PurchaseQuotationService);
    productTransactionService = TestBed.inject(ProductTransactionService);
    wareHouseService = TestBed.inject(WareHouseService);
    securityUserService = TestBed.inject(SecurityUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Product query and add missing value', () => {
      const productInventory: IProductInventory = { id: 456 };
      const product: IProduct = { id: 25300 };
      productInventory.product = product;

      const productCollection: IProduct[] = [{ id: 9524 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productInventory });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(
        productCollection,
        ...additionalProducts.map(expect.objectContaining)
      );
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PurchaseQuotation query and add missing value', () => {
      const productInventory: IProductInventory = { id: 456 };
      const purchaseQuotation: IPurchaseQuotation = { id: 38752 };
      productInventory.purchaseQuotation = purchaseQuotation;

      const purchaseQuotationCollection: IPurchaseQuotation[] = [{ id: 55336 }];
      jest.spyOn(purchaseQuotationService, 'query').mockReturnValue(of(new HttpResponse({ body: purchaseQuotationCollection })));
      const additionalPurchaseQuotations = [purchaseQuotation];
      const expectedCollection: IPurchaseQuotation[] = [...additionalPurchaseQuotations, ...purchaseQuotationCollection];
      jest.spyOn(purchaseQuotationService, 'addPurchaseQuotationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productInventory });
      comp.ngOnInit();

      expect(purchaseQuotationService.query).toHaveBeenCalled();
      expect(purchaseQuotationService.addPurchaseQuotationToCollectionIfMissing).toHaveBeenCalledWith(
        purchaseQuotationCollection,
        ...additionalPurchaseQuotations.map(expect.objectContaining)
      );
      expect(comp.purchaseQuotationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ProductTransaction query and add missing value', () => {
      const productInventory: IProductInventory = { id: 456 };
      const productTransaction: IProductTransaction = { id: 72208 };
      productInventory.productTransaction = productTransaction;

      const productTransactionCollection: IProductTransaction[] = [{ id: 72035 }];
      jest.spyOn(productTransactionService, 'query').mockReturnValue(of(new HttpResponse({ body: productTransactionCollection })));
      const additionalProductTransactions = [productTransaction];
      const expectedCollection: IProductTransaction[] = [...additionalProductTransactions, ...productTransactionCollection];
      jest.spyOn(productTransactionService, 'addProductTransactionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productInventory });
      comp.ngOnInit();

      expect(productTransactionService.query).toHaveBeenCalled();
      expect(productTransactionService.addProductTransactionToCollectionIfMissing).toHaveBeenCalledWith(
        productTransactionCollection,
        ...additionalProductTransactions.map(expect.objectContaining)
      );
      expect(comp.productTransactionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call WareHouse query and add missing value', () => {
      const productInventory: IProductInventory = { id: 456 };
      const wareHouses: IWareHouse[] = [{ id: 91935 }];
      productInventory.wareHouses = wareHouses;

      const wareHouseCollection: IWareHouse[] = [{ id: 1014 }];
      jest.spyOn(wareHouseService, 'query').mockReturnValue(of(new HttpResponse({ body: wareHouseCollection })));
      const additionalWareHouses = [...wareHouses];
      const expectedCollection: IWareHouse[] = [...additionalWareHouses, ...wareHouseCollection];
      jest.spyOn(wareHouseService, 'addWareHouseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productInventory });
      comp.ngOnInit();

      expect(wareHouseService.query).toHaveBeenCalled();
      expect(wareHouseService.addWareHouseToCollectionIfMissing).toHaveBeenCalledWith(
        wareHouseCollection,
        ...additionalWareHouses.map(expect.objectContaining)
      );
      expect(comp.wareHousesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call SecurityUser query and add missing value', () => {
      const productInventory: IProductInventory = { id: 456 };
      const securityUsers: ISecurityUser[] = [{ id: 35139 }];
      productInventory.securityUsers = securityUsers;

      const securityUserCollection: ISecurityUser[] = [{ id: 61561 }];
      jest.spyOn(securityUserService, 'query').mockReturnValue(of(new HttpResponse({ body: securityUserCollection })));
      const additionalSecurityUsers = [...securityUsers];
      const expectedCollection: ISecurityUser[] = [...additionalSecurityUsers, ...securityUserCollection];
      jest.spyOn(securityUserService, 'addSecurityUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productInventory });
      comp.ngOnInit();

      expect(securityUserService.query).toHaveBeenCalled();
      expect(securityUserService.addSecurityUserToCollectionIfMissing).toHaveBeenCalledWith(
        securityUserCollection,
        ...additionalSecurityUsers.map(expect.objectContaining)
      );
      expect(comp.securityUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const productInventory: IProductInventory = { id: 456 };
      const product: IProduct = { id: 5809 };
      productInventory.product = product;
      const purchaseQuotation: IPurchaseQuotation = { id: 98667 };
      productInventory.purchaseQuotation = purchaseQuotation;
      const productTransaction: IProductTransaction = { id: 26716 };
      productInventory.productTransaction = productTransaction;
      const wareHouse: IWareHouse = { id: 51611 };
      productInventory.wareHouses = [wareHouse];
      const securityUser: ISecurityUser = { id: 64290 };
      productInventory.securityUsers = [securityUser];

      activatedRoute.data = of({ productInventory });
      comp.ngOnInit();

      expect(comp.productsSharedCollection).toContain(product);
      expect(comp.purchaseQuotationsSharedCollection).toContain(purchaseQuotation);
      expect(comp.productTransactionsSharedCollection).toContain(productTransaction);
      expect(comp.wareHousesSharedCollection).toContain(wareHouse);
      expect(comp.securityUsersSharedCollection).toContain(securityUser);
      expect(comp.productInventory).toEqual(productInventory);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductInventory>>();
      const productInventory = { id: 123 };
      jest.spyOn(productInventoryFormService, 'getProductInventory').mockReturnValue(productInventory);
      jest.spyOn(productInventoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productInventory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productInventory }));
      saveSubject.complete();

      // THEN
      expect(productInventoryFormService.getProductInventory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(productInventoryService.update).toHaveBeenCalledWith(expect.objectContaining(productInventory));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductInventory>>();
      const productInventory = { id: 123 };
      jest.spyOn(productInventoryFormService, 'getProductInventory').mockReturnValue({ id: null });
      jest.spyOn(productInventoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productInventory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productInventory }));
      saveSubject.complete();

      // THEN
      expect(productInventoryFormService.getProductInventory).toHaveBeenCalled();
      expect(productInventoryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductInventory>>();
      const productInventory = { id: 123 };
      jest.spyOn(productInventoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productInventory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productInventoryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProduct', () => {
      it('Should forward to productService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(productService, 'compareProduct');
        comp.compareProduct(entity, entity2);
        expect(productService.compareProduct).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePurchaseQuotation', () => {
      it('Should forward to purchaseQuotationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(purchaseQuotationService, 'comparePurchaseQuotation');
        comp.comparePurchaseQuotation(entity, entity2);
        expect(purchaseQuotationService.comparePurchaseQuotation).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareProductTransaction', () => {
      it('Should forward to productTransactionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(productTransactionService, 'compareProductTransaction');
        comp.compareProductTransaction(entity, entity2);
        expect(productTransactionService.compareProductTransaction).toHaveBeenCalledWith(entity, entity2);
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
