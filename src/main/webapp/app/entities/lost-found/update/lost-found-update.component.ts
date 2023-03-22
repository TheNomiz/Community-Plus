import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LostFoundFormService, LostFoundFormGroup } from './lost-found-form.service';
import { ILostFound } from '../lost-found.model';
import { LostFoundService } from '../service/lost-found.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { IChatRoom } from 'app/entities/chat-room/chat-room.model';
import { ChatRoomService } from 'app/entities/chat-room/service/chat-room.service';

@Component({
  selector: 'jhi-lost-found-update',
  templateUrl: './lost-found-update.component.html',
})
export class LostFoundUpdateComponent implements OnInit {
  isSaving = false;
  lostFound: ILostFound | null = null;

  userProfilesSharedCollection: IUserProfile[] = [];
  chatRoomsSharedCollection: IChatRoom[] = [];

  editForm: LostFoundFormGroup = this.lostFoundFormService.createLostFoundFormGroup();

  constructor(
    protected lostFoundService: LostFoundService,
    protected lostFoundFormService: LostFoundFormService,
    protected userProfileService: UserProfileService,
    protected chatRoomService: ChatRoomService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  compareChatRoom = (o1: IChatRoom | null, o2: IChatRoom | null): boolean => this.chatRoomService.compareChatRoom(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lostFound }) => {
      this.lostFound = lostFound;
      if (lostFound) {
        this.updateForm(lostFound);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const lostFound = this.lostFoundFormService.getLostFound(this.editForm);
    if (lostFound.id !== null) {
      this.subscribeToSaveResponse(this.lostFoundService.update(lostFound));
    } else {
      this.subscribeToSaveResponse(this.lostFoundService.create(lostFound));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILostFound>>): void {
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

  protected updateForm(lostFound: ILostFound): void {
    this.lostFound = lostFound;
    this.lostFoundFormService.resetForm(this.editForm, lostFound);

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      lostFound.postedby
    );
    this.chatRoomsSharedCollection = this.chatRoomService.addChatRoomToCollectionIfMissing<IChatRoom>(
      this.chatRoomsSharedCollection,
      ...(lostFound.lostItems ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.lostFound?.postedby)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));

    this.chatRoomService
      .query()
      .pipe(map((res: HttpResponse<IChatRoom[]>) => res.body ?? []))
      .pipe(
        map((chatRooms: IChatRoom[]) =>
          this.chatRoomService.addChatRoomToCollectionIfMissing<IChatRoom>(chatRooms, ...(this.lostFound?.lostItems ?? []))
        )
      )
      .subscribe((chatRooms: IChatRoom[]) => (this.chatRoomsSharedCollection = chatRooms));
  }
}
