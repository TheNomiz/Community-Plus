import { IUserProfile, NewUserProfile } from './user-profile.model';

export const sampleWithRequiredData: IUserProfile = {
  id: 10373,
  username: 'Account 3rd',
  firstnames: 'Toys Sausages',
  lastname: 'Cliffs leverage',
  password: 'Account',
  email: 'Kaleb.Simonis@gmail.com',
  language: 'motivating',
  verified: true,
  privateAccount: false,
  age: 54435,
  accountType: 'quantifying Streamlined Games',
  occupation: 'Ball Virgin District',
  postalCode: 'transmit Card',
  phoneNumber: 'SleekXXXXXX',
  gPS: false,
};

export const sampleWithPartialData: IUserProfile = {
  id: 77925,
  username: 'Tennessee wireless',
  firstnames: 'primary',
  lastname: 'withdrawal Chile Per',
  password: 'Metal Chips array',
  email: 'Werner_Bode56@hotmail.com',
  language: 'Chair task-force',
  verified: false,
  privateAccount: false,
  age: 29137,
  accountType: 'leading Pennsylvania Assistant',
  occupation: 'Investment',
  streetAddress: 'Representative Kenya Beauty',
  city: 'Scarlettport',
  postalCode: 'Latvian Australian',
  bio: 'Global',
  phoneNumber: 'TastyXXXXXX',
  communityPoints: 97221,
  gPS: false,
  darkmode: true,
  fontsize: 14658,
};

export const sampleWithFullData: IUserProfile = {
  id: 68813,
  username: 'Wooden',
  firstnames: 'bus Refined yellow',
  lastname: 'Dynamic Alabama',
  password: 'green Ergonomic Frozen',
  email: 'Fletcher_Zboncak@hotmail.com',
  language: 'Principal withdrawal',
  verified: false,
  privateAccount: false,
  age: 61998,
  accountType: 'Vatu withdrawal port',
  occupation: 'Mobility Flats onlin',
  streetAddress: 'Card Mill invoice',
  city: 'South Grant',
  postalCode: 'Designer',
  bio: 'Buckinghamshire',
  phoneNumber: 'synthesizing Glen',
  communityPoints: 59426,
  gPS: false,
  darkmode: true,
  fontsize: 47520,
};

export const sampleWithNewData: NewUserProfile = {
  username: 'ivory Bacon',
  firstnames: 'orange Chief',
  lastname: 'SCSI',
  password: 'leading-edge Bedfordshire',
  email: 'Cynthia.Schowalter97@gmail.com',
  language: 'Steel Czech Kentucky',
  verified: true,
  privateAccount: false,
  age: 87943,
  accountType: 'program',
  occupation: 'protocol application',
  postalCode: '24/365 mint',
  phoneNumber: 'Electronics Kids withdrawal',
  gPS: true,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
