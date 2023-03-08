import dayjs from 'dayjs/esm';
import { IChatRoom } from 'app/entities/chat-room/chat-room.model';

export interface IChatMessage {
  id: number;
  content?: string | null;
  sentDate?: dayjs.Dayjs | null;
  room?: Pick<IChatRoom, 'id'> | null;
}

export type NewChatMessage = Omit<IChatMessage, 'id'> & { id: null };
