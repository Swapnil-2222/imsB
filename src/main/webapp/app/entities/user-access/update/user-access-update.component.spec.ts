import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserAccessFormService } from './user-access-form.service';
import { UserAccessService } from '../service/user-access.service';
import { IUserAccess } from '../user-access.model';
import { ISecurityUser } from 'app/entities/security-user/security-user.model';
import { SecurityUserService } from 'app/entities/security-user/service/security-user.service';

import { UserAccessUpdateComponent } from './user-access-update.component';

describe('UserAccess Management Update Component', () => {
  let comp: UserAccessUpdateComponent;
  let fixture: ComponentFixture<UserAccessUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userAccessFormService: UserAccessFormService;
  let userAccessService: UserAccessService;
  let securityUserService: SecurityUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserAccessUpdateComponent],
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
      .overrideTemplate(UserAccessUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserAccessUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userAccessFormService = TestBed.inject(UserAccessFormService);
    userAccessService = TestBed.inject(UserAccessService);
    securityUserService = TestBed.inject(SecurityUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call SecurityUser query and add missing value', () => {
      const userAccess: IUserAccess = { id: 456 };
      const securityUser: ISecurityUser = { id: 98466 };
      userAccess.securityUser = securityUser;

      const securityUserCollection: ISecurityUser[] = [{ id: 7008 }];
      jest.spyOn(securityUserService, 'query').mockReturnValue(of(new HttpResponse({ body: securityUserCollection })));
      const additionalSecurityUsers = [securityUser];
      const expectedCollection: ISecurityUser[] = [...additionalSecurityUsers, ...securityUserCollection];
      jest.spyOn(securityUserService, 'addSecurityUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userAccess });
      comp.ngOnInit();

      expect(securityUserService.query).toHaveBeenCalled();
      expect(securityUserService.addSecurityUserToCollectionIfMissing).toHaveBeenCalledWith(
        securityUserCollection,
        ...additionalSecurityUsers.map(expect.objectContaining)
      );
      expect(comp.securityUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userAccess: IUserAccess = { id: 456 };
      const securityUser: ISecurityUser = { id: 46218 };
      userAccess.securityUser = securityUser;

      activatedRoute.data = of({ userAccess });
      comp.ngOnInit();

      expect(comp.securityUsersSharedCollection).toContain(securityUser);
      expect(comp.userAccess).toEqual(userAccess);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserAccess>>();
      const userAccess = { id: 123 };
      jest.spyOn(userAccessFormService, 'getUserAccess').mockReturnValue(userAccess);
      jest.spyOn(userAccessService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userAccess });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userAccess }));
      saveSubject.complete();

      // THEN
      expect(userAccessFormService.getUserAccess).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userAccessService.update).toHaveBeenCalledWith(expect.objectContaining(userAccess));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserAccess>>();
      const userAccess = { id: 123 };
      jest.spyOn(userAccessFormService, 'getUserAccess').mockReturnValue({ id: null });
      jest.spyOn(userAccessService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userAccess: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userAccess }));
      saveSubject.complete();

      // THEN
      expect(userAccessFormService.getUserAccess).toHaveBeenCalled();
      expect(userAccessService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserAccess>>();
      const userAccess = { id: 123 };
      jest.spyOn(userAccessService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userAccess });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userAccessService.update).toHaveBeenCalled();
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
