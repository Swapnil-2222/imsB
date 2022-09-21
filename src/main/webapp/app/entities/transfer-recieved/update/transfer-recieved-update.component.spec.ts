import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TransferRecievedFormService } from './transfer-recieved-form.service';
import { TransferRecievedService } from '../service/transfer-recieved.service';
import { ITransferRecieved } from '../transfer-recieved.model';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { SecurityUserService } from 'app/entities/security-user/service/security-user.service';
import { ITransfer } from 'app/entities/transfer/transfer.model';
import { TransferService } from 'app/entities/transfer/service/transfer.service';

import { TransferRecievedUpdateComponent } from './transfer-recieved-update.component';

describe('TransferRecieved Management Update Component', () => {
  let comp: TransferRecievedUpdateComponent;
  let fixture: ComponentFixture<TransferRecievedUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let transferRecievedFormService: TransferRecievedFormService;
  let transferRecievedService: TransferRecievedService;
  let securityUserService: SecurityUserService;
  let transferService: TransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TransferRecievedUpdateComponent],
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
      .overrideTemplate(TransferRecievedUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TransferRecievedUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    transferRecievedFormService = TestBed.inject(TransferRecievedFormService);
    transferRecievedService = TestBed.inject(TransferRecievedService);
    securityUserService = TestBed.inject(SecurityUserService);
    transferService = TestBed.inject(TransferService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call SecurityUser query and add missing value', () => {
      const transferRecieved: ITransferRecieved = { id: 456 };
      const securityUser: ISecurityUser = { id: 28769 };
      transferRecieved.securityUser = securityUser;

      const securityUserCollection: ISecurityUser[] = [{ id: 40772 }];
      jest.spyOn(securityUserService, 'query').mockReturnValue(of(new HttpResponse({ body: securityUserCollection })));
      const additionalSecurityUsers = [securityUser];
      const expectedCollection: ISecurityUser[] = [...additionalSecurityUsers, ...securityUserCollection];
      jest.spyOn(securityUserService, 'addSecurityUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ transferRecieved });
      comp.ngOnInit();

      expect(securityUserService.query).toHaveBeenCalled();
      expect(securityUserService.addSecurityUserToCollectionIfMissing).toHaveBeenCalledWith(
        securityUserCollection,
        ...additionalSecurityUsers.map(expect.objectContaining)
      );
      expect(comp.securityUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Transfer query and add missing value', () => {
      const transferRecieved: ITransferRecieved = { id: 456 };
      const transfer: ITransfer = { id: 31395 };
      transferRecieved.transfer = transfer;

      const transferCollection: ITransfer[] = [{ id: 40118 }];
      jest.spyOn(transferService, 'query').mockReturnValue(of(new HttpResponse({ body: transferCollection })));
      const additionalTransfers = [transfer];
      const expectedCollection: ITransfer[] = [...additionalTransfers, ...transferCollection];
      jest.spyOn(transferService, 'addTransferToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ transferRecieved });
      comp.ngOnInit();

      expect(transferService.query).toHaveBeenCalled();
      expect(transferService.addTransferToCollectionIfMissing).toHaveBeenCalledWith(
        transferCollection,
        ...additionalTransfers.map(expect.objectContaining)
      );
      expect(comp.transfersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const transferRecieved: ITransferRecieved = { id: 456 };
      const securityUser: ISecurityUser = { id: 32186 };
      transferRecieved.securityUser = securityUser;
      const transfer: ITransfer = { id: 27586 };
      transferRecieved.transfer = transfer;

      activatedRoute.data = of({ transferRecieved });
      comp.ngOnInit();

      expect(comp.securityUsersSharedCollection).toContain(securityUser);
      expect(comp.transfersSharedCollection).toContain(transfer);
      expect(comp.transferRecieved).toEqual(transferRecieved);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITransferRecieved>>();
      const transferRecieved = { id: 123 };
      jest.spyOn(transferRecievedFormService, 'getTransferRecieved').mockReturnValue(transferRecieved);
      jest.spyOn(transferRecievedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transferRecieved });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: transferRecieved }));
      saveSubject.complete();

      // THEN
      expect(transferRecievedFormService.getTransferRecieved).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(transferRecievedService.update).toHaveBeenCalledWith(expect.objectContaining(transferRecieved));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITransferRecieved>>();
      const transferRecieved = { id: 123 };
      jest.spyOn(transferRecievedFormService, 'getTransferRecieved').mockReturnValue({ id: null });
      jest.spyOn(transferRecievedService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transferRecieved: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: transferRecieved }));
      saveSubject.complete();

      // THEN
      expect(transferRecievedFormService.getTransferRecieved).toHaveBeenCalled();
      expect(transferRecievedService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITransferRecieved>>();
      const transferRecieved = { id: 123 };
      jest.spyOn(transferRecievedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transferRecieved });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(transferRecievedService.update).toHaveBeenCalled();
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
