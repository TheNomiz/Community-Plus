import { BusinessCategory } from 'app/entities/enumerations/business-category.model';

import { IBusiness, NewBusiness } from './business.model';

export const sampleWithRequiredData: IBusiness = {
  id: 11970,
  name: 'initiatives Unbranded circuit',
  description: 'Assistant',
  category: BusinessCategory['GroceryStore'],
  phoneNumber: 'paradigms turquoise',
  email: 'Davion.Muller56@hotmail.com',
  latitude: 86843,
  longitude: 66683,
};

export const sampleWithPartialData: IBusiness = {
  id: 59859,
  name: 'Diverse Cheese up',
  description: 'Executive Borders Bike',
  category: BusinessCategory['Other'],
  phoneNumber: 'application cross-platform',
  email: 'Brooklyn.Walsh55@gmail.com',
  websiteUrl: 'system',
  latitude: 24513,
  longitude: 64765,
};

export const sampleWithFullData: IBusiness = {
  id: 41205,
  name: 'Shirt Self-enabling',
  description: 'Investor Card',
  category: BusinessCategory['GroceryStore'],
  phoneNumber: 'Division green override',
  email: 'Magdalena_Jacobi69@gmail.com',
  websiteUrl: 'Texas analyzing Maryland',
  latitude: 74875,
  longitude: 60773,
};

export const sampleWithNewData: NewBusiness = {
  name: 'Baby Licensed XML',
  description: 'Marks Bedfordshire Salad',
  category: BusinessCategory['Other'],
  phoneNumber: 'attitude-oriented Arkansas',
  email: 'Benjamin.Watsica@gmail.com',
  latitude: 69842,
  longitude: 3169,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
