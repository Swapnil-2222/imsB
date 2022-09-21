import { ISecurityRole, NewSecurityRole } from './security-role.model';

export const sampleWithRequiredData: ISecurityRole = {
  id: 76583,
  name: 'Plastic compressing New',
  lastModified: 'invoice',
  lastModifiedBy: 'microchip',
};

export const sampleWithPartialData: ISecurityRole = {
  id: 85737,
  name: 'Research Orchestrator',
  description: 'Strategist Awesome navigating',
  lastModified: 'Global salmon invoice',
  lastModifiedBy: 'Utah Function-based',
};

export const sampleWithFullData: ISecurityRole = {
  id: 61112,
  name: 'Account dynamic',
  description: 'Strategist',
  lastModified: 'enhance Jamahiriya',
  lastModifiedBy: 'synergistic online Forward',
};

export const sampleWithNewData: NewSecurityRole = {
  name: 'algorithm Expanded',
  lastModified: 'architect matrix payment',
  lastModifiedBy: 'tangible up',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
