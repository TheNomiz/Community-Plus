import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmergencyGuide, NewEmergencyGuide } from '../emergency-guide.model';

export type PartialUpdateEmergencyGuide = Partial<IEmergencyGuide> & Pick<IEmergencyGuide, 'id'>;

export type EntityResponseType = HttpResponse<IEmergencyGuide>;
export type EntityArrayResponseType = HttpResponse<IEmergencyGuide[]>;

@Injectable({ providedIn: 'root' })
export class EmergencyGuideService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/emergency-guides');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(emergencyGuide: NewEmergencyGuide): Observable<EntityResponseType> {
    return this.http.post<IEmergencyGuide>(this.resourceUrl, emergencyGuide, { observe: 'response' });
  }

  update(emergencyGuide: IEmergencyGuide): Observable<EntityResponseType> {
    return this.http.put<IEmergencyGuide>(`${this.resourceUrl}/${this.getEmergencyGuideIdentifier(emergencyGuide)}`, emergencyGuide, {
      observe: 'response',
    });
  }

  partialUpdate(emergencyGuide: PartialUpdateEmergencyGuide): Observable<EntityResponseType> {
    return this.http.patch<IEmergencyGuide>(`${this.resourceUrl}/${this.getEmergencyGuideIdentifier(emergencyGuide)}`, emergencyGuide, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEmergencyGuide>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEmergencyGuide[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEmergencyGuideIdentifier(emergencyGuide: Pick<IEmergencyGuide, 'id'>): number {
    return emergencyGuide.id;
  }

  compareEmergencyGuide(o1: Pick<IEmergencyGuide, 'id'> | null, o2: Pick<IEmergencyGuide, 'id'> | null): boolean {
    return o1 && o2 ? this.getEmergencyGuideIdentifier(o1) === this.getEmergencyGuideIdentifier(o2) : o1 === o2;
  }

  addEmergencyGuideToCollectionIfMissing<Type extends Pick<IEmergencyGuide, 'id'>>(
    emergencyGuideCollection: Type[],
    ...emergencyGuidesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const emergencyGuides: Type[] = emergencyGuidesToCheck.filter(isPresent);
    if (emergencyGuides.length > 0) {
      const emergencyGuideCollectionIdentifiers = emergencyGuideCollection.map(
        emergencyGuideItem => this.getEmergencyGuideIdentifier(emergencyGuideItem)!
      );
      const emergencyGuidesToAdd = emergencyGuides.filter(emergencyGuideItem => {
        const emergencyGuideIdentifier = this.getEmergencyGuideIdentifier(emergencyGuideItem);
        if (emergencyGuideCollectionIdentifiers.includes(emergencyGuideIdentifier)) {
          return false;
        }
        emergencyGuideCollectionIdentifiers.push(emergencyGuideIdentifier);
        return true;
      });
      return [...emergencyGuidesToAdd, ...emergencyGuideCollection];
    }
    return emergencyGuideCollection;
  }
}
