import { IChatRoom } from 'app/entities/chat-room/chat-room.model';

export interface IBusiness {
  id: number;
  name?: string | null;
  description?: string | null;
  category?: string | null;
  phoneNumber?: number | null;
  email?: string | null;
  websiteUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  busrooms?: Pick<IChatRoom, 'id'>[] | null;
}

export type NewBusiness = Omit<IBusiness, 'id'> & { id: null };
