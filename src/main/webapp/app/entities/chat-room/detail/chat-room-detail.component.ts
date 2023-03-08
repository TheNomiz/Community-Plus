import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChatRoom } from '../chat-room.model';

@Component({
  selector: 'jhi-chat-room-detail',
  templateUrl: './chat-room-detail.component.html',
})
export class ChatRoomDetailComponent implements OnInit {
  chatRoom: IChatRoom | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chatRoom }) => {
      this.chatRoom = chatRoom;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
