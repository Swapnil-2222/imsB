import dayjs from 'dayjs/esm';

import { IProject, NewProject } from './project.model';

export const sampleWithRequiredData: IProject = {
  id: 55962,
};

export const sampleWithPartialData: IProject = {
  id: 65513,
  name: 'Slovenia',
  startDate: dayjs('2022-09-20T17:52'),
  endDate: dayjs('2022-09-20T23:05'),
  departmentName: 'Communications Implemented dot-com',
  freeField3: 'Health capacitor',
  lastModified: 'Investor Loan Avon',
  lastModifiedBy: 'secondary users invoice',
};

export const sampleWithFullData: IProject = {
  id: 81146,
  name: 'mindshare Florida',
  startDate: dayjs('2022-09-20T20:38'),
  endDate: dayjs('2022-09-20T23:46'),
  departmentName: 'applications Enterprise-wide Sausages',
  budget: 'state USB capability',
  freeField1: 'Canyon syndicate',
  freeField2: 'fresh-thinking Granite EXE',
  freeField3: 'leading Developer',
  lastModified: 'open-source Auto',
  lastModifiedBy: 'Bacon Operative',
};

export const sampleWithNewData: NewProject = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
