import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ChatRoomFormService, ChatRoomFormGroup } from './chat-room-form.service';
import { IChatRoom } from '../chat-room.model';
import { ChatRoomService } from '../service/chat-room.service';

@Component({
  selector: 'jhi-chat-room-update',
  templateUrl: './chat-room-update.component.html',
})
export class ChatRoomUpdateComponent implements OnInit {
  isSaving = false;
  chatRoom: IChatRoom | null = null;

  editForm: ChatRoomFormGroup = this.chatRoomFormService.createChatRoomFormGroup();

  constructor(
    protected chatRoomService: ChatRoomService,
    protected chatRoomFormService: ChatRoomFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chatRoom }) => {
      this.chatRoom = chatRoom;
      if (chatRoom) {
        this.updateForm(chatRoom);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chatRoom = this.chatRoomFormService.getChatRoom(this.editForm);
    if (chatRoom.id !== null) {
      this.subscribeToSaveResponse(this.chatRoomService.update(chatRoom));
    } else {
      this.subscribeToSaveResponse(this.chatRoomService.create(chatRoom));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChatRoom>>): void {
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

  protected updateForm(chatRoom: IChatRoom): void {
    this.chatRoom = chatRoom;
    this.chatRoomFormService.resetForm(this.editForm, chatRoom);
  }
}
