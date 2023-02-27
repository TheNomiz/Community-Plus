import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CrimeAlertFormService, CrimeAlertFormGroup } from './crime-alert-form.service';
import { ICrimeAlert } from '../crime-alert.model';
import { CrimeAlertService } from '../service/crime-alert.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-crime-alert-update',
  templateUrl: './crime-alert-update.component.html',
})
export class CrimeAlertUpdateComponent implements OnInit {
  isSaving = false;
  crimeAlert: ICrimeAlert | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: CrimeAlertFormGroup = this.crimeAlertFormService.createCrimeAlertFormGroup();

  constructor(
    protected crimeAlertService: CrimeAlertService,
    protected crimeAlertFormService: CrimeAlertFormService,
    protected userService: UserService,
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