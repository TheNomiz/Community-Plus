import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmergencyGuideDetailComponent } from './emergency-guide-detail.component';

describe('EmergencyGuide Management Detail Component', () => {
  let comp: EmergencyGuideDetailComponent;
  let fixture: ComponentFixture<EmergencyGuideDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmergencyGuideDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ emergencyGuide: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EmergencyGuideDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EmergencyGuideDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load emergencyGuide on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.emergencyGuide).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
