import dayjs from 'dayjs/esm';

export interface ICrimeAlert {
  id: number;
  title?: string | null;
  description?: string | null;
  date?: dayjs.Dayjs | null;
  lat?: number | null;
  lon?: number | null;
}

export type NewCrimeAlert = Omit<ICrimeAlert, 'id'> & { id: null };
