import dayjs from 'dayjs/esm';

import { ICrimeAlert, NewCrimeAlert } from './crime-alert.model';

export const sampleWithRequiredData: ICrimeAlert = {
  id: 45455,
  title: 'deposit Borders',
  description: 'ApplicationsXXXXXXXX',
  lat: 28188,
  lon: 3240,
  date: dayjs('2023-02-25T12:22'),
  crimeID: 39501,
};

export const sampleWithPartialData: ICrimeAlert = {
  id: 54771,
  title: 'Concrete Industrial',
  description: 'Brunei IntelligentXX',
  lat: 33855,
  lon: 39785,
  date: dayjs('2023-02-25T04:22'),
  crimeID: 43939,
};

export const sampleWithFullData: ICrimeAlert = {
  id: 65432,
  title: 'Indian Malagasy',
  description: 'Gardens Programmable',
  lat: 38832,
  lon: 6559,
  date: dayjs('2023-02-25T01:16'),
  crimeID: 91172,
};

export const sampleWithNewData: NewCrimeAlert = {
  title: 'Operations stable',
  description: 'CambridgeshireXXXXXX',
  lat: 33823,
  lon: 71773,
  date: dayjs('2023-02-24T20:30'),
  crimeID: 73173,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
