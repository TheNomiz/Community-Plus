import { ILostFoundPage, NewLostFoundPage } from './lost-found-page.model';

export const sampleWithRequiredData: ILostFoundPage = {
  id: 98042,
  description: 'e-tailers',
};

export const sampleWithPartialData: ILostFoundPage = {
  id: 59164,
  description: 'Virgin Garden',
};

export const sampleWithFullData: ILostFoundPage = {
  id: 62400,
  description: 'National Rest scale',
};

export const sampleWithNewData: NewLostFoundPage = {
  description: 'Buckinghamshire parse Health',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
