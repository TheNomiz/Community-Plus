import { IBusiness, NewBusiness } from './business.model';

export const sampleWithRequiredData: IBusiness = {
  id: 11970,
  name: 'initiatives Unbranded circuit',
  description: 'Assistant',
  category: 'Indonesia Concrete',
  phoneNumber: 77831,
  latitude: 84210,
  longitude: 23827,
};

export const sampleWithPartialData: IBusiness = {
  id: 5165,
  name: 'SMTP Credit',
  description: 'circuit',
  category: 'up',
  phoneNumber: 87772,
  email: 'Bell_Hickle@hotmail.com',
  websiteUrl: 'Bike ADP',
  latitude: 78452,
  longitude: 60303,
};

export const sampleWithFullData: IBusiness = {
  id: 78567,
  name: 'Sausages architectures',
  description: 'Club withdrawal Shirt',
  category: 'virtual',
  phoneNumber: 91975,
  email: 'Tremaine_Monahan@yahoo.com',
  websiteUrl: 'Chief Electronics',
  latitude: 66506,
  longitude: 74944,
};

export const sampleWithNewData: NewBusiness = {
  name: 'blue',
  description: 'parse generating',
  category: 'analyzing Maryland',
  phoneNumber: 74875,
  latitude: 60773,
  longitude: 76208,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
