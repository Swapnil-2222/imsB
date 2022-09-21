import { NotificationType } from 'app/entities/enumerations/notification-type.model';

import { INotification, NewNotification } from './notification.model';

export const sampleWithRequiredData: INotification = {
  id: 30621,
  massage: 'model',
  lastModified: 'withdrawal Brooks Towels',
  lastModifiedBy: 'Berkshire',
};

export const sampleWithPartialData: INotification = {
  id: 19242,
  massage: 'Swedish',
  freeField1: 'User',
  freeField2: 'Denmark digital Web',
  lastModified: 'hacking Wyoming',
  lastModifiedBy: 'tan',
};

export const sampleWithFullData: INotification = {
  id: 35450,
  massage: 'intermediate',
  notificationType: NotificationType['APPROVAL'],
  isActionRequired: false,
  freeField1: 'Representative cyan',
  freeField2: 'Books Berkshire',
  lastModified: 'Mobility',
  lastModifiedBy: 'Cotton Fresh Public-key',
};

export const sampleWithNewData: NewNotification = {
  massage: 'navigate Solutions',
  lastModified: 'calculate Palestinian microchip',
  lastModifiedBy: 'Games instruction',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
