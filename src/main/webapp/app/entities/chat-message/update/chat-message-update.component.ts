import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ChatMessageFormService, ChatMessageFormGroup } from './chat-message-form.service';
import { IChatMessage } from '../chat-message.model';
import { ChatMessageService } from '../service/chat-message.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { IChatRoom } from 'app/entities/chat-room/chat-room.model';
import { ChatRoomService } from 'app/entities/chat-room/service/chat-room.service';

@Component({
  selector: 'jhi-chat-message-update',
  templateUrl: './chat-message-update.component.html',
})
export class ChatMessageUpdateComponent implements OnInit {
  isSaving = false;
  chatMessage: IChatMessage | null = null;

  userProfilesSharedCollection: IUserProfile[] = [];
  chatRoomsSharedCollection: IChatRoom[] = [];

  editForm: ChatMessageFormGroup = this.chatMessageFormService.createChatMessageFormGroup();

  constructor(
    protected chatMessageService: ChatMessageService,
    protected chatMessageFormService: ChatMessageFormService,
    protected userProfileService: UserProfileService,
    protected chatRoomService: ChatRoomService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  compareChatRoom = (o1: IChatRoom | null, o2: IChatRoom | null): boolean => this.chatRoomService.compareChatRoom(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chatMessage }) => {
      this.chatMessage = chatMessage;
      if (chatMessage) {
        this.updateForm(chatMessage);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chatMessage = this.chatMessageFormService.getChatMessage(this.editForm);
    if (chatMessage.id !== null) {
      this.subscribeToSaveResponse(this.chatMessageService.update(chatMessage));
    } else {
      this.subscribeToSaveResponse(this.chatMessageService.create(chatMessage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChatMessage>>): void {
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

  protected updateForm(chatMessage: IChatMessage): void {
    this.chatMessage = chatMessage;
    this.chatMessageFormService.resetForm(this.editForm, chatMessage);

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      chatMessage.postedby
    );
    this.chatRoomsSharedCollection = this.chatRoomService.addChatRoomToCollectionIfMissing<IChatRoom>(
      this.chatRoomsSharedCollection,
      chatMessage.room
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.chatMessage?.postedby)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));

    this.chatRoomService
      .query()
      .pipe(map((res: HttpResponse<IChatRoom[]>) => res.body ?? []))
      .pipe(
        map((chatRooms: IChatRoom[]) => this.chatRoomService.addChatRoomToCollectionIfMissing<IChatRoom>(chatRooms, this.chatMessage?.room))
      )
      .subscribe((chatRooms: IChatRoom[]) => (this.chatRoomsSharedCollection = chatRooms));
  }
}
