import { IEvent } from 'app/entities/event/event.model';
import { IBusiness } from 'app/entities/business/business.model';

export interface IChatRoom {
  id: number;
  name?: string | null;
  events?: Pick<IEvent, 'id'>[] | null;
  businesses?: Pick<IBusiness, 'id'>[] | null;
}

export type NewChatRoom = Omit<IChatRoom, 'id'> & { id: null };
