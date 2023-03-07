export interface IUserProfile {
  id: number;
  username?: string | null;
  name?: string | null;
  password?: string | null;
  occupation?: string | null;
}

export type NewUserProfile = Omit<IUserProfile, 'id'> & { id: null };
