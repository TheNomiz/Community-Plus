import { IChatRoom, NewChatRoom } from './chat-room.model';

export const sampleWithRequiredData: IChatRoom = {
  id: 64064,
  name: 'orange neural Steel',
};

export const sampleWithPartialData: IChatRoom = {
  id: 71194,
  name: 'Program incentivize',
};

export const sampleWithFullData: IChatRoom = {
  id: 61492,
  name: 'Towels',
};

export const sampleWithNewData: NewChatRoom = {
  name: 'bluetooth Pennsylvania',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
