import dayjs from 'dayjs/esm';

import { CrimeTypes } from 'app/entities/enumerations/crime-types.model';

import { ICrimeAlert, NewCrimeAlert } from './crime-alert.model';

export const sampleWithRequiredData: ICrimeAlert = {
  id: 45455,
  title: 'deposit Borders',
  description: 'ApplicationsXXXXXXXX',
  lat: 28188,
  lon: 3240,
  date: dayjs('2023-02-25T12:22'),
  crimeID: 39501,
  crimeType: CrimeTypes['PUBLICORDER'],
};

export const sampleWithPartialData: ICrimeAlert = {
  id: 60618,
  title: 'Facilitator',
  description: 'Small Function-based synergize',
  lat: 65432,
  lon: 37976,
  date: dayjs('2023-02-25T01:07'),
  crimeID: 12524,
  crimeType: CrimeTypes['BURGLARY'],
  crimePhoto1: '../fake-data/blob/hipster.png',
  crimePhoto1ContentType: 'unknown',
};

export const sampleWithFullData: ICrimeAlert = {
  id: 68140,
  title: 'Borders radical',
  description: 'Berkshire Turkey Operations',
  lat: 27433,
  lon: 84116,
  date: dayjs('2023-02-25T04:26'),
  crimeID: 6021,
  crimeType: CrimeTypes['POSSESSIONOFWEAPONS'],
  crimePhoto1: '../fake-data/blob/hipster.png',
  crimePhoto1ContentType: 'unknown',
  crimePhoto2: '../fake-data/blob/hipster.png',
  crimePhoto2ContentType: 'unknown',
  crimePhoto3: '../fake-data/blob/hipster.png',
  crimePhoto3ContentType: 'unknown',
};

export const sampleWithNewData: NewCrimeAlert = {
  title: 'pink input exuding',
  description: 'North leading-edge Uganda',
  lat: 71348,
  lon: 91429,
  date: dayjs('2023-02-25T08:37'),
  crimeID: 18768,
  crimeType: CrimeTypes['ANTISOCIALBEHAVIOUR'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
