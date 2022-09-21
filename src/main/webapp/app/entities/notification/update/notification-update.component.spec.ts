import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { NotificationFormService } from './notification-form.service';
import { NotificationService } from '../service/notification.service';
import { INotification } from '../notification.model';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { SecurityUserService } from 'app/entities/security-user/service/security-user.service';
import { IWareHouse } from 'app/entities/ware-house/ware-house.model';
import { WareHouseService } from 'app/entities/ware-house/service/ware-house.service';

import { NotificationUpdateComponent } from './notification-update.component';

describe('Notification Management Update Component', () => {
  let comp: NotificationUpdateComponent;
  let fixture: ComponentFixture<NotificationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let notificationFormService: NotificationFormService;
  let notificationService: NotificationService;
  let securityUserService: SecurityUserService;
  let wareHouseService: WareHouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [NotificationUpdateComponent],
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
      .overrideTemplate(NotificationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NotificationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    notificationFormService = TestBed.inject(NotificationFormService);
    notificationService = TestBed.inject(NotificationService);
    securityUserService = TestBed.inject(SecurityUserService);
    wareHouseService = TestBed.inject(WareHouseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call SecurityUser query and add missing value', () => {
      const notification: INotification = { id: 456 };
      const securityUser: ISecurityUser = { id: 64470 };
      notification.securityUser = securityUser;

      const securityUserCollection: ISecurityUser[] = [{ id: 20207 }];
      jest.spyOn(securityUserService, 'query').mockReturnValue(of(new HttpResponse({ body: securityUserCollection })));
      const additionalSecurityUsers = [securityUser];
      const expectedCollection: ISecurityUser[] = [...additionalSecurityUsers, ...securityUserCollection];
      jest.spyOn(securityUserService, 'addSecurityUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ notification });
      comp.ngOnInit();

      expect(securityUserService.query).toHaveBeenCalled();
      expect(securityUserService.addSecurityUserToCollectionIfMissing).toHaveBeenCalledWith(
        securityUserCollection,
        ...additionalSecurityUsers.map(expect.objectContaining)
      );
      expect(comp.securityUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call WareHouse query and add missing value', () => {
      const notification: INotification = { id: 456 };
      const wareHouse: IWareHouse = { id: 617 };
      notification.wareHouse = wareHouse;

      const wareHouseCollection: IWareHouse[] = [{ id: 47323 }];
      jest.spyOn(wareHouseService, 'query').mockReturnValue(of(new HttpResponse({ body: wareHouseCollection })));
      const additionalWareHouses = [wareHouse];
      const expectedCollection: IWareHouse[] = [...additionalWareHouses, ...wareHouseCollection];
      jest.spyOn(wareHouseService, 'addWareHouseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ notification });
      comp.ngOnInit();

      expect(wareHouseService.query).toHaveBeenCalled();
      expect(wareHouseService.addWareHouseToCollectionIfMissing).toHaveBeenCalledWith(
        wareHouseCollection,
        ...additionalWareHouses.map(expect.objectContaining)
      );
      expect(comp.wareHousesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const notification: INotification = { id: 456 };
      const securityUser: ISecurityUser = { id: 44851 };
      notification.securityUser = securityUser;
      const wareHouse: IWareHouse = { id: 19010 };
      notification.wareHouse = wareHouse;

      activatedRoute.data = of({ notification });
      comp.ngOnInit();

      expect(comp.securityUsersSharedCollection).toContain(securityUser);
      expect(comp.wareHousesSharedCollection).toContain(wareHouse);
      expect(comp.notification).toEqual(notification);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INotification>>();
      const notification = { id: 123 };
      jest.spyOn(notificationFormService, 'getNotification').mockReturnValue(notification);
      jest.spyOn(notificationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ notification });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: notification }));
      saveSubject.complete();

      // THEN
      expect(notificationFormService.getNotification).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(notificationService.update).toHaveBeenCalledWith(expect.objectContaining(notification));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INotification>>();
      const notification = { id: 123 };
      jest.spyOn(notificationFormService, 'getNotification').mockReturnValue({ id: null });
      jest.spyOn(notificationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ notification: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: notification }));
      saveSubject.complete();

      // THEN
      expect(notificationFormService.getNotification).toHaveBeenCalled();
      expect(notificationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INotification>>();
      const notification = { id: 123 };
      jest.spyOn(notificationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ notification });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(notificationService.update).toHaveBeenCalled();
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
