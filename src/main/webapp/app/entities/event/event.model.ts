import dayjs from 'dayjs/esm';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { IChatRoom } from 'app/entities/chat-room/chat-room.model';
import { EventCategory } from 'app/entities/enumerations/event-category.model';

export interface IEvent {
  id: number;
  name?: string | null;
  description?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  imageUrl?: string | null;
  latitude?: number | null;
  category?: EventCategory | null;
  longitude?: number | null;
  address?: string | null;
  postedby?: Pick<IUserProfile, 'id'> | null;
  eventsrooms?: Pick<IChatRoom, 'id'>[] | null;
}

export type NewEvent = Omit<IEvent, 'id'> & { id: null };
