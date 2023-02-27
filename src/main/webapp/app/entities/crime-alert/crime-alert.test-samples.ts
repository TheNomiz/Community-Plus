import dayjs from 'dayjs/esm';

import { ICrimeAlert, NewCrimeAlert } from './crime-alert.model';

export const sampleWithRequiredData: ICrimeAlert = {
  id: 45455,
  title: 'deposit Borders',
  description: 'ApplicationsXXXXXXXX',
  lat: 28188,
  lon: 3240,
  date: dayjs('2023-02-25T12:22'),
};

export const sampleWithPartialData: ICrimeAlert = {
  id: 39501,
  title: 'deposit Account',
  description: 'Credit Concrete synergize',
  lat: 65432,
  lon: 37976,
  date: dayjs('2023-02-25T01:07'),
};

export const sampleWithFullData: ICrimeAlert = {
  id: 12524,
  title: 'Malagasy',
  description: 'Gardens Programmable',
  lat: 38832,
  lon: 6559,
  date: dayjs('2023-02-25T01:16'),
};

export const sampleWithNewData: NewCrimeAlert = {
  title: 'Vista morph paradigms',
  description: 'pink input exudingXX',
  lat: 94226,
  lon: 58977,
  date: dayjs('2023-02-24T22:06'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
