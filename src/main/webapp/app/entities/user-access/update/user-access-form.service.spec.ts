import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-access.test-samples';

import { UserAccessFormService } from './user-access-form.service';

describe('UserAccess Form Service', () => {
  let service: UserAccessFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAccessFormService);
  });

  describe('Service methods', () => {
    describe('createUserAccessFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserAccessFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            level: expect.any(Object),
            accessId: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            securityUser: expect.any(Object),
          })
        );
      });

      it('passing IUserAccess should create a new form with FormGroup', () => {
        const formGroup = service.createUserAccessFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            level: expect.any(Object),
            accessId: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            securityUser: expect.any(Object),
          })
        );
      });
    });

    describe('getUserAccess', () => {
      it('should return NewUserAccess for default UserAccess initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserAccessFormGroup(sampleWithNewData);

        const userAccess = service.getUserAccess(formGroup) as any;

        expect(userAccess).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserAccess for empty UserAccess initial value', () => {
        const formGroup = service.createUserAccessFormGroup();

        const userAccess = service.getUserAccess(formGroup) as any;

        expect(userAccess).toMatchObject({});
      });

      it('should return IUserAccess', () => {
        const formGroup = service.createUserAccessFormGroup(sampleWithRequiredData);

        const userAccess = service.getUserAccess(formGroup) as any;

        expect(userAccess).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserAccess should not enable id FormControl', () => {
        const formGroup = service.createUserAccessFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserAccess should disable id FormControl', () => {
        const formGroup = service.createUserAccessFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
