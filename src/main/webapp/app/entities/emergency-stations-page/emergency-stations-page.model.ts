export interface IEmergencyStationsPage {
  id: number;
  name?: string | null;
  stationType?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export type NewEmergencyStationsPage = Omit<IEmergencyStationsPage, 'id'> & { id: null };
