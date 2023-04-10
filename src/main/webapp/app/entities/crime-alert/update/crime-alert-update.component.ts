import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CrimeAlertFormService, CrimeAlertFormGroup } from './crime-alert-form.service';
import { ICrimeAlert } from '../crime-alert.model';
import { CrimeAlertService } from '../service/crime-alert.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { CrimeTypes } from 'app/entities/enumerations/crime-types.model';

@Component({
  selector: 'jhi-crime-alert-update',
  templateUrl: './crime-alert-update.component.html',
})
export class CrimeAlertUpdateComponent implements OnInit {
  isSaving = false;
  crimeAlert: ICrimeAlert | null = null;
  crimeTypesValues = Object.keys(CrimeTypes);

  usersSharedCollection: IUser[] = [];

  editForm: CrimeAlertFormGroup = this.crimeAlertFormService.createCrimeAlertFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected crimeAlertService: CrimeAlertService,
    protected crimeAlertFormService: CrimeAlertFormService,
    protected userService: UserService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ crimeAlert }) => {
      this.crimeAlert = crimeAlert;
      if (crimeAlert) {
        this.updateForm(crimeAlert);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const crimeAlert = this.crimeAlertFormService.getCrimeAlert(this.editForm);
    if (crimeAlert.id !== null) {
      this.subscribeToSaveResponse(this.crimeAlertService.update(crimeAlert));
    } else {
      this.subscribeToSaveResponse(this.crimeAlertService.create(crimeAlert));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICrimeAlert>>): void {
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

  protected updateForm(crimeAlert: ICrimeAlert): void {
    this.crimeAlert = crimeAlert;
    this.crimeAlertFormService.resetForm(this.editForm, crimeAlert);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, crimeAlert.postedby);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.crimeAlert?.postedby)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
