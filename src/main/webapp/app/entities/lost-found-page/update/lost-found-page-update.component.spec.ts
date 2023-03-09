import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LostFoundPageFormService } from './lost-found-page-form.service';
import { LostFoundPageService } from '../service/lost-found-page.service';
import { ILostFoundPage } from '../lost-found-page.model';

import { LostFoundPageUpdateComponent } from './lost-found-page-update.component';

describe('LostFoundPage Management Update Component', () => {
  let comp: LostFoundPageUpdateComponent;
  let fixture: ComponentFixture<LostFoundPageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let lostFoundPageFormService: LostFoundPageFormService;
  let lostFoundPageService: LostFoundPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LostFoundPageUpdateComponent],
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
      .overrideTemplate(LostFoundPageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LostFoundPageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    lostFoundPageFormService = TestBed.inject(LostFoundPageFormService);
    lostFoundPageService = TestBed.inject(LostFoundPageService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const lostFoundPage: ILostFoundPage = { id: 456 };

      activatedRoute.data = of({ lostFoundPage });
      comp.ngOnInit();

      expect(comp.lostFoundPage).toEqual(lostFoundPage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILostFoundPage>>();
      const lostFoundPage = { id: 123 };
      jest.spyOn(lostFoundPageFormService, 'getLostFoundPage').mockReturnValue(lostFoundPage);
      jest.spyOn(lostFoundPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lostFoundPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lostFoundPage }));
      saveSubject.complete();

      // THEN
      expect(lostFoundPageFormService.getLostFoundPage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(lostFoundPageService.update).toHaveBeenCalledWith(expect.objectContaining(lostFoundPage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILostFoundPage>>();
      const lostFoundPage = { id: 123 };
      jest.spyOn(lostFoundPageFormService, 'getLostFoundPage').mockReturnValue({ id: null });
      jest.spyOn(lostFoundPageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lostFoundPage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lostFoundPage }));
      saveSubject.complete();

      // THEN
      expect(lostFoundPageFormService.getLostFoundPage).toHaveBeenCalled();
      expect(lostFoundPageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILostFoundPage>>();
      const lostFoundPage = { id: 123 };
      jest.spyOn(lostFoundPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lostFoundPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(lostFoundPageService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
