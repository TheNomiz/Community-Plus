import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LostFoundPageFormService, LostFoundPageFormGroup } from './lost-found-page-form.service';
import { ILostFoundPage } from '../lost-found-page.model';
import { LostFoundPageService } from '../service/lost-found-page.service';

@Component({
  selector: 'jhi-lost-found-page-update',
  templateUrl: './lost-found-page-update.component.html',
})
export class LostFoundPageUpdateComponent implements OnInit {
  isSaving = false;
  lostFoundPage: ILostFoundPage | null = null;

  editForm: LostFoundPageFormGroup = this.lostFoundPageFormService.createLostFoundPageFormGroup();

  constructor(
    protected lostFoundPageService: LostFoundPageService,
    protected lostFoundPageFormService: LostFoundPageFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lostFoundPage }) => {
      this.lostFoundPage = lostFoundPage;
      if (lostFoundPage) {
        this.updateForm(lostFoundPage);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const lostFoundPage = this.lostFoundPageFormService.getLostFoundPage(this.editForm);
    if (lostFoundPage.id !== null) {
      this.subscribeToSaveResponse(this.lostFoundPageService.update(lostFoundPage));
    } else {
      this.subscribeToSaveResponse(this.lostFoundPageService.create(lostFoundPage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILostFoundPage>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(lostFoundPage: ILostFoundPage): void {
    this.lostFoundPage = lostFoundPage;
    this.lostFoundPageFormService.resetForm(this.editForm, lostFoundPage);
  }
}
