import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LostFoundPageDetailComponent } from './lost-found-page-detail.component';

describe('LostFoundPage Management Detail Component', () => {
  let comp: LostFoundPageDetailComponent;
  let fixture: ComponentFixture<LostFoundPageDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LostFoundPageDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ lostFoundPage: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LostFoundPageDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LostFoundPageDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load lostFoundPage on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.lostFoundPage).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
