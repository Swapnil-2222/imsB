import dayjs from 'dayjs/esm';

import { ISecurityUser, NewSecurityUser } from './security-user.model';

export const sampleWithRequiredData: ISecurityUser = {
  id: 67981,
  login: 'panel',
  passwordHash: 'Massachusetts',
  activated: true,
};

export const sampleWithPartialData: ISecurityUser = {
  id: 45224,
  firstName: 'Tre',
  lastName: 'Lubowitz',
  businessTitle: 'Handcrafted connect',
  login: 'Ohio synthesize Producer',
  passwordHash: 'Response AI',
  email: 'Pearl9@gmail.com',
  activated: false,
  mobileNo: 'Home Electronics',
  oneTimePassword: 'Incredible Shoes SAS',
  otpExpiryTime: dayjs('2022-09-20T18:28'),
};

export const sampleWithFullData: ISecurityUser = {
  id: 6752,
  firstName: 'Scot',
  lastName: 'Gulgowski',
  designation: 'Park',
  businessTitle: 'copy',
  login: 'Keyboard Kids',
  passwordHash: 'Corporate',
  email: 'Chesley.Tillman20@gmail.com',
  imageUrl: 'violet Litas Versatile',
  activated: true,
  langKey: 'Pound',
  activationKey: 'utilize matrix instruction',
  resetKey: 'digital wireless',
  resetDate: dayjs('2022-09-20T20:49'),
  mobileNo: 'Grocery framework frame',
  oneTimePassword: 'Music Senior Tanzanian',
  otpExpiryTime: dayjs('2022-09-20T12:32'),
  lastModified: 'Ergonomic Program',
  lastModifiedBy: 'redundant',
};

export const sampleWithNewData: NewSecurityUser = {
  login: 'Chicken',
  passwordHash: 'Concrete',
  activated: true,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
