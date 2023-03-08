import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { BusinessFormService, BusinessFormGroup } from './business-form.service';
import { IBusiness } from '../business.model';
import { BusinessService } from '../service/business.service';
import { IChatRoom } from 'app/entities/chat-room/chat-room.model';
import { ChatRoomService } from 'app/entities/chat-room/service/chat-room.service';

@Component({
  selector: 'jhi-business-update',
  templateUrl: './business-update.component.html',
})
export class BusinessUpdateComponent implements OnInit {
  isSaving = false;
  business: IBusiness | null = null;

  chatRoomsSharedCollection: IChatRoom[] = [];

  editForm: BusinessFormGroup = this.businessFormService.createBusinessFormGroup();

  constructor(
    protected businessService: BusinessService,
    protected businessFormService: BusinessFormService,
    protected chatRoomService: ChatRoomService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareChatRoom = (o1: IChatRoom | null, o2: IChatRoom | null): boolean => this.chatRoomService.compareChatRoom(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ business }) => {
      this.business = business;
      if (business) {
        this.updateForm(business);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const business = this.businessFormService.getBusiness(this.editForm);
    if (business.id !== null) {
      this.subscribeToSaveResponse(this.businessService.update(business));
    } else {
      this.subscribeToSaveResponse(this.businessService.create(business));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBusiness>>): void {
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

  protected updateForm(business: IBusiness): void {
    this.business = business;
    this.businessFormService.resetForm(this.editForm, business);

    this.chatRoomsSharedCollection = this.chatRoomService.addChatRoomToCollectionIfMissing<IChatRoom>(
      this.chatRoomsSharedCollection,
      ...(business.busrooms ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.chatRoomService
      .query()
      .pipe(map((res: HttpResponse<IChatRoom[]>) => res.body ?? []))
      .pipe(
        map((chatRooms: IChatRoom[]) =>
          this.chatRoomService.addChatRoomToCollectionIfMissing<IChatRoom>(chatRooms, ...(this.business?.busrooms ?? []))
        )
      )
      .subscribe((chatRooms: IChatRoom[]) => (this.chatRoomsSharedCollection = chatRooms));
  }
}
