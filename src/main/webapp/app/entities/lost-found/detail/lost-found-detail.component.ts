import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILostFound } from '../lost-found.model';

@Component({
  selector: 'jhi-lost-found-detail',
  templateUrl: './lost-found-detail.component.html',
})
export class LostFoundDetailComponent implements OnInit {
  lostFound: ILostFound | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lostFound }) => {
      this.lostFound = lostFound;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
