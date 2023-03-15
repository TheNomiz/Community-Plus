import { IUserProfile, NewUserProfile } from './user-profile.model';

export const sampleWithRequiredData: IUserProfile = {
  id: 10373,
  username: 'Account 3rd',
  verified: true,
  privateAccount: false,
  age: 55259,
  accountType: 'Sausages vortals Berkshire',
  firstnames: 'Rubber',
  lastname: 'Awesome communities ',
  password: 'real-time quantifying Streamlined',
  occupation: 'Bacon',
  postalCode: 'pixel',
  email: 'Kailyn89@hotmail.com',
  phoneNumber: undefined,
  language: 'Card',
  gPS: false,
};

export const sampleWithPartialData: IUserProfile = {
  id: 67966,
  username: 'Texas Parkways',
  verified: false,
  privateAccount: true,
  age: 67478,
  accountType: 'Jewelery Metal',
  firstnames: 'Chair Program',
  lastname: 'array',
  password: 'International Tokelau Handcrafted',
  occupation: 'leverage Kansas',
  city: 'West Estevan',
  postalCode: 'compressing',
  bio: 'Pennsylvania',
  email: 'Rocio62@hotmail.com',
  phoneNumber: undefined,
  language: 'Kenya',
  gPS: false,
  darkmode: true,
  fontsize: 41154,
};

export const sampleWithFullData: IUserProfile = {
  id: 52748,
  username: 'Inlet Avon Steel',
  verified: true,
  privateAccount: false,
  age: 10454,
  accountType: 'Usability GB Movies',
  firstnames: 'Practical',
  lastname: 'overriding RSS Gener',
  password: 'magenta Beauty green',
  occupation: 'Incredible',
  streetAddress: 'Squares Analyst Cambridgeshire',
  city: 'New Henriette',
  postalCode: 'intuitive synthesize calculate',
  bio: 'port Chief RSS',
  email: 'Ozella_Kshlerin60@gmail.com',
  phoneNumber: undefined,
  communityPoints: 76802,
  language: 'human-resource Tasty microchip',
  gPS: true,
  darkmode: true,
  fontsize: 54237,
};

export const sampleWithNewData: NewUserProfile = {
  username: 'digital static software',
  verified: true,
  privateAccount: false,
  age: 75728,
  accountType: 'Bacon Bedfordshire capacitor',
  firstnames: 'Fresh leading-edge B',
  lastname: 'gold',
  password: 'Developer',
  occupation: 'payment',
  postalCode: 'Kentucky TCP',
  email: 'Moshe50@gmail.com',
  phoneNumber: undefined,
  language: 'matrix Bike',
  gPS: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
