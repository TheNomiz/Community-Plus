import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmergencyGuidePage } from '../emergency-guide-page.model';

@Component({
  selector: 'jhi-emergency-guide-page-detail',
  templateUrl: './emergency-guide-page-detail.component.html',
})
export class EmergencyGuidePageDetailComponent implements OnInit {
  emergencyGuidePage: IEmergencyGuidePage | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emergencyGuidePage }) => {
      this.emergencyGuidePage = emergencyGuidePage;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
