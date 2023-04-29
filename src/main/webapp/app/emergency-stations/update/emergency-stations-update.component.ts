import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { EmergencyStationsFormService, EmergencyStationsFormGroup } from './emergency-stations-form.service';
import { IEmergencyStations } from '../emergency-stations.model';
import { EmergencyStationsService } from '../service/emergency-stations.service';
import { StationsCategory } from 'app/entities/enumerations/stations-category.model';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-emergency-stations-update',
  templateUrl: './emergency-stations-update.component.html',
})
export class EmergencyStationsUpdateComponent implements OnInit {
  isSaving = false;
  emergencyStations: IEmergencyStations | null = null;
  stationsCategoryValues = Object.keys(StationsCategory);

  editForm: EmergencyStationsFormGroup = this.emergencyStationsFormService.createEmergencyStationsFormGroup();

  constructor(
    protected emergencyStationsService: EmergencyStationsService,
    protected emergencyStationsFormService: EmergencyStationsFormService,
    protected activatedRoute: ActivatedRoute,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emergencyStations }) => {
      this.emergencyStations = emergencyStations;
      if (emergencyStations) {
        this.updateForm(emergencyStations);
      }
    });
  }

  onCoordinatesChanged(coords: { lat: number; lon: number }): void {
    this.editForm.patchValue({
      latitude: coords.lat,
      longitude: coords.lon,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const emergencyStations = this.emergencyStationsFormService.getEmergencyStations(this.editForm);
    if (emergencyStations.id !== null) {
      this.subscribeToSaveResponse(this.emergencyStationsService.update(emergencyStations));
    } else {
      this.subscribeToSaveResponse(this.emergencyStationsService.create(emergencyStations));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmergencyStations>>): void {
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

  protected updateForm(emergencyStations: IEmergencyStations): void {
    this.emergencyStations = emergencyStations;
    this.emergencyStationsFormService.resetForm(this.editForm, emergencyStations);
  }
}
