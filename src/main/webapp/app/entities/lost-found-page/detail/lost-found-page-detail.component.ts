import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILostFoundPage } from '../lost-found-page.model';

@Component({
  selector: 'jhi-lost-found-page-detail',
  templateUrl: './lost-found-page-detail.component.html',
})
export class LostFoundPageDetailComponent implements OnInit {
  lostFoundPage: ILostFoundPage | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lostFoundPage }) => {
      this.lostFoundPage = lostFoundPage;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
