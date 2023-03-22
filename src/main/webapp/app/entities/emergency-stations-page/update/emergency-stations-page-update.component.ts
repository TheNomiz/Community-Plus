import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { EmergencyStationsPageFormService, EmergencyStationsPageFormGroup } from './emergency-stations-page-form.service';
import { IEmergencyStationsPage } from '../emergency-stations-page.model';
import { EmergencyStationsPageService } from '../service/emergency-stations-page.service';

@Component({
  selector: 'jhi-emergency-stations-page-update',
  templateUrl: './emergency-stations-page-update.component.html',
})
export class EmergencyStationsPageUpdateComponent implements OnInit {
  isSaving = false;
  emergencyStationsPage: IEmergencyStationsPage | null = null;

  editForm: EmergencyStationsPageFormGroup = this.emergencyStationsPageFormService.createEmergencyStationsPageFormGroup();

  constructor(
    protected emergencyStationsPageService: EmergencyStationsPageService,
    protected emergencyStationsPageFormService: EmergencyStationsPageFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emergencyStationsPage }) => {
      this.emergencyStationsPage = emergencyStationsPage;
      if (emergencyStationsPage) {
        this.updateForm(emergencyStationsPage);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const emergencyStationsPage = this.emergencyStationsPageFormService.getEmergencyStationsPage(this.editForm);
    if (emergencyStationsPage.id !== null) {
      this.subscribeToSaveResponse(this.emergencyStationsPageService.update(emergencyStationsPage));
    } else {
      this.subscribeToSaveResponse(this.emergencyStationsPageService.create(emergencyStationsPage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmergencyStationsPage>>): void {
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

  protected updateForm(emergencyStationsPage: IEmergencyStationsPage): void {
    this.emergencyStationsPage = emergencyStationsPage;
    this.emergencyStationsPageFormService.resetForm(this.editForm, emergencyStationsPage);
  }
}
