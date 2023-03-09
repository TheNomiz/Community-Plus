export interface IEmergencyGuidePage {
  id: number;
  emergencyType?: string | null;
}

export type NewEmergencyGuidePage = Omit<IEmergencyGuidePage, 'id'> & { id: null };
