export interface IUserProfile {
  id: number;
  username?: string | null;
  verified?: boolean | null;
  privateAccount?: boolean | null;
  age?: number | null;
  accountType?: string | null;
  firstnames?: string | null;
  lastname?: string | null;
  password?: string | null;
  occupation?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  postalCode?: string | null;
  bio?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  communityPoints?: number | null;
  language?: string | null;
  gPS?: boolean | null;
  darkmode?: boolean | null;
  fontsize?: number | null;
}

export type NewUserProfile = Omit<IUserProfile, 'id'> & { id: null };
