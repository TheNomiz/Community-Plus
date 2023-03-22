import dayjs from 'dayjs/esm';

import { ILostFound, NewLostFound } from './lost-found.model';

export const sampleWithRequiredData: ILostFound = {
  id: 58405,
  description: 'neutral program maroon',
  date: dayjs('2023-03-21'),
  location: 'Iran SQL Lesotho',
  item: 'XML cultivate web-readiness',
  name: 'Sports',
  email: 'Cortez11@gmail.com',
  phoneNumber: 'incentivize toolset',
};

export const sampleWithPartialData: ILostFound = {
  id: 83300,
  description: 'bypass',
  date: dayjs('2023-03-21'),
  location: 'Face',
  item: 'withdrawal Granite invoice',
  name: 'Computers Oklahoma end-to-end',
  email: 'Buddy.Boyer7@hotmail.com',
  phoneNumber: 'TunaXXXXXXX',
};

export const sampleWithFullData: ILostFound = {
  id: 14068,
  description: 'Supervisor',
  date: dayjs('2023-03-21'),
  location: 'Infrastructure connecting Horizontal',
  item: 'Berkshire Light Facilitator',
  name: 'Kuna',
  email: 'Vern_Schimmel@gmail.com',
  phoneNumber: 'Producer Wooden portals',
};

export const sampleWithNewData: NewLostFound = {
  description: 'supply-chains',
  date: dayjs('2023-03-22'),
  location: 'USB mobile Hat',
  item: 'Colombia Senior primary',
  name: 'user',
  email: 'Karina.Paucek@gmail.com',
  phoneNumber: 'Senior Account toolset',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
