import { IUser } from 'app/entities/user/user.model';

export interface IUserProfile {
  id: number;
  username?: string | null;
  firstnames?: string | null;
  lastname?: string | null;
  password?: string | null;
  email?: string | null;
  language?: string | null;
  verified?: boolean | null;
  privateAccount?: boolean | null;
  age?: number | null;
  accountType?: string | null;
  occupation?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  postalCode?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
  communityPoints?: number | null;
  gPS?: boolean | null;
  darkmode?: boolean | null;
  fontsize?: number | null;
  userID?: Pick<IUser, 'id'> | null;
}

export type NewUserProfile = Omit<IUserProfile, 'id'> & { id: null };
