import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { WareHouseFormService } from './ware-house-form.service';
import { WareHouseService } from '../service/ware-house.service';
import { IWareHouse } from '../ware-house.model';

import { WareHouseUpdateComponent } from './ware-house-update.component';

describe('WareHouse Management Update Component', () => {
  let comp: WareHouseUpdateComponent;
  let fixture: ComponentFixture<WareHouseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let wareHouseFormService: WareHouseFormService;
  let wareHouseService: WareHouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [WareHouseUpdateComponent],
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
      .overrideTemplate(WareHouseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WareHouseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    wareHouseFormService = TestBed.inject(WareHouseFormService);
    wareHouseService = TestBed.inject(WareHouseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const wareHouse: IWareHouse = { id: 456 };

      activatedRoute.data = of({ wareHouse });
      comp.ngOnInit();

      expect(comp.wareHouse).toEqual(wareHouse);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWareHouse>>();
      const wareHouse = { id: 123 };
      jest.spyOn(wareHouseFormService, 'getWareHouse').mockReturnValue(wareHouse);
      jest.spyOn(wareHouseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ wareHouse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: wareHouse }));
      saveSubject.complete();

      // THEN
      expect(wareHouseFormService.getWareHouse).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(wareHouseService.update).toHaveBeenCalledWith(expect.objectContaining(wareHouse));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWareHouse>>();
      const wareHouse = { id: 123 };
      jest.spyOn(wareHouseFormService, 'getWareHouse').mockReturnValue({ id: null });
      jest.spyOn(wareHouseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ wareHouse: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: wareHouse }));
      saveSubject.complete();

      // THEN
      expect(wareHouseFormService.getWareHouse).toHaveBeenCalled();
      expect(wareHouseService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWareHouse>>();
      const wareHouse = { id: 123 };
      jest.spyOn(wareHouseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ wareHouse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(wareHouseService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
