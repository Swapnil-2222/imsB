import dayjs from 'dayjs/esm';

export interface IProject {
  id: number;
  name?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  departmentName?: string | null;
  budget?: string | null;
  freeField1?: string | null;
  freeField2?: string | null;
  freeField3?: string | null;
  lastModified?: string | null;
  lastModifiedBy?: string | null;
}

export type NewProject = Omit<IProject, 'id'> & { id: null };
