import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 63022,
  name: 'Cotton',
  description: 'Steel red',
  startDate: dayjs('2023-03-07'),
  endDate: dayjs('2023-03-07'),
  latitude: 38618,
  longitude: 11383,
  address: 'one-to-one wireless',
};

export const sampleWithPartialData: IEvent = {
  id: 981,
  name: 'generating Tuna coherent',
  description: 'virtual',
  startDate: dayjs('2023-03-07'),
  endDate: dayjs('2023-03-07'),
  imageUrl: 'withdrawal hacking auxiliary',
  latitude: 29708,
  longitude: 68491,
  address: 'mint Locks',
};

export const sampleWithFullData: IEvent = {
  id: 74806,
  name: 'Court Hill payment',
  description: 'Avon Throughway Exclusive',
  startDate: dayjs('2023-03-07'),
  endDate: dayjs('2023-03-07'),
  imageUrl: 'indexing Strategist',
  latitude: 34866,
  longitude: 3033,
  address: 'Tuna Intelligent Republic)',
};

export const sampleWithNewData: NewEvent = {
  name: 'Home Legacy Avon',
  description: 'Suriname Granite tangible',
  startDate: dayjs('2023-03-07'),
  endDate: dayjs('2023-03-08'),
  latitude: 45372,
  longitude: 77606,
  address: 'teal Response FTP',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
