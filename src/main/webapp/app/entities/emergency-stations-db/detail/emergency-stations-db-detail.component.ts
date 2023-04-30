import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmergencyStations } from '../emergency-stations- db.model';

@Component({
  selector: 'jhi-emergency-stations-detail',
  templateUrl: './emergency-stations-db-detail.component.html',
})
export class EmergencyStationsDbDetailComponent implements OnInit {
  emergencyStations: IEmergencyStations | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emergencyStations }) => {
      this.emergencyStations = emergencyStations;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
