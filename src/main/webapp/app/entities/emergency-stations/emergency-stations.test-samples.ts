import { StationsCategory } from 'app/entities/enumerations/stations-category.model';

import { IEmergencyStations, NewEmergencyStations } from './emergency-stations.model';

export const sampleWithRequiredData: IEmergencyStations = {
  id: 20444,
  name: 'open-source algorithm',
  stationType: StationsCategory['Hospital'],
  latitude: 96292,
  longitude: 81409,
};

export const sampleWithPartialData: IEmergencyStations = {
  id: 24777,
  name: 'Investment Intelligent',
  stationType: StationsCategory['Pharmacy'],
  wheelchairAccess: false,
  parking: true,
  latitude: 64362,
  longitude: 51720,
};

export const sampleWithFullData: IEmergencyStations = {
  id: 73543,
  name: 'parsing Creative pink',
  stationType: StationsCategory['Hospital'],
  wheelchairAccess: true,
  parking: false,
  latitude: 57153,
  longitude: 73820,
};

export const sampleWithNewData: NewEmergencyStations = {
  name: 'Hat IB',
  stationType: StationsCategory['Pharmacy'],
  latitude: 75169,
  longitude: 6824,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
