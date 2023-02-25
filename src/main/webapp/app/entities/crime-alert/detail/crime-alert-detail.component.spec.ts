import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CrimeAlertDetailComponent } from './crime-alert-detail.component';

describe('CrimeAlert Management Detail Component', () => {
  let comp: CrimeAlertDetailComponent;
  let fixture: ComponentFixture<CrimeAlertDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrimeAlertDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ crimeAlert: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CrimeAlertDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CrimeAlertDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load crimeAlert on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.crimeAlert).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
