import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { CrimeTypes } from 'app/entities/enumerations/crime-types.model';
import { IComment } from '../comment/comment.model';

export interface ICrimeAlert {
  id: number;
  title?: string | null;
  description?: string | null;
  lat?: number | null;
  lon?: number | null;
  date?: dayjs.Dayjs | null;
  crimeID?: number | null;
  crimeType?: CrimeTypes | null;
  crimePhoto1?: string | null;
  crimePhoto1ContentType?: string | null;
  crimePhoto2?: string | null;
  crimePhoto2ContentType?: string | null;
  crimePhoto3?: string | null;
  crimePhoto3ContentType?: string | null;
  postedby?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewCrimeAlert = Omit<ICrimeAlert, 'id'> & { id: null };
