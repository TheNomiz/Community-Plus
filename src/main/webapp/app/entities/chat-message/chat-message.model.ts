import dayjs from 'dayjs/esm';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { IChatRoom } from 'app/entities/chat-room/chat-room.model';

export interface IChatMessage {
  id: number;
  content?: string | null;
  sentDate?: dayjs.Dayjs | null;
  postedby?: Pick<IUserProfile, 'id'> | null;
  room?: Pick<IChatRoom, 'id'> | null;
}

export type NewChatMessage = Omit<IChatMessage, 'id'> & { id: null };
