import dayjs from 'dayjs/esm';

import { IComment, NewComment } from './comment.model';

export const sampleWithRequiredData: IComment = {
  id: 78899,
  comment: 'Coordinator',
  date: dayjs('2023-04-09T16:45'),
};

export const sampleWithPartialData: IComment = {
  id: 34202,
  comment: 'Baby New',
  date: dayjs('2023-04-10T10:57'),
};

export const sampleWithFullData: IComment = {
  id: 37490,
  comment: 'circuit Health',
  date: dayjs('2023-04-09T13:57'),
};

export const sampleWithNewData: NewComment = {
  comment: 'Investment Macedonia Creative',
  date: dayjs('2023-04-09T14:34'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
