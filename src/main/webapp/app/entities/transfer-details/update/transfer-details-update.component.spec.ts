import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TransferDetailsFormService } from './transfer-details-form.service';
import { TransferDetailsService } from '../service/transfer-details.service';
import { ITransferDetails } from '../transfer-details.model';
import { IWareHouse } from 'app/entities/ware-house/ware-house.model';
import { WareHouseService } from 'app/entities/ware-house/service/ware-house.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ITransfer } from 'app/entities/transfer/transfer.model';
import { TransferService } from 'app/entities/transfer/service/transfer.service';

import { TransferDetailsUpdateComponent } from './transfer-details-update.component';

describe('TransferDetails Management Update Component', () => {
  let comp: TransferDetailsUpdateComponent;
  let fixture: ComponentFixture<TransferDetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let transferDetailsFormService: TransferDetailsFormService;
  let transferDetailsService: TransferDetailsService;
  let wareHouseService: WareHouseService;
  let productService: ProductService;
  let transferService: TransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TransferDetailsUpdateComponent],
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
      .overrideTemplate(TransferDetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TransferDetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    transferDetailsFormService = TestBed.inject(TransferDetailsFormService);
    transferDetailsService = TestBed.inject(TransferDetailsService);
    wareHouseService = TestBed.inject(WareHouseService);
    productService = TestBed.inject(ProductService);
    transferService = TestBed.inject(TransferService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call WareHouse query and add missing value', () => {
      const transferDetails: ITransferDetails = { id: 456 };
      const wareHouse: IWareHouse = { id: 10351 };
      transferDetails.wareHouse = wareHouse;

      const wareHouseCollection: IWareHouse[] = [{ id: 56181 }];
      jest.spyOn(wareHouseService, 'query').mockReturnValue(of(new HttpResponse({ body: wareHouseCollection })));
      const additionalWareHouses = [wareHouse];
      const expectedCollection: IWareHouse[] = [...additionalWareHouses, ...wareHouseCollection];
      jest.spyOn(wareHouseService, 'addWareHouseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ transferDetails });
      comp.ngOnInit();

      expect(wareHouseService.query).toHaveBeenCalled();
      expect(wareHouseService.addWareHouseToCollectionIfMissing).toHaveBeenCalledWith(
        wareHouseCollection,
        ...additionalWareHouses.map(expect.objectContaining)
      );
      expect(comp.wareHousesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Product query and add missing value', () => {
      const transferDetails: ITransferDetails = { id: 456 };
      const product: IProduct = { id: 36391 };
      transferDetails.product = product;

      const productCollection: IProduct[] = [{ id: 37257 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ transferDetails });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(
        productCollection,
        ...additionalProducts.map(expect.objectContaining)
      );
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Transfer query and add missing value', () => {
      const transferDetails: ITransferDetails = { id: 456 };
      const transfer: ITransfer = { id: 71286 };
      transferDetails.transfer = transfer;

      const transferCollection: ITransfer[] = [{ id: 44318 }];
      jest.spyOn(transferService, 'query').mockReturnValue(of(new HttpResponse({ body: transferCollection })));
      const additionalTransfers = [transfer];
      const expectedCollection: ITransfer[] = [...additionalTransfers, ...transferCollection];
      jest.spyOn(transferService, 'addTransferToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ transferDetails });
      comp.ngOnInit();

      expect(transferService.query).toHaveBeenCalled();
      expect(transferService.addTransferToCollectionIfMissing).toHaveBeenCalledWith(
        transferCollection,
        ...additionalTransfers.map(expect.objectContaining)
      );
      expect(comp.transfersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const transferDetails: ITransferDetails = { id: 456 };
      const wareHouse: IWareHouse = { id: 89467 };
      transferDetails.wareHouse = wareHouse;
      const product: IProduct = { id: 10362 };
      transferDetails.product = product;
      const transfer: ITransfer = { id: 28297 };
      transferDetails.transfer = transfer;

      activatedRoute.data = of({ transferDetails });
      comp.ngOnInit();

      expect(comp.wareHousesSharedCollection).toContain(wareHouse);
      expect(comp.productsSharedCollection).toContain(product);
      expect(comp.transfersSharedCollection).toContain(transfer);
      expect(comp.transferDetails).toEqual(transferDetails);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITransferDetails>>();
      const transferDetails = { id: 123 };
      jest.spyOn(transferDetailsFormService, 'getTransferDetails').mockReturnValue(transferDetails);
      jest.spyOn(transferDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transferDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: transferDetails }));
      saveSubject.complete();

      // THEN
      expect(transferDetailsFormService.getTransferDetails).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(transferDetailsService.update).toHaveBeenCalledWith(expect.objectContaining(transferDetails));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITransferDetails>>();
      const transferDetails = { id: 123 };
      jest.spyOn(transferDetailsFormService, 'getTransferDetails').mockReturnValue({ id: null });
      jest.spyOn(transferDetailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transferDetails: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: transferDetails }));
      saveSubject.complete();

      // THEN
      expect(transferDetailsFormService.getTransferDetails).toHaveBeenCalled();
      expect(transferDetailsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITransferDetails>>();
      const transferDetails = { id: 123 };
      jest.spyOn(transferDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transferDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(transferDetailsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareWareHouse', () => {
      it('Should forward to wareHouseService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(wareHouseService, 'compareWareHouse');
        comp.compareWareHouse(entity, entity2);
        expect(wareHouseService.compareWareHouse).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareProduct', () => {
      it('Should forward to productService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(productService, 'compareProduct');
        comp.compareProduct(entity, entity2);
        expect(productService.compareProduct).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTransfer', () => {
      it('Should forward to transferService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(transferService, 'compareTransfer');
        comp.compareTransfer(entity, entity2);
        expect(transferService.compareTransfer).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
