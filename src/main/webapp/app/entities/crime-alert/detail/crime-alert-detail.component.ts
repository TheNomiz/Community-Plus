import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICrimeAlert } from '../crime-alert.model';

@Component({
  selector: 'jhi-crime-alert-detail',
  templateUrl: './crime-alert-detail.component.html',
})
export class CrimeAlertDetailComponent implements OnInit {
  crimeAlert: ICrimeAlert | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ crimeAlert }) => {
      this.crimeAlert = crimeAlert;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
