import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmergencyGuidePage, NewEmergencyGuidePage } from '../emergency-guide-page.model';

export type PartialUpdateEmergencyGuidePage = Partial<IEmergencyGuidePage> & Pick<IEmergencyGuidePage, 'id'>;

export type EntityResponseType = HttpResponse<IEmergencyGuidePage>;
export type EntityArrayResponseType = HttpResponse<IEmergencyGuidePage[]>;

@Injectable({ providedIn: 'root' })
export class EmergencyGuidePageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/emergency-guide-pages');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(emergencyGuidePage: NewEmergencyGuidePage): Observable<EntityResponseType> {
    return this.http.post<IEmergencyGuidePage>(this.resourceUrl, emergencyGuidePage, { observe: 'response' });
  }

  update(emergencyGuidePage: IEmergencyGuidePage): Observable<EntityResponseType> {
    return this.http.put<IEmergencyGuidePage>(
      `${this.resourceUrl}/${this.getEmergencyGuidePageIdentifier(emergencyGuidePage)}`,
      emergencyGuidePage,
      { observe: 'response' }
    );
  }

  partialUpdate(emergencyGuidePage: PartialUpdateEmergencyGuidePage): Observable<EntityResponseType> {
    return this.http.patch<IEmergencyGuidePage>(
      `${this.resourceUrl}/${this.getEmergencyGuidePageIdentifier(emergencyGuidePage)}`,
      emergencyGuidePage,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEmergencyGuidePage>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEmergencyGuidePage[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEmergencyGuidePageIdentifier(emergencyGuidePage: Pick<IEmergencyGuidePage, 'id'>): number {
    return emergencyGuidePage.id;
  }

  compareEmergencyGuidePage(o1: Pick<IEmergencyGuidePage, 'id'> | null, o2: Pick<IEmergencyGuidePage, 'id'> | null): boolean {
    return o1 && o2 ? this.getEmergencyGuidePageIdentifier(o1) === this.getEmergencyGuidePageIdentifier(o2) : o1 === o2;
  }

  addEmergencyGuidePageToCollectionIfMissing<Type extends Pick<IEmergencyGuidePage, 'id'>>(
    emergencyGuidePageCollection: Type[],
    ...emergencyGuidePagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const emergencyGuidePages: Type[] = emergencyGuidePagesToCheck.filter(isPresent);
    if (emergencyGuidePages.length > 0) {
      const emergencyGuidePageCollectionIdentifiers = emergencyGuidePageCollection.map(
        emergencyGuidePageItem => this.getEmergencyGuidePageIdentifier(emergencyGuidePageItem)!
      );
      const emergencyGuidePagesToAdd = emergencyGuidePages.filter(emergencyGuidePageItem => {
        const emergencyGuidePageIdentifier = this.getEmergencyGuidePageIdentifier(emergencyGuidePageItem);
        if (emergencyGuidePageCollectionIdentifiers.includes(emergencyGuidePageIdentifier)) {
          return false;
        }
        emergencyGuidePageCollectionIdentifiers.push(emergencyGuidePageIdentifier);
        return true;
      });
      return [...emergencyGuidePagesToAdd, ...emergencyGuidePageCollection];
    }
    return emergencyGuidePageCollection;
  }
}
