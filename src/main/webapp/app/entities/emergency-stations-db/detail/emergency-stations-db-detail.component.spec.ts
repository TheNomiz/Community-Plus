import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmergencyStationsDbDetailComponent } from './emergency-stations-db-detail.component';

describe('EmergencyStations Management Detail Component', () => {
  let comp: EmergencyStationsDbDetailComponent;
  let fixture: ComponentFixture<EmergencyStationsDbDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmergencyStationsDbDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ emergencyStations: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EmergencyStationsDbDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EmergencyStationsDbDetailComponent);
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
