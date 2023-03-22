import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmergencyStationsPage } from '../emergency-stations-page.model';

@Component({
  selector: 'jhi-emergency-stations-page-detail',
  templateUrl: './emergency-stations-page-detail.component.html',
})
export class EmergencyStationsPageDetailComponent implements OnInit {
  emergencyStationsPage: IEmergencyStationsPage | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emergencyStationsPage }) => {
      this.emergencyStationsPage = emergencyStationsPage;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
