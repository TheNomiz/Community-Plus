import { IEmergencyStationsPage, NewEmergencyStationsPage } from './emergency-stations-page.model';

export const sampleWithRequiredData: IEmergencyStationsPage = {
  id: 70867,
  name: 'Salad',
  stationType: 'feed',
  latitude: 62457,
  longitude: 2359,
};

export const sampleWithPartialData: IEmergencyStationsPage = {
  id: 17226,
  name: 'bypass',
  stationType: 'Nevada technologies',
  latitude: 51028,
  longitude: 13775,
};

export const sampleWithFullData: IEmergencyStationsPage = {
  id: 81006,
  name: 'Exclusive input Direct',
  stationType: 'Steel',
  latitude: 57962,
  longitude: 1763,
};

export const sampleWithNewData: NewEmergencyStationsPage = {
  name: 'salmon solution',
  stationType: 'infomediaries',
  latitude: 37707,
  longitude: 32852,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
