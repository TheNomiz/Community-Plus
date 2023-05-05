import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmergencyStations, NewEmergencyStations } from '../emergency-stations-db.model';

export type PartialUpdateEmergencyStations = Partial<IEmergencyStations> & Pick<IEmergencyStations, 'id'>;

export type EntityResponseType = HttpResponse<IEmergencyStations>;
export type EntityArrayResponseType = HttpResponse<IEmergencyStations[]>;

@Injectable({ providedIn: 'root' })
export class EmergencyStationsDbService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/emergency-stations?page=0&size=1000');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(emergencyStationsDb: NewEmergencyStations): Observable<EntityResponseType> {
    return this.http.post<IEmergencyStations>(this.resourceUrl, emergencyStationsDb, { observe: 'response' });
  }

  update(emergencyStationsDb: IEmergencyStations): Observable<EntityResponseType> {
    return this.http.put<IEmergencyStations>(
      `${this.resourceUrl}/${this.getEmergencyStationsIdentifier(emergencyStationsDb)}`,
      emergencyStationsDb,
      { observe: 'response' }
    );
  }

  partialUpdate(emergencyStationsDb: PartialUpdateEmergencyStations): Observable<EntityResponseType> {
    return this.http.patch<IEmergencyStations>(
      `${this.resourceUrl}/${this.getEmergencyStationsIdentifier(emergencyStationsDb)}`,
      emergencyStationsDb,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEmergencyStations>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEmergencyStations[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEmergencyStationsIdentifier(emergencyStations: Pick<IEmergencyStations, 'id'>): number {
    return emergencyStations.id;
  }

  compareEmergencyStations(o1: Pick<IEmergencyStations, 'id'> | null, o2: Pick<IEmergencyStations, 'id'> | null): boolean {
    return o1 && o2 ? this.getEmergencyStationsIdentifier(o1) === this.getEmergencyStationsIdentifier(o2) : o1 === o2;
  }

  addEmergencyStationsToCollectionIfMissing<Type extends Pick<IEmergencyStations, 'id'>>(
    emergencyStationsCollection: Type[],
    ...emergencyStationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const emergencyStations: Type[] = emergencyStationsToCheck.filter(isPresent);
    if (emergencyStations.length > 0) {
      const emergencyStationsCollectionIdentifiers = emergencyStationsCollection.map(
        emergencyStationsItem => this.getEmergencyStationsIdentifier(emergencyStationsItem)!
      );
      const emergencyStationsToAdd = emergencyStations.filter(emergencyStationsItem => {
        const emergencyStationsIdentifier = this.getEmergencyStationsIdentifier(emergencyStationsItem);
        if (emergencyStationsCollectionIdentifiers.includes(emergencyStationsIdentifier)) {
          return false;
        }
        emergencyStationsCollectionIdentifiers.push(emergencyStationsIdentifier);
        return true;
      });
      return [...emergencyStationsToAdd, ...emergencyStationsCollection];
    }
    return emergencyStationsCollection;
  }
}

import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getPoliceStationData = async () => {
  const response = await axios.get('https://data.police.uk/api/leicestershire/NC04');

  const policeStations: NewEmergencyStations[] = response.data.map((PS: any) => {
    return {
      id: null,
      name: PS.locations.name,
      stationType: 'PoliceStation',
      latitude: PS.locations.latitude,
      longitude: PS.locations.longitude,
    };
  });

  return policeStations;
};

export default getPoliceStationData();
