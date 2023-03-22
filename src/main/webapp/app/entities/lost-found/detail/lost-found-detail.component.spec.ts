import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LostFoundDetailComponent } from './lost-found-detail.component';

describe('LostFound Management Detail Component', () => {
  let comp: LostFoundDetailComponent;
  let fixture: ComponentFixture<LostFoundDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LostFoundDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ lostFound: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LostFoundDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LostFoundDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load lostFound on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.lostFound).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
