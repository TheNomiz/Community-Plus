import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmergencyStationsPage, NewEmergencyStationsPage } from '../emergency-stations-page.model';

export type PartialUpdateEmergencyStationsPage = Partial<IEmergencyStationsPage> & Pick<IEmergencyStationsPage, 'id'>;

export type EntityResponseType = HttpResponse<IEmergencyStationsPage>;
export type EntityArrayResponseType = HttpResponse<IEmergencyStationsPage[]>;

@Injectable({ providedIn: 'root' })
export class EmergencyStationsPageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/emergency-stations-pages');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(emergencyStationsPage: NewEmergencyStationsPage): Observable<EntityResponseType> {
    return this.http.post<IEmergencyStationsPage>(this.resourceUrl, emergencyStationsPage, { observe: 'response' });
  }

  update(emergencyStationsPage: IEmergencyStationsPage): Observable<EntityResponseType> {
    return this.http.put<IEmergencyStationsPage>(
      `${this.resourceUrl}/${this.getEmergencyStationsPageIdentifier(emergencyStationsPage)}`,
      emergencyStationsPage,
      { observe: 'response' }
    );
  }

  partialUpdate(emergencyStationsPage: PartialUpdateEmergencyStationsPage): Observable<EntityResponseType> {
    return this.http.patch<IEmergencyStationsPage>(
      `${this.resourceUrl}/${this.getEmergencyStationsPageIdentifier(emergencyStationsPage)}`,
      emergencyStationsPage,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEmergencyStationsPage>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEmergencyStationsPage[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEmergencyStationsPageIdentifier(emergencyStationsPage: Pick<IEmergencyStationsPage, 'id'>): number {
    return emergencyStationsPage.id;
  }

  compareEmergencyStationsPage(o1: Pick<IEmergencyStationsPage, 'id'> | null, o2: Pick<IEmergencyStationsPage, 'id'> | null): boolean {
    return o1 && o2 ? this.getEmergencyStationsPageIdentifier(o1) === this.getEmergencyStationsPageIdentifier(o2) : o1 === o2;
  }

  addEmergencyStationsPageToCollectionIfMissing<Type extends Pick<IEmergencyStationsPage, 'id'>>(
    emergencyStationsPageCollection: Type[],
    ...emergencyStationsPagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const emergencyStationsPages: Type[] = emergencyStationsPagesToCheck.filter(isPresent);
    if (emergencyStationsPages.length > 0) {
      const emergencyStationsPageCollectionIdentifiers = emergencyStationsPageCollection.map(
        emergencyStationsPageItem => this.getEmergencyStationsPageIdentifier(emergencyStationsPageItem)!
      );
      const emergencyStationsPagesToAdd = emergencyStationsPages.filter(emergencyStationsPageItem => {
        const emergencyStationsPageIdentifier = this.getEmergencyStationsPageIdentifier(emergencyStationsPageItem);
        if (emergencyStationsPageCollectionIdentifiers.includes(emergencyStationsPageIdentifier)) {
          return false;
        }
        emergencyStationsPageCollectionIdentifiers.push(emergencyStationsPageIdentifier);
        return true;
      });
      return [...emergencyStationsPagesToAdd, ...emergencyStationsPageCollection];
    }
    return emergencyStationsPageCollection;
  }
}
