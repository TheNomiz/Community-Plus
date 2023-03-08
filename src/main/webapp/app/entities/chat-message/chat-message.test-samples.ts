import dayjs from 'dayjs/esm';

import { IChatMessage, NewChatMessage } from './chat-message.model';

export const sampleWithRequiredData: IChatMessage = {
  id: 16788,
  content: 'mobile',
  sentDate: dayjs('2023-03-08'),
};

export const sampleWithPartialData: IChatMessage = {
  id: 67766,
  content: 'architectures Investment e-business',
  sentDate: dayjs('2023-03-07'),
};

export const sampleWithFullData: IChatMessage = {
  id: 41688,
  content: 'override Director National',
  sentDate: dayjs('2023-03-07'),
};

export const sampleWithNewData: NewChatMessage = {
  content: 'Regional bandwidth calculating',
  sentDate: dayjs('2023-03-07'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
