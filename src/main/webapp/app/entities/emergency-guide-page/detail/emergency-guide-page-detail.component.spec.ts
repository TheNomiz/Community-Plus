import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmergencyGuidePageDetailComponent } from './emergency-guide-page-detail.component';

describe('EmergencyGuidePage Management Detail Component', () => {
  let comp: EmergencyGuidePageDetailComponent;
  let fixture: ComponentFixture<EmergencyGuidePageDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmergencyGuidePageDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ emergencyGuidePage: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EmergencyGuidePageDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EmergencyGuidePageDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load emergencyGuidePage on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.emergencyGuidePage).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
