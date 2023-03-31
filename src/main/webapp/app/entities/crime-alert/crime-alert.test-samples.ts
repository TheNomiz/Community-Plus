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
  id: 66094,
  title: 'plum',
  description: 'generating Small Function-based',
  lat: 39785,
  lon: 41494,
  date: dayjs('2023-02-25T03:47'),
  crimeID: 65432,
  crimeType: CrimeTypes['DRUGS'],
};

export const sampleWithFullData: ICrimeAlert = {
  id: 55009,
  title: 'Public-key',
  description: 'withdrawal compressX',
  lat: 49899,
  lon: 38832,
  date: dayjs('2023-02-25T12:45'),
  crimeID: 54398,
  crimeType: CrimeTypes['VIOLENCEANDSEXUALOFFENCES'],
};

export const sampleWithNewData: NewCrimeAlert = {
  title: 'Operations stable',
  description: 'CambridgeshireXXXXXX',
  lat: 33823,
  lon: 71773,
  date: dayjs('2023-02-24T20:30'),
  crimeID: 73173,
  crimeType: CrimeTypes['ROBBERY'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
