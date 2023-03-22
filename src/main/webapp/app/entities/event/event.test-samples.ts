import dayjs from 'dayjs/esm';

import { EventCategory } from 'app/entities/enumerations/event-category.model';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 63022,
  name: 'Cotton',
  description: 'Steel red',
  startDate: dayjs('2023-03-07'),
  endDate: dayjs('2023-03-07'),
  latitude: 38618,
  category: EventCategory['Sport'],
  longitude: 65385,
  address: 'teal Dollar',
};

export const sampleWithPartialData: IEvent = {
  id: 88160,
  name: 'Personal deposit sky',
  description: 'paradigm transmit generation',
  startDate: dayjs('2023-03-08'),
  endDate: dayjs('2023-03-07'),
  latitude: 79048,
  category: EventCategory['Sport'],
  longitude: 69469,
  address: 'Iraqi',
};

export const sampleWithFullData: IEvent = {
  id: 17194,
  name: 'Locks input',
  description: 'indexing',
  startDate: dayjs('2023-03-07'),
  endDate: dayjs('2023-03-07'),
  imageUrl: 'Tasty Throughway',
  latitude: 25052,
  category: EventCategory['Conference'],
  longitude: 34210,
  address: 'indexing Fords Planner',
};

export const sampleWithNewData: NewEvent = {
  name: 'panel',
  description: 'Intelligent',
  startDate: dayjs('2023-03-08'),
  endDate: dayjs('2023-03-07'),
  latitude: 79629,
  category: EventCategory['Webinar'],
  longitude: 2668,
  address: 'Tunisia',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
