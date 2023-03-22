import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmergencyGuide } from '../emergency-guide.model';

@Component({
  selector: 'jhi-emergency-guide-detail',
  templateUrl: './emergency-guide-detail.component.html',
})
export class EmergencyGuideDetailComponent implements OnInit {
  emergencyGuide: IEmergencyGuide | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emergencyGuide }) => {
      this.emergencyGuide = emergencyGuide;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
