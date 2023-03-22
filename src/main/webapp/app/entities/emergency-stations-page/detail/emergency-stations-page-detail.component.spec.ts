import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmergencyStationsPageDetailComponent } from './emergency-stations-page-detail.component';

describe('EmergencyStationsPage Management Detail Component', () => {
  let comp: EmergencyStationsPageDetailComponent;
  let fixture: ComponentFixture<EmergencyStationsPageDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmergencyStationsPageDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ emergencyStationsPage: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EmergencyStationsPageDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EmergencyStationsPageDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load emergencyStationsPage on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.emergencyStationsPage).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
