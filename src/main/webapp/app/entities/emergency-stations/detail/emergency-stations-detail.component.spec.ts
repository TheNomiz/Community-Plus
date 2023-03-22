import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmergencyStationsDetailComponent } from './emergency-stations-detail.component';

describe('EmergencyStations Management Detail Component', () => {
  let comp: EmergencyStationsDetailComponent;
  let fixture: ComponentFixture<EmergencyStationsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmergencyStationsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ emergencyStations: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EmergencyStationsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EmergencyStationsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load emergencyStations on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.emergencyStations).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
