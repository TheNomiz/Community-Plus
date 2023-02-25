import dayjs from 'dayjs/esm';

import { ICrimeAlert, NewCrimeAlert } from './crime-alert.model';

export const sampleWithRequiredData: ICrimeAlert = {
  id: 45455,
  date: dayjs('2023-02-25T02:12'),
};

export const sampleWithPartialData: ICrimeAlert = {
  id: 54090,
  title: 'Frozen solutions',
  date: dayjs('2023-02-25T12:22'),
  lat: 39501,
  lon: 54771,
};

export const sampleWithFullData: ICrimeAlert = {
  id: 66094,
  title: 'plum',
  description: 'generating Small Function-based',
  date: dayjs('2023-02-25T04:46'),
  lat: 41494,
  lon: 43939,
};

export const sampleWithNewData: NewCrimeAlert = {
  date: dayjs('2023-02-24T22:37'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
