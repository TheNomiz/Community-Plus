import dayjs from 'dayjs/esm';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { IChatRoom } from 'app/entities/chat-room/chat-room.model';

export interface ILostFound {
  id: number;
  description?: string | null;
  date?: dayjs.Dayjs | null;
  location?: string | null;
  item?: string | null;
  name?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  postedby?: Pick<IUserProfile, 'id'> | null;
  lostItems?: Pick<IChatRoom, 'id'>[] | null;
}

export type NewLostFound = Omit<ILostFound, 'id'> & { id: null };
