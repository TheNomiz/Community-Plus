import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface ICrimeAlert {
  id: number;
  title?: string | null;
  description?: string | null;
  lat?: number | null;
  lon?: number | null;
  date?: dayjs.Dayjs | null;
  crimeID?: number | null;
  postedby?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewCrimeAlert = Omit<ICrimeAlert, 'id'> & { id: null };
