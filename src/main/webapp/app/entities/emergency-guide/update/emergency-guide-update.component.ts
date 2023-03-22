import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { EmergencyGuideFormService, EmergencyGuideFormGroup } from './emergency-guide-form.service';
import { IEmergencyGuide } from '../emergency-guide.model';
import { EmergencyGuideService } from '../service/emergency-guide.service';

@Component({
  selector: 'jhi-emergency-guide-update',
  templateUrl: './emergency-guide-update.component.html',
})
export class EmergencyGuideUpdateComponent implements OnInit {
  isSaving = false;
  emergencyGuide: IEmergencyGuide | null = null;

  editForm: EmergencyGuideFormGroup = this.emergencyGuideFormService.createEmergencyGuideFormGroup();

  constructor(
    protected emergencyGuideService: EmergencyGuideService,
    protected emergencyGuideFormService: EmergencyGuideFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emergencyGuide }) => {
      this.emergencyGuide = emergencyGuide;
      if (emergencyGuide) {
        this.updateForm(emergencyGuide);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const emergencyGuide = this.emergencyGuideFormService.getEmergencyGuide(this.editForm);
    if (emergencyGuide.id !== null) {
      this.subscribeToSaveResponse(this.emergencyGuideService.update(emergencyGuide));
    } else {
      this.subscribeToSaveResponse(this.emergencyGuideService.create(emergencyGuide));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmergencyGuide>>): void {
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

  protected updateForm(emergencyGuide: IEmergencyGuide): void {
    this.emergencyGuide = emergencyGuide;
    this.emergencyGuideFormService.resetForm(this.editForm, emergencyGuide);
  }
}
