import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { IChatRoom } from 'app/entities/chat-room/chat-room.model';
import { BusinessCategory } from 'app/entities/enumerations/business-category.model';

export interface IBusiness {
  id: number;
  name?: string | null;
  description?: string | null;
  category?: BusinessCategory | null;
  phoneNumber?: string | null;
  email?: string | null;
  websiteUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  postedby?: Pick<IUserProfile, 'id'> | null;
  businessrooms?: Pick<IChatRoom, 'id'>[] | null;
}

export type NewBusiness = Omit<IBusiness, 'id'> & { id: null };
