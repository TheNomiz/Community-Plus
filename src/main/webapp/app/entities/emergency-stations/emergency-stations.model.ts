import { StationsCategory } from 'app/entities/enumerations/stations-category.model';

export interface IEmergencyStations {
  id: number;
  name?: string | null;
  stationType?: StationsCategory | null;
  wheelchairAccess?: boolean | null;
  parking?: boolean | null;
  latitude?: number | null;
  longitude?: number | null;
}

export type NewEmergencyStations = Omit<IEmergencyStations, 'id'> & { id: null };
