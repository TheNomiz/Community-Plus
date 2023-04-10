import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { ICrimeAlert } from 'app/entities/crime-alert/crime-alert.model';

export interface IComment {
  id: number;
  comment?: string | null;
  date?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  crime?: Pick<ICrimeAlert, 'id'> | null;
}

export type NewComment = Omit<IComment, 'id'> & { id: null };
