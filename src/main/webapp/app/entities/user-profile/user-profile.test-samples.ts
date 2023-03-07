import { IUserProfile, NewUserProfile } from './user-profile.model';

export const sampleWithRequiredData: IUserProfile = {
  id: 10373,
  username: 'Account 3rd',
  name: 'Toys Sausages',
  password: 'Cliffs leverage',
  occupation: 'Account',
};

export const sampleWithPartialData: IUserProfile = {
  id: 9713,
  username: 'indexing Computer',
  name: 'Switzerland payment',
  password: 'TCP 1080p pixel',
  occupation: 'Virgin District invoice',
};

export const sampleWithFullData: IUserProfile = {
  id: 14421,
  username: 'firewall Sleek',
  name: 'Metrics',
  password: 'Texas Parkways',
  occupation: 'wireless',
};

export const sampleWithNewData: NewUserProfile = {
  username: 'primary',
  name: 'withdrawal Chile Personal',
  password: 'Metal Chips array',
  occupation: 'Executive Loan Chair',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
