import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmergencyStations } from '../emergency-stations.model';

@Component({
  selector: 'jhi-emergency-stations-detail',
  templateUrl: './emergency-stations-detail.component.html',
})
export class EmergencyStationsDetailComponent implements OnInit {
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
