import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChatRoom } from '../chat-room.model';
import { ChatRoomService } from '../service/chat-room.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './chat-room-delete-dialog.component.html',
})
export class ChatRoomDeleteDialogComponent {
  chatRoom?: IChatRoom;

  constructor(protected chatRoomService: ChatRoomService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chatRoomService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
