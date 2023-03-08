import dayjs from 'dayjs/esm';
import { IChatRoom } from 'app/entities/chat-room/chat-room.model';

export interface IEvent {
  id: number;
  name?: string | null;
  description?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  imageUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  eventrooms?: Pick<IChatRoom, 'id'>[] | null;
}

export type NewEvent = Omit<IEvent, 'id'> & { id: null };
