export interface ILostFoundPage {
  id: number;
  description?: string | null;
}

export type NewLostFoundPage = Omit<ILostFoundPage, 'id'> & { id: null };
