import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChatRoomComponent } from './list/chat-room.component';
import { ChatRoomDetailComponent } from './detail/chat-room-detail.component';
import { ChatRoomUpdateComponent } from './update/chat-room-update.component';
import { ChatRoomDeleteDialogComponent } from './delete/chat-room-delete-dialog.component';
import { ChatRoomRoutingModule } from './route/chat-room-routing.module';

@NgModule({
  imports: [SharedModule, ChatRoomRoutingModule],
  declarations: [ChatRoomComponent, ChatRoomDetailComponent, ChatRoomUpdateComponent, ChatRoomDeleteDialogComponent],
})
export class ChatRoomModule {}
