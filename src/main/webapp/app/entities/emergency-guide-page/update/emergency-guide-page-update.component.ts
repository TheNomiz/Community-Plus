import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { EmergencyGuidePageFormService, EmergencyGuidePageFormGroup } from './emergency-guide-page-form.service';
import { IEmergencyGuidePage } from '../emergency-guide-page.model';
import { EmergencyGuidePageService } from '../service/emergency-guide-page.service';

@Component({
  selector: 'jhi-emergency-guide-page-update',
  templateUrl: './emergency-guide-page-update.component.html',
})
export class EmergencyGuidePageUpdateComponent implements OnInit {
  isSaving = false;
  emergencyGuidePage: IEmergencyGuidePage | null = null;

  editForm: EmergencyGuidePageFormGroup = this.emergencyGuidePageFormService.createEmergencyGuidePageFormGroup();

  constructor(
    protected emergencyGuidePageService: EmergencyGuidePageService,
    protected emergencyGuidePageFormService: EmergencyGuidePageFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emergencyGuidePage }) => {
      this.emergencyGuidePage = emergencyGuidePage;
      if (emergencyGuidePage) {
        this.updateForm(emergencyGuidePage);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const emergencyGuidePage = this.emergencyGuidePageFormService.getEmergencyGuidePage(this.editForm);
    if (emergencyGuidePage.id !== null) {
      this.subscribeToSaveResponse(this.emergencyGuidePageService.update(emergencyGuidePage));
    } else {
      this.subscribeToSaveResponse(this.emergencyGuidePageService.create(emergencyGuidePage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmergencyGuidePage>>): void {
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

  protected updateForm(emergencyGuidePage: IEmergencyGuidePage): void {
    this.emergencyGuidePage = emergencyGuidePage;
    this.emergencyGuidePageFormService.resetForm(this.editForm, emergencyGuidePage);
  }
}
