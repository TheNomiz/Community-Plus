import { IEmergencyGuide, NewEmergencyGuide } from './emergency-guide.model';

export const sampleWithRequiredData: IEmergencyGuide = {
  id: 29766,
  emergencyType: 'Chicken XML',
  panicButton: false,
};

export const sampleWithPartialData: IEmergencyGuide = {
  id: 38908,
  emergencyType: 'Cambridgeshire Fresh',
  panicButton: true,
};

export const sampleWithFullData: IEmergencyGuide = {
  id: 56842,
  emergencyType: 'Yen Optional Director',
  panicButton: true,
};

export const sampleWithNewData: NewEmergencyGuide = {
  emergencyType: 'Investment Yuan',
  panicButton: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
