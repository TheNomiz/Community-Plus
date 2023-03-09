import { IEmergencyGuidePage, NewEmergencyGuidePage } from './emergency-guide-page.model';

export const sampleWithRequiredData: IEmergencyGuidePage = {
  id: 86957,
  emergencyType: 'B2C Metal 1080p',
};

export const sampleWithPartialData: IEmergencyGuidePage = {
  id: 90353,
  emergencyType: 'neural',
};

export const sampleWithFullData: IEmergencyGuidePage = {
  id: 33311,
  emergencyType: 'copy ADP Cambridgeshire',
};

export const sampleWithNewData: NewEmergencyGuidePage = {
  emergencyType: 'SMTP open-source core',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
