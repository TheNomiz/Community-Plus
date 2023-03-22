export interface IEmergencyGuide {
  id: number;
  emergencyType?: string | null;
  panicButton?: boolean | null;
}

export type NewEmergencyGuide = Omit<IEmergencyGuide, 'id'> & { id: null };
